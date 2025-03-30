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
import { DiscountType } from "./pricing-rule.entity"

@Entity()
export class DiscountCode {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  code: string

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

  @Column({ default: -1 })
  maxUses: number // -1 means unlimited

  @Column({ default: 0 })
  usedCount: number

  @Column({ default: 1 })
  maxUsesPerUser: number

  @Column({ nullable: true, type: "simple-array" })
  allowedTicketTypes: string[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

