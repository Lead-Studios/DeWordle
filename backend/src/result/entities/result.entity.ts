import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Status } from '../enums/status.enum';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.result)
  userId: User;

  @ManyToOne(() => User, (user) => user.result)
  @JoinTable()
  user: User;

  @Column('varchar', { nullable: false })
  word: string;

  @Column('varchar')
  feedback: string | [];

  @Column('integer')
  attempts: number;

  @Column({ type: 'enum', enum: Status })
  status: Status;

  @CreateDateColumn()
  gameDate: Date;
}
