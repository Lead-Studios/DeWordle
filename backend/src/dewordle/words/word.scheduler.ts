import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Not, IsNull } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Word } from 'src/entities/word.entity';
import moment from 'moment-timezone';
import { createHash, randomUUID } from 'crypto';

/**
 * Legacy daily word scheduler.
 *
 * This scheduler relies on the `words` table's `isDaily` and `dailyDate`
 * columns to select one word per calendar day. During the Soroban migration
 * the canonical daily word selection will move to a Soroban contract that
 * deterministically selects a word from the onchain word pool.
 *
 * Transitional behaviour:
 * - Until the Soroban daily puzzle contract is fully deployed and the
 *   indexer projects daily puzzle state, this legacy cron remains active.
 * - Once the Soroban flow is stable (target: Wave 6), this entire class
 *   should be replaced by the Soroban-native schedule. All direct DB
 *   word-selection logic will be removed.
 *
 * @deprecated Will be removed after Soroban daily puzzle contract
 *   deployment is verified and the indexer projects daily puzzle state.
 */

/** Default local rotation time (HH:mm) inside the configured timezone. */
export const DEFAULT_ROTATION_TIME = '00:00';
const DEFAULT_MAX_ATTEMPTS = 3;
const RETRY_BACKOFF_MS = 5_000;

/**
 * Build the cron expression used for the daily rotation.
 *
 * `DAILY_WORD_SCHEDULE` keeps full control for advanced deployments, while
 * `DAILY_WORD_ROTATION_TIME` (HH:mm) is the friendlier knob. Both are
 * interpreted in `DAILY_WORD_TIMEZONE`, so the rotation always happens at the
 * same *local* wall-clock time — including across daylight saving transitions
 * because the cron engine re-resolves the timezone offset on every tick.
 */
export function resolveRotationCronExpression(
  schedule?: string,
  rotationTime?: string,
): string {
  if (schedule && schedule.trim().length > 0) {
    return schedule.trim();
  }

  const match = /^(\d{1,2}):(\d{2})$/.exec(
    (rotationTime ?? DEFAULT_ROTATION_TIME).trim(),
  );
  if (!match) {
    return CronExpression.EVERY_DAY_AT_MIDNIGHT;
  }

  const hours = Math.min(Math.max(Number.parseInt(match[1], 10), 0), 23);
  const minutes = Math.min(Math.max(Number.parseInt(match[2], 10), 0), 59);
  return `${minutes} ${hours} * * *`;
}

/**
 * Rotation telemetry deliberately records a truncated SHA-256 digest instead
 * of the word itself, so operational logs never leak tomorrow's puzzle.
 */
export function hashWord(word: string): string {
  return createHash('sha256').update(word).digest('hex').slice(0, 16);
}

@Injectable()
export class WordScheduler implements OnModuleInit {
  private readonly logger = new Logger(WordScheduler.name);

  constructor(
    @InjectRepository(Word)
    private readonly wordRepo: Repository<Word>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.runRotation('startup');
  }

  @Cron(
    resolveRotationCronExpression(
      process.env.DAILY_WORD_SCHEDULE,
      process.env.DAILY_WORD_ROTATION_TIME,
    ),
    {
      // The rotation is pinned to a wall-clock time in this timezone so
      // deployment-local server time can never shift the daily word selection.
      timeZone: process.env.DAILY_WORD_TIMEZONE || 'UTC',
    },
  )
  async handleDailyWordSelection() {
    await this.runRotation('cron');
  }

  private timezone(): string {
    return this.configService.get<string>('DAILY_WORD_TIMEZONE') || 'UTC';
  }

