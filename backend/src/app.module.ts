import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { AdminModule } from './admin/admin.module';
import { ResultModule } from './result/result.module';
import { ConfigModule } from '@nestjs/config';
import envConfiguration from '../config/envConfiguration';
import { validate } from '../config/env.validation';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    LeaderboardModule,
    AdminModule,
    ResultModule,

    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfiguration],
      validate,
    }),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
