import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsDate,
} from 'class-validator';
import { Status } from '../enums/status.enum';
export class CreateResultDto {
  @IsInt()
  readonly id: number;

  @IsInt()
  @IsNotEmpty()
  readonly userId: number;

  @IsString()
  @IsNotEmpty()
  readonly word: string;

  @IsArray()
  @IsOptional()
  readonly feedback: string[] | string;

  @IsInt()
  @IsNotEmpty()
  readonly attempts: number;

  @IsEnum(Status)
  @IsNotEmpty()
  readonly status: Status;

  @IsDate()
  @IsOptional()
  readonly gameDate: Date;
}
