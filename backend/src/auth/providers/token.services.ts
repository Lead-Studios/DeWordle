import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../entities/token.entity';
import { TokenType } from '../enums/token-type.enum';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  // Save token when a user logs in
  async saveToken(
    user: User,
    token: string,
    type: TokenType,
    expiresAt: Date,
  ): Promise<Token> {
    const newToken = this.tokenRepository.create({
      user,
      token,
      type,
      expiresAt,
    });
    return await this.tokenRepository.save(newToken);
  }

  // Find a token
  async findToken(token: string): Promise<Token | null> {
    return await this.tokenRepository.findOne({ where: { token } });
  }

  // Revoke a token (useful for logout)
  async revokeToken(token: string): Promise<void> {
    await this.tokenRepository.update({ token }, { isRevoked: true });
  }

  // Delete expired tokens (for cleanup)
  async deleteExpiredTokens(): Promise<void> {
    await this.tokenRepository
      .createQueryBuilder()
      .delete()
      .where('expiresAt < NOW()')
      .execute();
  }
}
