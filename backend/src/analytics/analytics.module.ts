import {
  BadRequestException,
  Controller,
  Get,
  Injectable,
  Logger,
  Module,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-guard.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { GameSession } from '../game-sessions/entities/game-session.entity';
import { GameSessionStatus } from '../game-sessions/game-sessions.constants';

/** Aggregated responses are reused for ten minutes before being recomputed. */
const CACHE_TTL_MS = 10 * 60 * 1000;
const DEFAULT_RANGE_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export class SessionAnalyticsQueryDto {
  @ApiPropertyOptional({
    example: '2026-01-01T00:00:00.000Z',
    description: 'Inclusive start of the reporting window (ISO 8601).',
  })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({
    example: '2026-02-01T00:00:00.000Z',
    description: 'Inclusive end of the reporting window (ISO 8601).',
  })
  @IsOptional()
  @IsDateString()
  to?: string;
}

export interface DailyActivePlayersPoint {
  date: string;
  activePlayers: number;
}

export interface SessionAnalyticsResult {
  from: string;
  to: string;
  totalSessions: number;
  wonSessions: number;
  lostSessions: number;
  winRate: number;
  averageAttempts: number | null;
  dailyActivePlayers: DailyActivePlayersPoint[];
  generatedAt: string;
}

@Injectable()
export class SessionAnalyticsService {
  private readonly logger = new Logger(SessionAnalyticsService.name);
  private readonly cache = new Map<
    string,
    { expiresAt: number; value: SessionAnalyticsResult }
  >();

  constructor(
    @InjectRepository(GameSession)
    private readonly sessionRepository: Repository<GameSession>,
  ) {}

  async getSummary(
    query: SessionAnalyticsQueryDto,
  ): Promise<SessionAnalyticsResult> {
    const to = query.to ? new Date(query.to) : new Date();
    const from = query.from
      ? new Date(query.from)
      : new Date(to.getTime() - DEFAULT_RANGE_DAYS * MS_PER_DAY);

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      throw new BadRequestException('Invalid date range');
    }
    if (from.getTime() > to.getTime()) {
      throw new BadRequestException('"from" must be before "to"');
    }

    const cacheKey = `${from.toISOString()}|${to.toISOString()}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    const value = await this.aggregate(from, to);
    this.cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, value });
    this.logger.log(
      `Session analytics computed for ${cacheKey} (total=${value.totalSessions})`,
    );

    return value;
  }

  private async aggregate(
    from: Date,
    to: Date,
  ): Promise<SessionAnalyticsResult> {
    const inRange = () =>
      this.sessionRepository
        .createQueryBuilder('session')
        .where('session.playedAt BETWEEN :from AND :to', { from, to });

    const totalSessions = await inRange().getCount();
    const wonSessions = await inRange()
      .andWhere('session.status = :status', { status: GameSessionStatus.WON })
      .getCount();
    const lostSessions = await inRange()
      .andWhere('session.status = :status', { status: GameSessionStatus.LOST })
      .getCount();

    // Average number of attempts per winning session.
    const attemptRows = await this.sessionRepository
      .createQueryBuilder('session')
      .innerJoin('session.history', 'history')
      .select('session.id', 'sessionId')
      .addSelect('MAX(history.attemptNumber)', 'attempts')
      .where('session.status = :status', { status: GameSessionStatus.WON })
      .andWhere('session.playedAt BETWEEN :from AND :to', { from, to })
      .groupBy('session.id')
      .getRawMany<{ sessionId: number; attempts: string }>();

    const averageAttempts = attemptRows.length
      ? Math.round(
          (attemptRows.reduce((sum, row) => sum + Number(row.attempts), 0) /
            attemptRows.length) *
            100,
        ) / 100
      : null;

    const dailyRows = await this.sessionRepository
      .createQueryBuilder('session')
      .leftJoin('session.user', 'user')
      .select('DATE(session.playedAt)', 'date')
      .addSelect('COUNT(DISTINCT user.id)', 'activePlayers')
      .where('session.playedAt BETWEEN :from AND :to', { from, to })
      .andWhere('user.id IS NOT NULL')
      .groupBy('DATE(session.playedAt)')
      .orderBy('date', 'ASC')
      .getRawMany<{ date: string; activePlayers: string }>();

    const completedSessions = wonSessions + lostSessions;

    return {
      from: from.toISOString(),
      to: to.toISOString(),
      totalSessions,
      wonSessions,
      lostSessions,
      winRate:
        completedSessions > 0
          ? Math.round((wonSessions / completedSessions) * 10000) / 10000
          : 0,
      averageAttempts,
      dailyActivePlayers: dailyRows.map((row) => ({
        date: row.date,
        activePlayers: Number(row.activePlayers),
      })),
      generatedAt: new Date().toISOString(),
    };
  }
}

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class SessionAnalyticsController {
  constructor(private readonly sessionAnalyticsService: SessionAnalyticsService) {}

  @Get('sessions')
  @ApiOperation({
    summary: 'Aggregated game session analytics',
    description:
      'Returns total sessions, win rate, average winning attempts and daily active players for the requested window (defaults to the last 30 days). Responses are cached for ten minutes.',
  })
  @ApiOkResponse({ description: 'Aggregate session statistics.' })
  getSessionAnalytics(@Query() query: SessionAnalyticsQueryDto) {
    return this.sessionAnalyticsService.getSummary(query);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([GameSession])],
  controllers: [SessionAnalyticsController],
  providers: [SessionAnalyticsService],
  exports: [SessionAnalyticsService],
})
export class AnalyticsModule {}
