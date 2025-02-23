import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leaderboard } from './entities/leaderboard.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Leaderboard)
    private leaderboardRepository: Repository<Leaderboard>,

    @Inject(forwardRef(() => UsersService))
    private readonly userServices: UsersService,
  ) {}
  async createLeaderboard(
    createLeaderboardDto: CreateLeaderboardDto,
  ): Promise<Leaderboard> {
    const user = await this.userServices.findOneById(
      createLeaderboardDto.userId,
    );
    if (!user) {
      throw new Error('User not found');
    }
    const leaderboardEntry = this.leaderboardRepository.create({
      ...createLeaderboardDto,
      user,
    });
    return this.leaderboardRepository.save(leaderboardEntry);
  }

  findAll() {
    return `This action returns all leaderboard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} leaderboard`;
  }

  update(id: number, updateLeaderboardDto: UpdateLeaderboardDto) {
    return `This action updates a #${id} leaderboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} leaderboard`;
  }
}
