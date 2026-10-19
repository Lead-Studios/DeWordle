import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Module,
  NotFoundException,
  OnModuleDestroy,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { IsInt, IsNumber, Max, Min } from 'class-validator';
import { WordsModule } from '../dewordle/words/words.module';
import { WordsService } from '../dewordle/words/words.service';
import { Match, MatchStatus } from './entities/match.entity';

/** Max distance between two skill scores for an automatic pairing. */
const SKILL_TOLERANCE = 25;
/** How long a player waits in the queue before falling back to a solo match. */
const MATCH_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 6;

export class JoinQueueDto {
  @ApiProperty({ example: 42 })
  @IsInt()
  @Min(1)
  playerId: number;

  @ApiProperty({ example: 0.62, description: 'Historic win rate between 0 and 1' })
  @IsNumber()
  @Min(0)
  @Max(1)
  winRate: number;

  @ApiProperty({ example: 4.2, description: 'Historic average attempts per win' })
  @IsNumber()
  @Min(1)
  @Max(MAX_ATTEMPTS)
  avgAttempts: number;
}

export class SubmitResultDto {
  @ApiProperty({ example: 42 })
  @IsInt()
  @Min(1)
  playerId: number;

  @ApiProperty({ example: 4 })
  @IsInt()
  @Min(1)
  @Max(MAX_ATTEMPTS)
  attempts: number;
}

interface QueueEntry {
  playerId: number;
  skillScore: number;
  joinedAt: Date;
  timer: ReturnType<typeof setTimeout>;
}

/** Composite skill score: win rate (0-100) plus attempt efficiency (0-30). */
export function computeSkillScore(winRate: number, avgAttempts: number): number {
  return winRate * 100 + (MAX_ATTEMPTS - avgAttempts) * 5;
}

class MatchmakingService implements OnModuleDestroy {
  private readonly logger = new Logger(MatchmakingService.name);
  private readonly queue = new Map<number, QueueEntry>();