  /**
   * Resolve the puzzle date for the configured timezone as a UTC instant
   * (local midnight converted to UTC). `moment-timezone` resolves the correct
   * offset for the given calendar day, which keeps the stored instant correct
   * on both sides of a daylight saving transition.
   */
  private puzzleDateFor(timezone: string): { day: string; date: Date } {
    const day = moment().tz(timezone).startOf('day').format('YYYY-MM-DD');
    return {
      day,
      date: moment.tz(day, timezone).startOf('day').utc().toDate(),
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Wrap rotation in bounded retries so a transient database failure does not
   * silently skip a day. Failures are logged with a correlation id and the
   * attempt number; the next cron tick still runs as a safety net.
   */
  private async runRotation(trigger: string): Promise<void> {
    const correlationId = randomUUID();
    const maxAttempts = Math.max(
      Number.parseInt(
        this.configService.get<string>('DAILY_WORD_ROTATION_MAX_ATTEMPTS') ??
          String(DEFAULT_MAX_ATTEMPTS),
        10,
      ) || DEFAULT_MAX_ATTEMPTS,
      1,
    );

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      const startedAt = Date.now();
      try {
        await this.ensureTodayWord(correlationId);
        this.logger.log({
          message: 'daily-word.rotation.completed',
          trigger,
          correlationId,
          attempt,
          durationMs: Date.now() - startedAt,
        });
        return;
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        this.logger.error({
          message: 'daily-word.rotation.failed',
          trigger,
          correlationId,
          attempt,
          maxAttempts,
          reason,
        });

        if (attempt === maxAttempts) {
          return;
        }
        await this.delay(RETRY_BACKOFF_MS * attempt);
      }
    }
  }

  async ensureTodayWord(correlationId?: string) {
    const timezone = this.timezone();
    const { day: today, date: todayDate } = this.puzzleDateFor(timezone);

    const existing = await this.wordRepo.findOneBy({ dailyDate: todayDate });
    if (existing) {
      this.logger.log({
        message: 'daily-word.rotation.skipped',
        correlationId: correlationId ?? randomUUID(),
        timezone,
        puzzleDate: today,
        utcOffsetMinutes: moment().tz(timezone).utcOffset(),
        wordHash: hashWord(existing.word),
      });
      return;
    }

    await this.dataSource.transaction(async (manager) => {
      const unusedWord = await manager.findOne(Word, {
        where: { isDaily: false },
        order: { createdAt: 'ASC' },
      });

      if (!unusedWord) {
        this.logger.warn('Word pool exhausted. Resetting...');
        await manager.update(Word, { id: Not(IsNull()) }, { isDaily: false });
        return;
      }

      await manager.update(
        Word,
        { id: unusedWord.id },
        { isDaily: true, dailyDate: todayDate },
      );

      this.logger.log({
        message: 'daily-word.rotation.selected',
        correlationId: correlationId ?? randomUUID(),
        timezone,
        puzzleDate: today,
        utcOffsetMinutes: moment().tz(timezone).utcOffset(),
        wordHash: hashWord(unusedWord.word),
      });
    });
  }

  /**
   * Force a new word for the current puzzle day. Used by the admin-only manual
   * rotation endpoint; the previous word keeps its history but is no longer
   * flagged as the daily puzzle.
   */
  async rotateNow(): Promise<{
    status: string;
    timezone: string;
    puzzleDate: string;
    wordHash: string;
    rotatedAt: string;
  }> {
    const correlationId = randomUUID();
    const timezone = this.timezone();
    const { day: today, date: todayDate } = this.puzzleDateFor(timezone);

    const previous = await this.wordRepo.findOneBy({ dailyDate: todayDate });

    let rotated: Word | null = null;

    await this.dataSource.transaction(async (manager) => {
      if (previous) {
        await manager.update(
          Word,
          { id: previous.id },
          { isDaily: false, dailyDate: null },
        );
      }

      let candidate = await manager.findOne(Word, {
        where: { isDaily: false },
        order: { createdAt: 'ASC' },
      });

      if (!candidate) {
        this.logger.warn('Word pool exhausted during manual rotation. Resetting...');
        await manager.update(Word, { id: Not(IsNull()) }, { isDaily: false });
        candidate = await manager.findOne(Word, {
          where: { isDaily: false },
          order: { createdAt: 'ASC' },
        });
      }

      if (!candidate) {
        throw new Error('Word pool is empty; manual rotation aborted');
      }

      await manager.update(
        Word,
        { id: candidate.id },
        { isDaily: true, dailyDate: todayDate },
      );
      rotated = candidate;
    });

    const wordHash = rotated ? hashWord(rotated.word) : 'unknown';
    this.logger.log({
      message: 'daily-word.rotation.manual',
      correlationId,
      timezone,
      puzzleDate: today,
      wordHash,
    });

    return {
      status: 'Rotated',
      timezone,
      puzzleDate: today,
      wordHash,
      rotatedAt: new Date().toISOString(),
    };
  }
}
