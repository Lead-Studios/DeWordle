import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { ContributionCacheService } from './contribution-cache.service';
import type { ContributionMetricsService } from './contribution-metrics.service';
import type { UserContributionService } from './user-contribution.service';
import type { ContributionAchievementService } from './contribution-achievement.service';

@Injectable()
export class ContributionSchedulerService {
  private readonly logger = new Logger(ContributionSchedulerService.name);

  constructor(
    private readonly cacheService: ContributionCacheService,
    private readonly metricsService: ContributionMetricsService,
    private readonly userContributionService: UserContributionService,
    private readonly achievementService: ContributionAchievementService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCacheInvalidation() {
    this.logger.log('Running scheduled cache invalidation');
    await this.cacheService.invalidateLeaderboardCache();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateDailyMetrics() {
    this.logger.log('Generating daily contribution metrics');
    await this.metricsService.generateDailyMetrics();
  }

  @Cron(CronExpression.EVERY_WEEK)
  async generateWeeklyMetrics() {
    this.logger.log('Generating weekly contribution metrics');
    await this.metricsService.generateWeeklyMetrics();
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async generateMonthlyMetrics() {
    this.logger.log('Generating monthly contribution metrics');
    await this.metricsService.generateMonthlyMetrics();
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async checkAndAwardAchievements(user) {
    this.logger.log('Checking and awarding achievements');

    // Get all users with contributions
    const users =
      await this.userContributionService.getAllUsersWithContributions();

    for (const user of users) {
      await this.achievementService.checkAndAwardAchievements(user.userId);
    }

    this.logger.log('Finished checking and awarding achievements');
  }
}
