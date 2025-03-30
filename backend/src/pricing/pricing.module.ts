import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { PricingController } from "./pricing.controller"
import { PricingService } from "./pricing.service"
import { PricingRule } from "./entities/pricing-rule.entity"
import { DiscountCode } from "./entities/discount-code.entity"
import { PricingTier } from "./entities/pricing-tier.entity"
import { EventsModule } from "../events/events.module"
import { UsersModule } from "../users/users.module"

@Module({
  imports: [TypeOrmModule.forFeature([PricingRule, DiscountCode, PricingTier]), EventsModule, UsersModule],
  controllers: [PricingController],
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}

