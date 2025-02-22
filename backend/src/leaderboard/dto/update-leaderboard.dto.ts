import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaderboardDto } from './create-leaderboard.dto';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class UpdateLeaderboardDto extends PartialType(CreateLeaderboardDto) {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsInt()
  totalWins?: number;

  @IsOptional()
  @IsInt()
  totalAttempts?: number;

  @IsOptional()
  @IsNumber()
  averageScore?: number;
}
