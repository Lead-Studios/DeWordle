/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { GenerateTokenProvider } from './generate-token.provider';
import jwtConfig from 'config/jwt.config';
import { UsersService } from 'src/users/users.service';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

@Injectable()
export class RefreshTokenProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userServices: UsersService,
    // jwt service
    private readonly jwtService: JwtService,

    // jwt config injcetion
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    // inter dependency injection of genrate token provider
    private readonly generateTokensProvider: GenerateTokenProvider,
  ) {}

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      // Validate the refresh token using jwtService
      const { sub } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        },
      );

      // Grab the user from the database based on the user ID (sub)
      const user = await this.userServices.findOneById(sub);

      // Generate a new access token, but keep the same refresh token
      const access_token = await this.generateTokensProvider.SignToken(
        user.id,
        this.jwtConfiguration.ttl, // Access token expiration time
        { email: user.email },
      );

      // Return the new access token and the existing refresh token
      return { access_token, refresh_token: refreshTokenDto.refreshToken };
    } catch (error) {
      // If the error is because the token has expired, handle it explicitly
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token has expired');
      }

      // Catch other JWT errors or general errors
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
