import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Url } from 'url';

@Entity('contribution_leaderboard_user_contributions')
export class UserContributionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  @Index()
  userId: string;

  @Column()
  avatarUrl: Url;

  @Column()
  username: string;

  @Column({ name: 'total_points', type: 'int', default: 0 })
  @Index()
  totalPoints: number;

  @Column({ name: 'submission_count', type: 'int', default: 0 })
  submissionCount: number;

  @Column({ name: 'edit_count', type: 'int', default: 0 })
  editCount: number;

  @Column({ name: 'approval_count', type: 'int', default: 0 })
  approvalCount: number;

  @Column({ name: 'comment_count', type: 'int', default: 0 })
  commentCount: number;

  @Column({ name: 'last_contribution_date', type: 'timestamp', nullable: true })
  @Index()
  lastContributionDate: Date;

  @Column()
  achievements: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
