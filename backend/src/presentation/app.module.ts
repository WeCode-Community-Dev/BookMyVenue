import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { VenuesModule } from './modules/venues/venues.module';
import { AdminModule } from './modules/admin/admin.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    AuthModule,
    DashboardModule,
    AdminModule,
    BookingsModule,
    VenuesModule,
    UsersModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
