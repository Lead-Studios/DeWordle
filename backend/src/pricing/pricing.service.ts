import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { type Repository, LessThanOrEqual, MoreThanOrEqual } from "typeorm"
import { PricingRule, PricingRuleType, DiscountType } from "./entities/pricing-rule.entity"
import { DiscountCode } from "./entities/discount-code.entity"
import { PricingTier } from "./entities/pricing-tier.entity"
import type { CreatePricingRuleDto } from "./dto/create-pricing-rule.dto"
import type { CreateDiscountCodeDto } from "./dto/create-discount-code.dto"
import type { CreatePricingTierDto } from "./dto/create-pricing-tier.dto"
import type { CalculatePriceDto } from "./dto/calculate-price.dto"
import type { ValidateDiscountCodeDto } from "./dto/validate-discount-code.dto"
import type { EventsService } from "../events/events.service"
import type { UsersService } from "../users/users.service"
import { differenceInDays, differenceInHours } from "date-fns"

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(PricingRule)
    private pricingRuleRepository: Repository<PricingRule>,
    @InjectRepository(DiscountCode)
    private discountCodeRepository: Repository<DiscountCode>,
    @InjectRepository(PricingTier)
    private pricingTierRepository: Repository<PricingTier>,
    private eventsService: EventsService,
    private usersService: UsersService,
  ) {}

  // Pricing Rules Methods
  async createPricingRule(createPricingRuleDto: CreatePricingRuleDto): Promise<PricingRule> {
    // Validate event exists
    const event = await this.eventsService.findOne(createPricingRuleDto.eventId)
    if (!event) {
      throw new HttpException("Event not found", HttpStatus.NOT_FOUND)
    }

    // Validate rule type specific fields
    this.validateRuleTypeFields(createPricingRuleDto)

    const pricingRule = this.pricingRuleRepository.create(createPricingRuleDto)
    return this.pricingRuleRepository.save(pricingRule)
  }

  private validateRuleTypeFields(dto: CreatePricingRuleDto): void {
    switch (dto.ruleType) {
      case PricingRuleType.EARLY_BIRD:
        if (!dto.daysBeforeEvent) {
          throw new HttpException("daysBeforeEvent is required for early bird rules", HttpStatus.BAD_REQUEST)
        }
        break
      case PricingRuleType.DYNAMIC:
        if (!dto.salesThreshold || !dto.priceIncreaseAmount) {
          throw new HttpException(
            "salesThreshold and priceIncreaseAmount are required for dynamic pricing rules",
            HttpStatus.BAD_REQUEST,
          )
        }
        break
      case PricingRuleType.LOYALTY:
        if (!dto.minimumPurchases) {
          throw new HttpException("minimumPurchases is required for loyalty rules", HttpStatus.BAD_REQUEST)
        }
        break
      case PricingRuleType.GROUP:
        if (!dto.minimumTickets) {
          throw new HttpException("minimumTickets is required for group discount rules", HttpStatus.BAD_REQUEST)
        }
        break
      case PricingRuleType.LAST_MINUTE:
        if (!dto.hoursBeforeEvent) {
          throw new HttpException("hoursBeforeEvent is required for last minute rules", HttpStatus.BAD_REQUEST)
        }
        break
    }
  }

  async findAllPricingRules(eventId?: string): Promise<PricingRule[]> {
    if (eventId) {
      return this.pricingRuleRepository.find({
        where: { eventId },
        order: { createdAt: "DESC" },
      })
    }
    return this.pricingRuleRepository.find({
      order: { createdAt: "DESC" },
    })
  }

  async findOnePricingRule(id: string): Promise<PricingRule> {
    const rule = await this.pricingRuleRepository.findOne({
      where: { id },
      relations: ["event"],
    })

    if (!rule) {
      throw new HttpException("Pricing rule not found", HttpStatus.NOT_FOUND)
    }

    return rule
  }

  async updatePricingRule(id: string, updatePricingRuleDto: CreatePricingRuleDto): Promise<PricingRule> {
    const rule = await this.findOnePricingRule(id)

    // Validate rule type specific fields
    this.validateRuleTypeFields(updatePricingRuleDto)

    // Update the rule
    Object.assign(rule, updatePricingRuleDto)

    return this.pricingRuleRepository.save(rule)
  }

  async removePricingRule(id: string): Promise<PricingRule> {
    const rule = await this.findOnePricingRule(id)
    return this.pricingRuleRepository.remove(rule)
  }

  // Discount Codes Methods
  async createDiscountCode(createDiscountCodeDto: CreateDiscountCodeDto): Promise<DiscountCode> {
    // Validate event exists
    const event = await this.eventsService.findOne(createDiscountCodeDto.eventId)
    if (!event) {
      throw new HttpException("Event not found", HttpStatus.NOT_FOUND)
    }

    // Check if code already exists for this event
    const existingCode = await this.discountCodeRepository.findOne({
      where: {
        code: createDiscountCodeDto.code,
        eventId: createDiscountCodeDto.eventId,
      },
    })

    if (existingCode) {
      throw new HttpException("Discount code already exists for this event", HttpStatus.CONFLICT)
    }

    const discountCode = this.discountCodeRepository.create(createDiscountCodeDto)
    return this.discountCodeRepository.save(discountCode)
  }

  async findAllDiscountCodes(eventId?: string): Promise<DiscountCode[]> {
    if (eventId) {
      return this.discountCodeRepository.find({
        where: { eventId },
        order: { createdAt: "DESC" },
      })
    }
    return this.discountCodeRepository.find({
      order: { createdAt: "DESC" },
    })
  }

  async findOneDiscountCode(id: string): Promise<DiscountCode> {
    const code = await this.discountCodeRepository.findOne({
      where: { id },
      relations: ["event"],
    })

    if (!code) {
      throw new HttpException("Discount code not found", HttpStatus.NOT_FOUND)
    }

    return code
  }

  async findDiscountCodeByCode(code: string, eventId: string): Promise<DiscountCode> {
    const discountCode = await this.discountCodeRepository.findOne({
      where: {
        code,
        eventId,
        isActive: true,
      },
    })

    if (!discountCode) {
      throw new HttpException("Discount code not found or inactive", HttpStatus.NOT_FOUND)
    }

    return discountCode
  }

  async updateDiscountCode(id: string, updateDiscountCodeDto: CreateDiscountCodeDto): Promise<DiscountCode> {
    const code = await this.findOneDiscountCode(id)

    // Check if code is being changed and if it already exists
    if (updateDiscountCodeDto.code !== code.code) {
      const existingCode = await this.discountCodeRepository.findOne({
        where: {
          code: updateDiscountCodeDto.code,
          eventId: updateDiscountCodeDto.eventId,
          id: { $ne: id },
        },
      })

      if (existingCode) {
        throw new HttpException("Discount code already exists for this event", HttpStatus.CONFLICT)
      }
    }

    // Update the code
    Object.assign(code, updateDiscountCodeDto)

    return this.discountCodeRepository.save(code)
  }

  async removeDiscountCode(id: string): Promise<DiscountCode> {
    const code = await this.findOneDiscountCode(id)
    return this.discountCodeRepository.remove(code)
  }

  // Pricing Tiers Methods
  async createPricingTier(createPricingTierDto: CreatePricingTierDto): Promise<PricingTier> {
    // Validate event exists
    const event = await this.eventsService.findOne(createPricingTierDto.eventId)
    if (!event) {
      throw new HttpException("Event not found", HttpStatus.NOT_FOUND)
    }

    const pricingTier = this.pricingTierRepository.create(createPricingTierDto)
    return this.pricingTierRepository.save(pricingTier)
  }

  async findAllPricingTiers(eventId?: string): Promise<PricingTier[]> {
    if (eventId) {
      return this.pricingTierRepository.find({
        where: { eventId },
        order: { price: "ASC" },
      })
    }
    return this.pricingTierRepository.find({
      order: { createdAt: "DESC" },
    })
  }

  async findPublicPricingTiers(eventId: string): Promise<PricingTier[]> {
    const now = new Date()

    return this.pricingTierRepository.find({
      where: {
        eventId,
        isActive: true,
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
      },
      order: { price: "ASC" },
    })
  }

  async findOnePricingTier(id: string): Promise<PricingTier> {
    const tier = await this.pricingTierRepository.findOne({
      where: { id },
      relations: ["event"],
    })

    if (!tier) {
      throw new HttpException("Pricing tier not found", HttpStatus.NOT_FOUND)
    }

    return tier
  }

  async updatePricingTier(id: string, updatePricingTierDto: CreatePricingTierDto): Promise<PricingTier> {
    const tier = await this.findOnePricingTier(id)

    // Update the tier
    Object.assign(tier, updatePricingTierDto)

    return this.pricingTierRepository.save(tier)
  }

  async removePricingTier(id: string): Promise<PricingTier> {
    const tier = await this.findOnePricingTier(id)
    return this.pricingTierRepository.remove(tier)
  }

  async incrementTierSoldTickets(tierId: string, quantity: number): Promise<PricingTier> {
    const tier = await this.findOnePricingTier(tierId)
    tier.soldTickets += quantity
    return this.pricingTierRepository.save(tier)
  }

  // Price Calculation Methods
  async calculatePrice(calculatePriceDto: CalculatePriceDto): Promise<any> {
    const { eventId, userId, quantity, discountCode, ticketType, ticketIds } = calculatePriceDto

    // Get event details
    const event = await this.eventsService.findOne(eventId)
    if (!event) {
      throw new HttpException("Event not found", HttpStatus.NOT_FOUND)
    }

    // Get current pricing tier
    const pricingTiers = await this.findPublicPricingTiers(eventId)
    if (pricingTiers.length === 0) {
      throw new HttpException("No active pricing tiers found for this event", HttpStatus.NOT_FOUND)
    }

    // Find the current tier based on sold tickets
    let currentTier = pricingTiers[0]
    for (const tier of pricingTiers) {
      if (tier.soldTickets < tier.maxTickets) {
        currentTier = tier
        break
      }
    }

    // Base price calculation
    const basePrice = currentTier.price * quantity
    let finalPrice = basePrice
    const appliedDiscounts = []

    // Apply dynamic pricing rules
    const dynamicRules = await this.pricingRuleRepository.find({
      where: {
        eventId,
        ruleType: PricingRuleType.DYNAMIC,
        isActive: true,
      },
    })

    for (const rule of dynamicRules) {
      if (currentTier.soldTickets >= rule.salesThreshold) {
        // For dynamic pricing, we increase the price
        const increase = rule.priceIncreaseAmount * quantity
        finalPrice += increase
        appliedDiscounts.push({
          name: rule.name,
          type: "increase",
          amount: increase,
        })
      }
    }

    // Apply early bird discounts if applicable
    if (event.date) {
      const now = new Date()
      const daysUntilEvent = differenceInDays(new Date(event.date), now)

      const earlyBirdRules = await this.pricingRuleRepository.find({
        where: {
          eventId,
          ruleType: PricingRuleType.EARLY_BIRD,
          isActive: true,
        },
      })

      for (const rule of earlyBirdRules) {
        if (daysUntilEvent >= rule.daysBeforeEvent) {
          const discount = this.calculateDiscount(rule.discountType, rule.discountValue, finalPrice)
          finalPrice -= discount
          appliedDiscounts.push({
            name: rule.name,
            type: "discount",
            amount: discount,
          })
        }
      }
    }

    // Apply last minute discounts if applicable
    if (event.date) {
      const now = new Date()
      const hoursUntilEvent = differenceInHours(new Date(event.date), now)

      const lastMinuteRules = await this.pricingRuleRepository.find({
        where: {
          eventId,
          ruleType: PricingRuleType.LAST_MINUTE,
          isActive: true,
        },
      })

      for (const rule of lastMinuteRules) {
        if (hoursUntilEvent <= rule.hoursBeforeEvent) {
          const discount = this.calculateDiscount(rule.discountType, rule.discountValue, finalPrice)
          finalPrice -= discount
          appliedDiscounts.push({
            name: rule.name,
            type: "discount",
            amount: discount,
          })
        }
      }
    }

    // Apply group discounts if applicable
    if (quantity > 1) {
      const groupRules = await this.pricingRuleRepository.find({
        where: {
          eventId,
          ruleType: PricingRuleType.GROUP,
          isActive: true,
        },
      })

      for (const rule of groupRules) {
        if (quantity >= rule.minimumTickets) {
          const discount = this.calculateDiscount(rule.discountType, rule.discountValue, finalPrice)
          finalPrice -= discount
          appliedDiscounts.push({
            name: rule.name,
            type: "discount",
            amount: discount,
          })
        }
      }
    }

    // Apply loyalty discounts if applicable
    if (userId) {
      const user = await this.usersService.findOne(userId)
      if (user) {
        const purchaseCount = await this.usersService.getUserPurchaseCount(userId)

        const loyaltyRules = await this.pricingRuleRepository.find({
          where: {
            eventId,
            ruleType: PricingRuleType.LOYALTY,
            isActive: true,
          },
        })

        for (const rule of loyaltyRules) {
          if (purchaseCount >= rule.minimumPurchases) {
            const discount = this.calculateDiscount(rule.discountType, rule.discountValue, finalPrice)
            finalPrice -= discount
            appliedDiscounts.push({
              name: rule.name,
              type: "discount",
              amount: discount,
            })
          }
        }
      }
    }

    // Apply discount code if provided
    if (discountCode) {
      try {
        const validationResult = await this.validateDiscountCode({
          code: discountCode,
          eventId,
          userId,
          ticketType,
        })

        if (validationResult.valid) {
          const code = validationResult.discountCode
          const discount = this.calculateDiscount(code.discountType, code.discountValue, finalPrice)
          finalPrice -= discount
          appliedDiscounts.push({
            name: code.name,
            type: "discount_code",
            amount: discount,
          })
        }
      } catch (error) {
        // If discount code is invalid, just skip it
        console.log("Invalid discount code:", error.message)
      }
    }

    // Ensure final price is not negative
    finalPrice = Math.max(0, finalPrice)

    return {
      basePrice,
      finalPrice,
      discount: basePrice - finalPrice,
      tier: currentTier.name,
      appliedDiscounts,
    }
  }

  private calculateDiscount(type: DiscountType, value: number, price: number): number {
    if (type === DiscountType.PERCENTAGE) {
      return (value / 100) * price
    } else {
      return Math.min(value, price) // Fixed amount, but not more than the price
    }
  }

  async validateDiscountCode(validateDiscountCodeDto: ValidateDiscountCodeDto): Promise<any> {
    const { code, eventId, userId, ticketType } = validateDiscountCodeDto

    try {
      const discountCode = await this.findDiscountCodeByCode(code, eventId)

      // Check if code is active
      if (!discountCode.isActive) {
        return { valid: false, message: "Discount code is inactive" }
      }

      // Check date validity
      const now = new Date()
      if (discountCode.startDate && now < discountCode.startDate) {
        return { valid: false, message: "Discount code is not yet active" }
      }

      if (discountCode.endDate && now > discountCode.endDate) {
        return { valid: false, message: "Discount code has expired" }
      }

      // Check usage limits
      if (discountCode.maxUses !== -1 && discountCode.usedCount >= discountCode.maxUses) {
        return { valid: false, message: "Discount code has reached maximum usage" }
      }

      // Check user-specific usage if userId is provided
      if (userId) {
        const userUsageCount = await this.getUserDiscountCodeUsage(userId, discountCode.id)
        if (userUsageCount >= discountCode.maxUsesPerUser) {
          return { valid: false, message: "You have already used this discount code the maximum number of times" }
        }
      }

      // Check ticket type restrictions
      if (discountCode.allowedTicketTypes && discountCode.allowedTicketTypes.length > 0 && ticketType) {
        if (!discountCode.allowedTicketTypes.includes(ticketType)) {
          return { valid: false, message: "Discount code is not valid for this ticket type" }
        }
      }

      return {
        valid: true,
        discountCode,
        message: "Discount code is valid",
      }
    } catch (error) {
      return { valid: false, message: error.message }
    }
  }

  async getUserDiscountCodeUsage(userId: string, discountCodeId: string): Promise<number> {
    // This would typically query a table that tracks discount code usage per user
    // For simplicity, we're returning 0 here
    return 0
  }

  async getUserEligibleDiscounts(userId: string): Promise<any[]> {
    // Get user purchase count for loyalty discounts
    const purchaseCount = await this.usersService.getUserPurchaseCount(userId)

    // Get all active loyalty rules
    const loyaltyRules = await this.pricingRuleRepository.find({
      where: {
        ruleType: PricingRuleType.LOYALTY,
        isActive: true,
        minimumPurchases: LessThanOrEqual(purchaseCount),
      },
      relations: ["event"],
    })

    return loyaltyRules.map((rule) => ({
      id: rule.id,
      name: rule.name,
      description: rule.description,
      eventId: rule.eventId,
      eventName: rule.event.name,
      discountType: rule.discountType,
      discountValue: rule.discountValue,
      ruleType: rule.ruleType,
    }))
  }

  async getEventDiscounts(eventId: string, userId?: string): Promise<any> {
    // Get event details
    const event = await this.eventsService.findOne(eventId)
    if (!event) {
      throw new HttpException("Event not found", HttpStatus.NOT_FOUND)
    }

    const now = new Date()
    const daysUntilEvent = event.date ? differenceInDays(new Date(event.date), now) : null
    const hoursUntilEvent = event.date ? differenceInHours(new Date(event.date), now) : null

    // Get all applicable discounts for this event
    const earlyBirdRules = daysUntilEvent
      ? await this.pricingRuleRepository.find({
          where: {
            eventId,
            ruleType: PricingRuleType.EARLY_BIRD,
            isActive: true,
            daysBeforeEvent: LessThanOrEqual(daysUntilEvent),
          },
        })
      : []

    const lastMinuteRules = hoursUntilEvent
      ? await this.pricingRuleRepository.find({
          where: {
            eventId,
            ruleType: PricingRuleType.LAST_MINUTE,
            isActive: true,
            hoursBeforeEvent: MoreThanOrEqual(hoursUntilEvent),
          },
        })
      : []

    const groupRules = await this.pricingRuleRepository.find({
      where: {
        eventId,
        ruleType: PricingRuleType.GROUP,
        isActive: true,
      },
    })

    // Get loyalty discounts if userId is provided
    let loyaltyRules = []
    if (userId) {
      const purchaseCount = await this.usersService.getUserPurchaseCount(userId)
      loyaltyRules = await this.pricingRuleRepository.find({
        where: {
          eventId,
          ruleType: PricingRuleType.LOYALTY,
          isActive: true,
          minimumPurchases: LessThanOrEqual(purchaseCount),
        },
      })
    }

    // Get public discount codes
    const discountCodes = await this.discountCodeRepository.find({
      where: {
        eventId,
        isActive: true,
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
      },
      select: ["id", "code", "name", "description", "discountType", "discountValue"],
    })

    return {
      earlyBird: earlyBirdRules,
      lastMinute: lastMinuteRules,
      group: groupRules,
      loyalty: loyaltyRules,
      discountCodes,
    }
  }
}

