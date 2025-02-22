import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { AdminModule } from './admin/admin.module';
import { ResultModule } from './result/result.module';

@Module({
  imports: [UsersModule, AuthModule, LeaderboardModule, AdminModule, ResultModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
