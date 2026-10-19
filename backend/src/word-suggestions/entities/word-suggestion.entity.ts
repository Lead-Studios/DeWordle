import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class WordSuggestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 5 })
  word: string;

  @Column()
  submittedBy: string;

  @Column({ type: 'int', nullable: true })
  submitterId: number | null;

  @Column({ type: 'int', default: 0 })
  voteCount: number;

  @Column({ type: 'json', nullable: true })
  voters: string[] | null;

  @CreateDateColumn()
  createdAt: Date;
}