  constructor(
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,
    private readonly wordsService: WordsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  onModuleDestroy(): void {
    for (const entry of this.queue.values()) {
      clearTimeout(entry.timer);
    }
    this.queue.clear();
  }

  async enqueue(dto: JoinQueueDto): Promise<Record<string, unknown>> {
    if (this.queue.has(dto.playerId)) {
      const entry = this.queue.get(dto.playerId) as QueueEntry;
      return {
        status: 'queued',
        queuePosition: this.positionInQueue(dto.playerId),
        waitingMs: Date.now() - entry.joinedAt.getTime(),
      };
    }

    const skillScore = computeSkillScore(dto.winRate, dto.avgAttempts);
    const opponent = this.findOpponent(dto.playerId, skillScore);

    if (opponent) {
      const match = await this.createMatch(
        { playerId: opponent.playerId, skillScore: opponent.skillScore },
        { playerId: dto.playerId, skillScore },
      );
      return { status: 'matched', match };
    }

    const timer = setTimeout(() => {
      void this.onQueueTimeout(dto.playerId, skillScore);
    }, MATCH_TIMEOUT_MS);

    this.queue.set(dto.playerId, {
      playerId: dto.playerId,
      skillScore,
      joinedAt: new Date(),
      timer,
    });

    this.logger.log(
      `Player ${dto.playerId} queued for matchmaking (skillScore=${skillScore.toFixed(1)}, queueSize=${this.queue.size})`,
    );

    return {
      status: 'queued',
      queuePosition: this.positionInQueue(dto.playerId),
      timeoutMs: MATCH_TIMEOUT_MS,
    };
  }

  async getMatch(id: number): Promise<Match> {
    const match = await this.matchRepo.findOneBy({ id });
    if (!match) throw new NotFoundException('Match not found');
    return match;
  }

  async submitResult(id: number, dto: SubmitResultDto): Promise<Match> {
    const match = await this.matchRepo.findOneBy({ id });
    if (!match) throw new NotFoundException('Match not found');
    if (match.status === MatchStatus.COMPLETED) {
      throw new BadRequestException('Match already completed');
    }

    const isPlayer1 = match.player1Id === dto.playerId;
    const isPlayer2 = match.player2Id === dto.playerId;
    if (!isPlayer1 && !isPlayer2) {
      throw new BadRequestException('Player is not part of this match');
    }

    if (isPlayer1) {
      match.player1Attempts = dto.attempts;
    } else {
      match.player2Attempts = dto.attempts;
    }

    const bothSubmitted =
      match.player1Attempts !== null &&
      (match.player2Id === null || match.player2Attempts !== null);

    if (bothSubmitted) {
      match.status =
        match.player2Id === null ? MatchStatus.SOLO : MatchStatus.COMPLETED;
      match.completedAt = new Date();
      this.eventEmitter.emit('match.completed', {
        matchId: match.id,
        sharedSessionId: match.sharedSessionId,
        player1Id: match.player1Id,
        player2Id: match.player2Id,
        player1Attempts: match.player1Attempts,
        player2Attempts: match.player2Attempts,
      });
    }

    return this.matchRepo.save(match);
  }

  private findOpponent(
    playerId: number,
    skillScore: number,
  ): QueueEntry | undefined {
    let best: QueueEntry | undefined;
    let bestDistance = SKILL_TOLERANCE;

    for (const entry of this.queue.values()) {
      if (entry.playerId === playerId) continue;
      const distance = Math.abs(entry.skillScore - skillScore);
      if (distance <= bestDistance) {
        best = entry;
        bestDistance = distance;
      }
    }

    if (best) {
      clearTimeout(best.timer);
      this.queue.delete(best.playerId);
    }

    return best;
  }

  private async createMatch(
    player1: { playerId: number; skillScore: number },
    player2: { playerId: number; skillScore: number },
  ): Promise<Match> {
    const { word } = await this.wordsService.getRandomWord();

    const match = this.matchRepo.create({
      sharedSessionId: randomUUID(),
      targetWord: word,
      player1Id: player1.playerId,
      player1SkillScore: player1.skillScore,
      player2Id: player2.playerId,
      player2SkillScore: player2.skillScore,
      status: MatchStatus.ACTIVE,
    });

    const saved = await this.matchRepo.save(match);

    this.eventEmitter.emit('match.found', {
      matchId: saved.id,
      sharedSessionId: saved.sharedSessionId,
      targetWord: saved.targetWord,
      playerIds: [saved.player1Id, saved.player2Id],
    });

    this.logger.log(
      `Match ${saved.id} created for players ${saved.player1Id} vs ${saved.player2Id}`,
    );

    return saved;
  }

  private async createSoloMatch(
    playerId: number,
    skillScore: number,
  ): Promise<Match> {
    const { word } = await this.wordsService.getRandomWord();

    const match = this.matchRepo.create({
      sharedSessionId: randomUUID(),
      targetWord: word,
      player1Id: playerId,
      player1SkillScore: skillScore,
      player2Id: null,
      player2SkillScore: null,
      status: MatchStatus.SOLO,
    });

    const saved = await this.matchRepo.save(match);

    this.eventEmitter.emit('match.found', {
      matchId: saved.id,
      sharedSessionId: saved.sharedSessionId,
      targetWord: saved.targetWord,
      playerIds: [saved.player1Id],
      solo: true,
    });

    this.logger.log(
      `Queue timeout: solo match ${saved.id} for player ${playerId}`,
    );

    return saved;
  }

  private async onQueueTimeout(
    playerId: number,
    skillScore: number,
  ): Promise<void> {
    if (!this.queue.delete(playerId)) return;

    try {
      await this.createSoloMatch(playerId, skillScore);
    } catch (error) {
      this.logger.error(
        `Failed to create solo match for player ${playerId}: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
    }
  }

  private positionInQueue(playerId: number): number {
    const sorted = [...this.queue.values()].sort(
      (a, b) => a.joinedAt.getTime() - b.joinedAt.getTime(),
    );
    return sorted.findIndex((entry) => entry.playerId === playerId) + 1;
  }
}

@Controller('matches')
class MatchmakingController {
  constructor(private readonly matchmakingService: MatchmakingService) {}

  @Post('queue')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Join the competitive matchmaking queue',
    description:
      'Adds a player to the skill-based matchmaking queue. If a compatible opponent is waiting a match is created immediately; otherwise the player queues for up to 30 seconds before falling back to a solo match.',
  })
  @ApiOkResponse({ description: 'Queue status with match details when matched.' })
  joinQueue(@Body() dto: JoinQueueDto) {
    return this.matchmakingService.enqueue(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a match, including the shared target word' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  getMatch(@Param('id', ParseIntPipe) id: number) {
    return this.matchmakingService.getMatch(id);
  }

  @Post(':id/result')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit the attempt count for a player in a match' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  @ApiResponse({ status: 400, description: 'Match already completed or player not in match' })
  submitResult(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SubmitResultDto,
  ) {
    return this.matchmakingService.submitResult(id, dto);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Match]), WordsModule],
  controllers: [MatchmakingController],
  providers: [MatchmakingService],
  exports: [MatchmakingService],
})
export class MatchmakingModule {}
