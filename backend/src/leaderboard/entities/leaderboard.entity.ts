import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Leaderboard {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.leaderboard)
  userId: User;

  @ManyToOne(() => User)
  user: User;

  @Column('integer')
  totalWins: number;

  @Column('integer')
  totalAttempts: number;

  @Column('float')
  averageScore: number;
}
