import { ConsoleLogger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { VenuesModule } from './modules/venues/venues.module';
import { AdminModule } from './modules/admin/admin.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PaymentModule } from './modules/payment/payment.module';
import { HealthController } from './modules/health.controller';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { InfraModule } from 'src/infra/infra.module';

@Module({
  imports: [
    InfraModule,
    AuthModule,
    DashboardModule,
    AdminModule,
    BookingsModule,
    VenuesModule,
    UsersModule,
    PaymentModule
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, PrismaService, ConsoleLogger],
})
export class AppModule { }
