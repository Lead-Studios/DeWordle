import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsBoolean, IsDate } from "class-validator"
import { Type } from "class-transformer"

export class CreatePricingTierDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsUUID()
  @IsNotEmpty()
  eventId: string

  @IsNumber()
  @IsNotEmpty()
  price: number

  @IsNumber()
  @IsNotEmpty()
  maxTickets: number

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
}

