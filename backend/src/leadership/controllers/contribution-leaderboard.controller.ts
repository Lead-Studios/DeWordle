import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseInterceptors,
  // CacheInterceptor,
  HttpStatus,
  HttpCode,
  ValidationPipe,
  ParseIntPipe,
  DefaultValuePipe,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import type { ContributionLeaderboardService } from '../services/contribution-leaderboard.service';
import type { GetLeaderboardDto } from '../dto/get-leaderboard.dto';
import { CreateContributionDto } from '../dto/create-contribution.dto';
import { LeaderboardResponseDto } from '../dto/leaderboard-response.dto';
import { TimeRangeEnum } from '../enums/time-range.enum';
import { ContributionTypeEnum } from '../enums/contribution-type.enum';
import type { ContributionEventEmitter } from '../events/contribution-event.emitter';
import type { ContributionLoggerService } from '../services/contribution-logger.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('Contribution Leaderboard')
@Controller('contribution-leaderboard')
export class ContributionLeaderboardController {
  private readonly logger = new Logger(ContributionLeaderboardController.name);

  constructor(
    private readonly leaderboardService: ContributionLeaderboardService,
    private readonly eventEmitter: ContributionEventEmitter,
    private readonly loggerService: ContributionLoggerService,
  ) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get contribution leaderboard' })
  @ApiQuery({ name: 'timeRange', enum: TimeRangeEnum, required: false })
  @ApiQuery({
    name: 'contributionType',
    enum: ContributionTypeEnum,
    required: false,
  })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiResponse({
    status: 200,
    description: 'Return leaderboard data',
    type: LeaderboardResponseDto,
  })
  async getLeaderboard(
    @Query('timeRange', new DefaultValuePipe(TimeRangeEnum.ALL_TIME))
    timeRange: TimeRangeEnum,
    @Query('contributionType') contributionType: ContributionTypeEnum,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<LeaderboardResponseDto> {
    this.logger.log(
      `Getting leaderboard for timeRange: ${timeRange}, contributionType: ${contributionType}, page: ${page}, limit: ${limit}`,
    );

    const dto: GetLeaderboardDto = {
      timeRange,
      contributionType,
      pagination: { page, limit },
    };

    this.loggerService.logLeaderboardRequest(dto);

    return this.leaderboardService.getLeaderboard(dto);
  }

  @Post('contributions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record a new contribution' })
  @ApiBody({ type: CreateContributionDto })
  @ApiResponse({
    status: 201,
    description: 'Contribution recorded successfully',
  })
  async recordContribution(
    @Body(new ValidationPipe({ transform: true }))
    createContributionDto: CreateContributionDto,
  ): Promise<void> {
    this.logger.log(
      `Recording contribution for user: ${createContributionDto.userId}, type: ${createContributionDto.type}`,
    );

    await this.leaderboardService.recordContribution(createContributionDto);

    // Emit event for other parts of the system
    this.eventEmitter.emitContributionCreated(createContributionDto);

    this.loggerService.logContributionCreated(createContributionDto);
  }

  @Get('users/:userId/contributions')
  @ApiOperation({ summary: 'Get contributions for a specific user' })
  @ApiParam({ name: 'userId', type: String })
  @ApiQuery({ name: 'timeRange', enum: TimeRangeEnum, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getUserContributions(
    @Param('userId') userId: string,
    @Query('timeRange', new DefaultValuePipe(TimeRangeEnum.ALL_TIME))
    timeRange: TimeRangeEnum,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    this.logger.log(
      `Getting contributions for user: ${userId}, timeRange: ${timeRange}, page: ${page}, limit: ${limit}`,
    );

    return this.leaderboardService.getUserContributions(userId, timeRange, {
      page,
      limit,
    });
  }

  @Get('contribution-types')
  @ApiOperation({ summary: 'Get all contribution types' })
  async getContributionTypes() {
    return this.leaderboardService.getContributionTypes();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get contribution statistics' })
  @ApiQuery({ name: 'timeRange', enum: TimeRangeEnum, required: false })
  async getStatistics(
    @Query('timeRange', new DefaultValuePipe(TimeRangeEnum.ALL_TIME))
    timeRange: TimeRangeEnum,
  ) {
    return this.leaderboardService.getStatistics(timeRange);
  }
}
