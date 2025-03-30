import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsArray } from "class-validator"

export class CalculatePriceDto {
  @IsUUID()
  @IsNotEmpty()
  eventId: string

  @IsUUID()
  @IsOptional()
  userId?: string

  @IsNumber()
  @IsNotEmpty()
  quantity: number

  @IsString()
  @IsOptional()
  discountCode?: string

  @IsString()
  @IsOptional()
  ticketType?: string

  @IsArray()
  @IsOptional()
  ticketIds?: string[]
}

