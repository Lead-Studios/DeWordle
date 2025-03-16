import { Injectable } from '@nestjs/common';
import type { EventEmitter2 } from '@nestjs/event-emitter';
import type { CreateContributionDto } from '../dto/create-contribution.dto';
import type { AchievementEntity } from '../entities/achievement.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ContributionEventEmitter {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly user: User,
  ) {}

  emitContributionCreated(contribution: CreateContributionDto): void {
    this.eventEmitter.emit('contribution.created', contribution);
  }

  emitAchievementAwarded(userId: string, achievement: AchievementEntity): void {
    this.eventEmitter.emit('achievement.awarded', { userId, achievement });
  }

  emitLeaderboardUpdated(): void {
    this.eventEmitter.emit('leaderboard.updated');
  }

  emitUserRankChanged(userId: string, oldRank: number, newRank: number): void {
    this.eventEmitter.emit(this.user.rank, userId, oldRank, newRank);
  }
}
