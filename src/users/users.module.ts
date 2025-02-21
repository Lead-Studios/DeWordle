import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CreateUsersProvider } from './providers/create-users-provider';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneByEmailProvider } from './providers/find-one-by-email.provider';

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, CreateUsersProvider, FindOneByEmailProvider],
  exports: [UsersService],
})
export class UsersModule {}
