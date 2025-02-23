import { Leaderboard } from 'src/leaderboard/entities/leaderboard.entity';
import { Result } from 'src/result/entities/result.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true, nullable: false })
  userName: string;

  @Column('varchar', { unique: true, nullable: false })
  email: string;

  @Column('varchar', { nullable: false })
  password: string;

  @OneToMany(() => Result, (result) => result.user, {
    cascade: true,
    // eager: true,
  })
  result: Result[];

  @OneToMany(() => Leaderboard, (leaderboard) => leaderboard.user, {
    cascade: true,
    // eager: true,
  })
  leaderboard: Leaderboard[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
