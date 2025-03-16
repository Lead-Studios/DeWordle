import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { AdminModule } from './admin/admin.module';
import { ResultModule } from './result/result.module';
import { SubAdminModule } from './sub-admin/sub-admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Leaderboard } from './leaderboard/entities/leaderboard.entity';
import { Result } from './result/entities/result.entity';
import { User } from './users/entities/user.entity';
import { SubAdmin } from './sub-admin/entities/sub-admin-entity';
import { Admin } from './admin/entities/admin.entity';
import envConfiguration from 'config/envConfiguration';
import { validate } from '../config/env.validation';
import { GuestUserModule } from './guest/guest.module';
import { GuestFeaturesModule } from './guest-features/guest-features.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { GuestUserGuard } from './guest/guest.guard';
import { RedisService } from './guest/provider/redis.service';
import { GuestUserController } from './guest/guest.controller';
import { GuestUserService } from './guest/guest.service';
import { MailModule } from './mail/mail.module';
import { createClient } from 'redis';
import { PaginationModule } from './common/pagination/pagination-controller.controller'; // Your change
import { RetentionMetricsModule } from './retention-metrics/retention-metrics.module';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfiguration],
      validate,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASS'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get<string>('SMTP_FROM')}>`,
        },
        template: {
          dir: join(__dirname, '../templates'), // Email templates location
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      entities: [],
      migrations: ['src/migrations/*.ts'],
      synchronize: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        try {
          const client = createClient({
            url: 'redis://localhost:6379',
          });
          await client.connect();

          return {
            store: 'redis',
            client: client,
            ttl: 300,
          };
        } catch (e) {
          console.warn('Redis connection failed, falling back to memory cache');
          return {
            ttl: 300,
          };
        }
      },
    }),
    UsersModule,
    AuthModule,
    LeaderboardModule,
    AdminModule,
    ResultModule,
    SubAdminModule,
    GuestUserModule,
    PaginationModule,
    MailModule,
    GuestUserModule,
    GuestFeaturesModule,
    MailModule,
    RetentionMetricsModule,
  ],
  controllers: [AppController, GuestUserController],
  providers: [AppService, GuestUserGuard, RedisService, GuestUserService], // Provide RedisService & GuestGuard globally
})
export class AppModule {}
