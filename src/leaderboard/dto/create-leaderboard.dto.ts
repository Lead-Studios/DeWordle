import { IsInt, IsNumber, IsOptional } from 'class-validator';
export class CreateLeaderboardDto {
  @IsInt()
  @IsOptional()
  readonly id?: number;

  @IsInt()
  readonly userId: number;

  @IsInt()
  readonly totalWins: number;

  @IsInt()
  readonly totalAttempts: number;

  @IsNumber()
  readonly averageScore: number;
}
