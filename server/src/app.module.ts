import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VenuesModule } from './venues/venues.module';
import { BookingsModule } from './bookings/bookings.module';
import { BookingLocksModule } from './booking-locks/booking-locks.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AdminModule } from './admin/admin.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Event Emitter for Async decoupling
    EventEmitterModule.forRoot(),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'bookmyvenue'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),

    // Scheduling (for booking lock expiry)
    ScheduleModule.forRoot(),

    // Feature modules
    AuthModule,
    UsersModule,
    VenuesModule,
    BookingsModule,
    BookingLocksModule,
    ReviewsModule,
    AdminModule,
    MailModule,
  ],
})
export class AppModule {}
