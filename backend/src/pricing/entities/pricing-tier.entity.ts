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

@Entity()
export class PricingTier {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @ManyToOne(() => Event)
  @JoinColumn()
  event: Event

  @Column()
  eventId: string

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number

  @Column({ default: 0 })
  soldTickets: number

  @Column()
  maxTickets: number

  @Column({ default: true })
  isActive: boolean

  @Column({ nullable: true })
  startDate: Date

  @Column({ nullable: true })
  endDate: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

