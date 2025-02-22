import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leaderboard } from './entities/leaderboard.entity';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';
import { DatabaseErrorException } from '../common/exceptions/database-error.exception';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Leaderboard)
    private readonly leaderboardRepository: Repository<Leaderboard>,
  ) {}

  async create(
    createLeaderboardDto: CreateLeaderboardDto,
  ): Promise<Leaderboard> {
    const newEntry = this.leaderboardRepository.create({
      totalWins: createLeaderboardDto.totalWins,
      totalAttempts: createLeaderboardDto.totalAttempts,
      averageScore: createLeaderboardDto.averageScore,
      user: { id: createLeaderboardDto.userId },
    });
    return await this.leaderboardRepository.save(newEntry);
  }

  findAll() {
    return `This action returns all leaderboard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} leaderboard`;
  }

  async update(
    id: number,
    updateDto: UpdateLeaderboardDto,
  ): Promise<Leaderboard> {
    const existingEntry = await this.leaderboardRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!existingEntry) {
      throw new NotFoundException(`Leaderboard entry with ID ${id} not found`);
    }

    try {
      const updateData = {
        totalWins: updateDto.totalWins,
        totalAttempts: updateDto.totalAttempts,
        averageScore: updateDto.averageScore,
        user: updateDto.userId ? { id: updateDto.userId } : undefined,
      };
      const mergedEntry = this.leaderboardRepository.merge(
        existingEntry,
        updateData,
      );
      return await this.leaderboardRepository.save(mergedEntry);
    } catch {
      throw new DatabaseErrorException('Failed to update leaderboard entry');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} leaderboard`;
  }
}
