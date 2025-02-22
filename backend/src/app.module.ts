import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { AdminModule } from './admin/admin.module';
import { ResultModule } from './result/result.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // This configuration is used for testing purposes in production.
    // Make sure to replace these hardcoded values with environment variables
    // from a .env file for security and flexibility, especially in production environments.
    TypeOrmModule.forRoot({
      type: 'postgres', // or your DB type
      host: 'localhost',
      port: 9000,
      username: 'postgres',
      password: 'password',
      database: 'dewordle',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // set to false in production to prevent unintended schema changes
    }),

    UsersModule,
    AuthModule,
    LeaderboardModule,
    AdminModule,
    ResultModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
