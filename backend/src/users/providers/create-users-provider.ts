import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { HashingProvider } from 'src/auth/providers/hashing-provider';
import { LeaderboardService } from 'src/leaderboard/leaderboard.service';
import { ResultService } from '../../result/result.service';

@Injectable()
export class CreateUsersProvider {
  constructor(
    /*
     * Inject hashing provider
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
    /*
     * Inject user repository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => LeaderboardService))
    private leaderboardService: LeaderboardService,
    private readonly resultService: ResultService,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    let existingUser: User;

    try {
      existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      console.error('Error finding user:', error);
      throw new RequestTimeoutException(
        'Unable to connect to database. Please try again later',
        { description: 'Error connecting to database' },
      );
    }

    if (existingUser) {
      throw new BadRequestException(
        'User already exists in the database. Use a different email',
      );
    }

    const hashedPassword = await this.hashingProvider.hashPassword(
      createUserDto.password,
    );

    const newUser: DeepPartial<User> = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      results: [], // Ensure it's an array
      leaderboard: [],
    });

    const savedUser = await this.userRepository.save(newUser);

    await this.leaderboardService.createLeaderboard({
      userId: savedUser.id,
      totalWins: 0,
      totalAttempts: 0,
      averageScore: 0,

      results: Array.isArray(createUserDto.results)
        ? createUserDto.results
        : [],
    });
    // Auto-create result entry for the new user
    await this.resultService.createResult(savedUser.id.toString());

    try {
      return savedUser;
    } catch (error) {
      console.error('Error saving user:', error);
      throw new RequestTimeoutException('Error connecting to the database');
    }
  }
}
