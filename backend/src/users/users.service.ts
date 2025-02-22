import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUsersProvider } from './providers/create-users-provider';
import { Repository } from 'typeorm';
import { FindOneByEmailProvider } from './providers/find-one-by-email.provider';
import { AuthService } from 'src/auth/providers/auth.service';

@Injectable()
export class UsersService {
  constructor(
    /*
     * inject create user provider
     */
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly findOneByEmailProvider: FindOneByEmailProvider,

    private readonly createUserProvider: CreateUsersProvider,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  public async GetOneByEmail(email: string) {
    return await this.findOneByEmailProvider.FindByEmail(email);
  }

  // Find all users with pagination
  async findAll(page: number, limit: number) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });

    return {
      total,
      page,
      limit,
      data: users,
    };
  }

  // Soft delete a user by ID
  async softDelete(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.softDelete(id);
    return { message: `User with ID ${id} has been deleted.` };
  }

  public async findOneById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
