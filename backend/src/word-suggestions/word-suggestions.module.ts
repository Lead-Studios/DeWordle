import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Injectable,
  Module,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-guard.guard';
import { User } from '../auth/entities/user.entity';
import { Word } from '../entities/word.entity';
import { WordSuggestion } from './entities/word-suggestion.entity';

const MAX_LIST_LIMIT = 100;

export class CreateWordSuggestionDto {
  @ApiProperty({ example: 'crane', description: 'A 5-letter word to suggest' })
  @IsString()
  @Length(5, 5, { message: 'Word suggestions must be exactly 5 letters long' })
  word: string;
}

@Injectable()
export class WordSuggestionsService {
  constructor(
    @InjectRepository(WordSuggestion)
    private readonly suggestionRepo: Repository<WordSuggestion>,
    @InjectRepository(Word)
    private readonly wordRepo: Repository<Word>,
  ) {}

  async create(rawWord: string, user: User): Promise<WordSuggestion> {
    const word = rawWord.toLowerCase().trim();

    if (!/^[a-z]{5}$/.test(word)) {
      throw new BadRequestException('Word suggestions must contain letters only');
    }

    const inDictionary = await this.wordRepo.findOne({
      where: { word },
      select: ['id'],
    });
    if (inDictionary) {
      throw new ConflictException(`"${word}" is already in the dictionary`);
    }

    const alreadySuggested = await this.suggestionRepo.findOne({
      where: { word },
      select: ['id', 'voteCount'],
    });
    if (alreadySuggested) {
      throw new ConflictException(`"${word}" has already been suggested`);
    }

    const suggestion = this.suggestionRepo.create({
      word,
      submittedBy: user.username || `user:${user.id}`,
      voteCount: 0,
      voters: [],
    });

    try {
      return await this.suggestionRepo.save(suggestion);
    } catch {
      // Unique constraint race: another request inserted the same word first.
      throw new ConflictException(`"${word}" has already been suggested`);
    }
  }

  async vote(id: number, user: User): Promise<WordSuggestion> {
    const suggestion = await this.suggestionRepo.findOneBy({ id });
    if (!suggestion) throw new NotFoundException('Suggestion not found');

    const voterKey = String(user.id);
    const voters = suggestion.voters ?? [];
    if (voters.includes(voterKey)) {
      throw new ConflictException('You have already voted for this suggestion');
    }

    suggestion.voters = [...voters, voterKey];
    suggestion.voteCount = (suggestion.voteCount ?? 0) + 1;

    return this.suggestionRepo.save(suggestion);
  }

  async list(limit: number): Promise<WordSuggestion[]> {
    const take = Math.min(Math.max(Number(limit) || 50, 1), MAX_LIST_LIMIT);
    return this.suggestionRepo.find({
      order: { voteCount: 'DESC', createdAt: 'ASC' },
      take,
    });
  }
}

@ApiTags('Word Suggestions')
@Controller('words')
export class WordSuggestionsController {
  constructor(private readonly wordSuggestionsService: WordSuggestionsService) {}

  @Post('suggest')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a new word suggestion' })
  @ApiResponse({ status: 409, description: 'Word is already known or suggested' })
  createSuggestion(
    @Body() dto: CreateWordSuggestionDto,
    @Req() req: Request,
  ): Promise<WordSuggestion> {
    return this.wordSuggestionsService.create(dto.word, req.user as User);
  }

  @Post('suggest/:id/vote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upvote a word suggestion' })
  @ApiResponse({ status: 404, description: 'Suggestion not found' })
  @ApiResponse({ status: 409, description: 'Already voted for this suggestion' })
  voteSuggestion(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<WordSuggestion> {
    return this.wordSuggestionsService.vote(id, req.user as User);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'List word suggestions sorted by votes' })
  @ApiOkResponse({ description: 'Suggestions ordered by vote count.' })
  listSuggestions(@Query('limit') limit?: string) {
    return this.wordSuggestionsService.list(limit ? Number(limit) : 50);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([WordSuggestion, Word])],
  controllers: [WordSuggestionsController],
  providers: [WordSuggestionsService],
  exports: [WordSuggestionsService],
})
export class WordSuggestionsModule {}
