import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { SignInDto } from '../dto/create-auth.dto';
import { SignInProvider } from './sign-in.provider';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly signInProvider: SignInProvider,
  ) {}

  public async SignIn(signInDto: SignInDto) {
    return await this.signInProvider.SignIn(signInDto);
  }

  findAll() {
    return 'This action returns all auth';
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
