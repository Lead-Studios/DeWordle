import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsBoolean,
  IsDate,
  IsArray,
  Min,
} from "class-validator"
import { Type } from "class-transformer"
import { DiscountType } from "../entities/pricing-rule.entity"

export class CreateDiscountCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description?: string

  @IsUUID()
  @IsNotEmpty()
  eventId: string

  @IsEnum(DiscountType)
  @IsNotEmpty()
  discountType: DiscountType

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  discountValue: number

  @IsBoolean()
  @IsOptional()
  isActive?: boolean

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date

  @IsNumber()
  @IsOptional()
  maxUses?: number

  @IsNumber()
  @IsOptional()
  maxUsesPerUser?: number

  @IsArray()
  @IsOptional()
  allowedTicketTypes?: string[]
}

