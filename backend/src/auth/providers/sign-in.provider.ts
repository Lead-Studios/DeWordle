/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { HashingProvider } from './hashing-provider';
import { GenerateTokenProvider } from './generate-token.provider';
import { SignInDto } from '../dto/create-auth.dto';
import { SubAdminService } from 'src/sub-admin/sub-admin.service';
import { AuthExceptionFilter } from 'src/common/filters';
import { TokenService } from './token.services';
import { TokenType } from '../enums/token-type.enum';

@Injectable()
@UseFilters(AuthExceptionFilter) // ✅ Apply AuthExceptionFilter
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userServices: UsersService,

    private readonly hashingProvider: HashingProvider,
    private readonly generateTokensProvider: GenerateTokenProvider,
    private readonly subAdminService: SubAdminService,
    private readonly tokenService: TokenService,
  ) {}

  public async SignIn(signInDto: SignInDto) {
    const user = await this.userServices.GetOneByEmail(signInDto.email);
    const subAdmin = await this.subAdminService.findOneByEmail(signInDto.email);

    if (!user && !subAdmin) {
      throw new UnauthorizedException('Email/Password is incorrect');
    }

    const account = user || subAdmin;

    if (!account) {
      throw new UnauthorizedException('No account found with this email');
    }

    // Check if email is verified
    // if (!user.isVerified) {
    //   throw new UnauthorizedException(
    //     'Please verify your email before logging in',
    //   );
    // }

    let isEqual: boolean = false;
    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException('Error connecting to the database');
    }

    if (!isEqual) {
      throw new UnauthorizedException('Email/Password is incorrect');
    }

    const tokens = await this.generateTokensProvider.generateTokens(user);
    await this.tokenService.saveToken(
      user,
      tokens.refresh_token,
      TokenType.REFRESH,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );
    return [tokens, user];
  }
}
