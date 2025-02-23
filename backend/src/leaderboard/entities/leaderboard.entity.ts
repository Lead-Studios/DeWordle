import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Leaderboard {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => User, (user) => user.leaderboard)
  // user: User;

  @ManyToOne(() => User, (user) => user.leaderboard, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinTable()
  user: User;

  @Column('integer')
  totalWins: number;

  @Column('integer')
  totalAttempts: number;

  @Column('float')
  averageScore: number;
}
