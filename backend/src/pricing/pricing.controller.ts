import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  HttpStatus,
  HttpException,
} from "@nestjs/common"
import type { PricingService } from "./pricing.service"
import type { CreatePricingRuleDto } from "./dto/create-pricing-rule.dto"
import type { CreateDiscountCodeDto } from "./dto/create-discount-code.dto"
import type { CreatePricingTierDto } from "./dto/create-pricing-tier.dto"
import type { CalculatePriceDto } from "./dto/calculate-price.dto"
import type { ValidateDiscountCodeDto } from "./dto/validate-discount-code.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../users/entities/user.entity"

@Controller("pricing")
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  // Pricing Rules Endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Post('rules')
  createRule(@Body() createPricingRuleDto: CreatePricingRuleDto) {
    return this.pricingService.createPricingRule(createPricingRuleDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Get('rules')
  findAllRules(@Query('eventId') eventId?: string) {
    return this.pricingService.findAllPricingRules(eventId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Get('rules/:id')
  findOneRule(@Param('id') id: string) {
    return this.pricingService.findOnePricingRule(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Patch("rules/:id")
  updateRule(@Param('id') id: string, @Body() updatePricingRuleDto: CreatePricingRuleDto) {
    return this.pricingService.updatePricingRule(id, updatePricingRuleDto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Delete('rules/:id')
  removeRule(@Param('id') id: string) {
    return this.pricingService.removePricingRule(id);
  }

  // Discount Codes Endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Post('discount-codes')
  createDiscountCode(@Body() createDiscountCodeDto: CreateDiscountCodeDto) {
    return this.pricingService.createDiscountCode(createDiscountCodeDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Get('discount-codes')
  findAllDiscountCodes(@Query('eventId') eventId?: string) {
    return this.pricingService.findAllDiscountCodes(eventId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Get('discount-codes/:id')
  findOneDiscountCode(@Param('id') id: string) {
    return this.pricingService.findOneDiscountCode(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Patch("discount-codes/:id")
  updateDiscountCode(@Param('id') id: string, @Body() updateDiscountCodeDto: CreateDiscountCodeDto) {
    return this.pricingService.updateDiscountCode(id, updateDiscountCodeDto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Delete('discount-codes/:id')
  removeDiscountCode(@Param('id') id: string) {
    return this.pricingService.removeDiscountCode(id);
  }

  // Pricing Tiers Endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Post('tiers')
  createTier(@Body() createPricingTierDto: CreatePricingTierDto) {
    return this.pricingService.createPricingTier(createPricingTierDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Get('tiers')
  findAllTiers(@Query('eventId') eventId?: string) {
    return this.pricingService.findAllPricingTiers(eventId);
  }

  @Get('tiers/public')
  findPublicTiers(@Query('eventId') eventId: string) {
    if (!eventId) {
      throw new HttpException('Event ID is required', HttpStatus.BAD_REQUEST);
    }
    return this.pricingService.findPublicPricingTiers(eventId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Get('tiers/:id')
  findOneTier(@Param('id') id: string) {
    return this.pricingService.findOnePricingTier(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Patch("tiers/:id")
  updateTier(@Param('id') id: string, @Body() updatePricingTierDto: CreatePricingTierDto) {
    return this.pricingService.updatePricingTier(id, updatePricingTierDto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Delete('tiers/:id')
  removeTier(@Param('id') id: string) {
    return this.pricingService.removePricingTier(id);
  }

  // Price Calculation Endpoints
  @Post('calculate')
  calculatePrice(@Body() calculatePriceDto: CalculatePriceDto) {
    return this.pricingService.calculatePrice(calculatePriceDto);
  }

  @Post('validate-code')
  validateDiscountCode(@Body() validateDiscountCodeDto: ValidateDiscountCodeDto) {
    return this.pricingService.validateDiscountCode(validateDiscountCodeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-discounts')
  getUserDiscounts(@Req() req) {
    const userId = req.user.id;
    return this.pricingService.getUserEligibleDiscounts(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("event-discounts/:eventId")
  getEventDiscounts(@Req() req, @Param('eventId') eventId: string) {
    const userId = req.user.id
    return this.pricingService.getEventDiscounts(eventId, userId)
  }
}

