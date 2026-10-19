import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum MatchStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  SOLO = 'SOLO',
}

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  sharedSessionId: string;

  @Column({ length: 5 })
  targetWord: string;

  @Column()
  player1Id: number;

  @Column({ type: 'int', nullable: true })
  player2Id: number | null;

  @Column({ type: 'float', default: 0 })
  player1SkillScore: number;

  @Column({ type: 'float', nullable: true })
  player2SkillScore: number | null;

  @Column({ type: 'int', nullable: true })
  player1Attempts: number | null;

  @Column({ type: 'int', nullable: true })
  player2Attempts: number | null;

  @Column({ type: 'varchar', default: MatchStatus.ACTIVE })
  status: MatchStatus;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
