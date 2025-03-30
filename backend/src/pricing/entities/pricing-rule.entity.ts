import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm"
import { Event } from "../../events/entities/event.entity"

export enum PricingRuleType {
  EARLY_BIRD = "early_bird",
  DYNAMIC = "dynamic",
  LOYALTY = "loyalty",
  GROUP = "group",
  LAST_MINUTE = "last_minute",
}

export enum DiscountType {
  PERCENTAGE = "percentage",
  FIXED_AMOUNT = "fixed_amount",
}

@Entity()
export class PricingRule {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column({ nullable: true })
  description: string

  @ManyToOne(() => Event)
  @JoinColumn()
  event: Event

  @Column()
  eventId: string

  @Column({
    type: "enum",
    enum: PricingRuleType,
  })
  ruleType: PricingRuleType

  @Column({
    type: "enum",
    enum: DiscountType,
  })
  discountType: DiscountType

  @Column({ type: "decimal", precision: 10, scale: 2 })
  discountValue: number

  @Column({ default: true })
  isActive: boolean

  @Column({ nullable: true })
  startDate: Date

  @Column({ nullable: true })
  endDate: Date

  // Early bird specific fields
  @Column({ nullable: true })
  daysBeforeEvent: number

  // Dynamic pricing specific fields
  @Column({ nullable: true })
  salesThreshold: number

  @Column({ nullable: true, type: "decimal", precision: 10, scale: 2 })
  priceIncreaseAmount: number

  // Loyalty specific fields
  @Column({ nullable: true })
  minimumPurchases: number

  // Group discount specific fields
  @Column({ nullable: true })
  minimumTickets: number

  // Last minute specific fields
  @Column({ nullable: true })
  hoursBeforeEvent: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

