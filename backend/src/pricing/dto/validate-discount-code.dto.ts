import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"

export class ValidateDiscountCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsUUID()
  @IsNotEmpty()
  eventId: string

  @IsUUID()
  @IsOptional()
  userId?: string

  @IsString()
  @IsOptional()
  ticketType?: string
}

