import {
  Controller,
  Get,
  Global,
  Injectable,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Word } from '../../../entities/word.entity';

/** How often the cache re-checks the database for added/removed words. */
const RECONCILE_INTERVAL_MS = 60_000;

export interface WordCacheStatus {
  loaded: boolean;
  wordCount: number;
  lastLoadedAt: string | null;
  lastLoadDurationMs: number | null;
  heapUsedMb: number;
  hits: number;
  misses: number;
  lastReloadReason: string | null;
}

@Injectable()
export class WordCacheService implements OnModuleInit {
  private readonly logger = new Logger(WordCacheService.name);
  private readonly cache = new Set<string>();
  private loaded = false;
  private lastLoadedAt: Date | null = null;
  private lastLoadDurationMs: number | null = null;
  private lastReloadReason: string | null = null;
  private hits = 0;
  private misses = 0;

  constructor(
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.reload('startup');
  }

  /**
   * Fast-path invalidation hooks. Emitters may publish `word.created` or
   * `word.deleted` after dictionary writes; the periodic reconciliation
   * interval below guarantees eventual correctness even when no event fires.
   */
  @OnEvent('word.created')
  @OnEvent('word.deleted')
  async invalidate(reason: string): Promise<void> {
    await this.reload(reason || 'event');
  }

  @Interval(RECONCILE_INTERVAL_MS)
  async reconcile(): Promise<void> {
    try {
      const dbCount = await this.wordRepository.count();
      if (dbCount !== this.cache.size) {
        this.logger.log(
          `Dictionary drift detected (db=${dbCount}, cache=${this.cache.size}); reloading`,
        );
        await this.reload('reconcile');
      }
    } catch (error) {
      this.logger.warn(
        `Word cache reconciliation failed: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
    }
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  has(word: string): boolean {
    const found = this.cache.has(word);
    if (found) {
      this.hits += 1;
    } else {
      this.misses += 1;
    }
    return found;
  }

  size(): number {
    return this.cache.size;
  }

  status(): WordCacheStatus {
    return {
      loaded: this.loaded,
      wordCount: this.cache.size,
      lastLoadedAt: this.lastLoadedAt ? this.lastLoadedAt.toISOString() : null,
      lastLoadDurationMs: this.lastLoadDurationMs,
      heapUsedMb: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 10) / 10,
      hits: this.hits,
      misses: this.misses,
      lastReloadReason: this.lastReloadReason,
    };
  }

  private async reload(reason: string): Promise<void> {
    const startedAt = Date.now();
    const words = await this.wordRepository.find({ select: ['word'] });

    this.cache.clear();
    for (const row of words) {
      this.cache.add(row.word.toLowerCase());
    }

    this.loaded = true;
    this.lastLoadedAt = new Date();
    this.lastLoadDurationMs = Date.now() - startedAt;
    this.lastReloadReason = reason;

    const { heapUsed } = process.memoryUsage();
    this.logger.log(
      `Word cache loaded (${reason}): words=${this.cache.size}, loadTimeMs=${this.lastLoadDurationMs}, heapUsedMb=${Math.round(heapUsed / 1024 / 1024)}`,
    );
  }
}

@ApiTags('Words')
@Controller('words/cache')
export class WordCacheController {
  constructor(private readonly wordCacheService: WordCacheService) {}

  @Get('health')
  @ApiOperation({
    summary: 'Word validation cache health',
    description:
      'Reports whether the in-memory dictionary cache is loaded, its word count, load timing and memory usage.',
  })
  @ApiOkResponse({ description: 'Cache status snapshot.' })
  getStatus() {
    return this.wordCacheService.status();
  }
}

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Word])],
  controllers: [WordCacheController],
  providers: [WordCacheService],
  exports: [WordCacheService],
})
export class WordCacheModule {}
