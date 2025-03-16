import { Injectable, Logger } from '@nestjs/common';
import type { UserContributionRepository } from '../repositories/user-contribution.repository';
import { UserContributionEntity } from '../entities/user-contribution.entity';
import { ContributionTypeEnum } from '../enums/contribution-type.enum';
import type { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class UserContributionService {
  private readonly logger = new Logger(UserContributionService.name);

  constructor(
    private readonly userContributionRepository: UserContributionRepository,
  ) {}

  async updateUserContribution(
    userId: string,
    contributionType: string,
    points: number,
  ): Promise<UserContributionEntity> {
    this.logger.log(
      `Updating user contribution for user: ${userId}, type: ${contributionType}, points: ${points}`,
    );

    // Get existing user contribution or create new one
    let userContribution =
      await this.userContributionRepository.findByUserId(userId);

    if (!userContribution) {
      userContribution = new UserContributionEntity();
      userContribution.userId = userId;
      userContribution.totalPoints = 0;
      userContribution.submissionCount = 0;
      userContribution.editCount = 0;
      userContribution.approvalCount = 0;
      userContribution.commentCount = 0;
    }

    // Update counts based on contribution type
    switch (contributionType) {
      case ContributionTypeEnum.SUBMISSION:
        userContribution.submissionCount += 1;
        break;
      case ContributionTypeEnum.EDIT:
        userContribution.editCount += 1;
        break;
      case ContributionTypeEnum.APPROVAL:
        userContribution.approvalCount += 1;
        break;
      case ContributionTypeEnum.COMMENT:
        userContribution.commentCount += 1;
        break;
      default:
        // Handle other contribution types
        break;
    }

    // Update total points and last contribution date
    userContribution.totalPoints += points;
    userContribution.lastContributionDate = new Date();

    // Save updated user contribution
    return this.userContributionRepository.save(userContribution);
  }

  async getLeaderboard(
    startDate: Date,
    endDate: Date,
    contributionType?: ContributionTypeEnum,
    pagination?: PaginationDto,
  ) {
    this.logger.log(
      `Getting leaderboard between ${startDate} and ${endDate}, type: ${contributionType}`,
    );

    return this.userContributionRepository.getLeaderboard(
      startDate,
      endDate,
      contributionType,
      pagination,
    );
  }

  async getUserRank(userId: string, timeRange: string): Promise<number> {
    return this.userContributionRepository.getUserRank(userId, timeRange);
  }

  async getUserContributionSummary(
    userId: string,
  ): Promise<UserContributionEntity> {
    const userContribution =
      await this.userContributionRepository.findByUserId(userId);

    if (!userContribution) {
      // Return default empty summary
      return {
        userId,
        totalPoints: 0,
        submissionCount: 0,
        editCount: 0,
        approvalCount: 0,
        commentCount: 0,
        lastContributionDate: null,
      } as UserContributionEntity;
    }

    return userContribution;
  }

  async getAllUsersWithContributions(): Promise<UserContributionEntity[]> {
    return this.userContributionRepository.getAllUsersWithContributions();
  }
}
