import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsBoolean, IsDate, Min } from "class-validator"
import { Type } from "class-transformer"
import { PricingRuleType, DiscountType } from "../entities/pricing-rule.entity"

export class CreatePricingRuleDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description?: string

  @IsUUID()
  @IsNotEmpty()
  eventId: string

  @IsEnum(PricingRuleType)
  @IsNotEmpty()
  ruleType: PricingRuleType

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

  // Early bird specific fields
  @IsNumber()
  @IsOptional()
  daysBeforeEvent?: number

  // Dynamic pricing specific fields
  @IsNumber()
  @IsOptional()
  salesThreshold?: number

  @IsNumber()
  @IsOptional()
  priceIncreaseAmount?: number

  // Loyalty specific fields
  @IsNumber()
  @IsOptional()
  minimumPurchases?: number

  // Group discount specific fields
  @IsNumber()
  @IsOptional()
  minimumTickets?: number

  // Last minute specific fields
  @IsNumber()
  @IsOptional()
  hoursBeforeEvent?: number
}

