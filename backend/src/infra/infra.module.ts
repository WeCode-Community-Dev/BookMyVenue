import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { PrismaVenueRepository } from './repositories/prisma-venue.repository';
import { PrismaBookingRepository } from './repositories/prisma-booking.repository';
import { PrismaRefreshTokenRepository } from './repositories/prisma-refresh-token.repository';
import { CryptoPasswordHasher } from './services/crypto-password-hasher';
import { JwtTokenService } from './services/jwt-token.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'IPasswordHasher',
      useClass: CryptoPasswordHasher,
    },
    {
      provide: 'ITokenService',
      useClass: JwtTokenService,
    },
    {
      provide: 'IVenueRepository',
      useClass: PrismaVenueRepository,
    },
    {
      provide: 'IBookingRepository',
      useClass: PrismaBookingRepository,
    },
    {
      provide: 'IRefreshTokenRepository',
      useClass: PrismaRefreshTokenRepository,
    },
  ],
  exports: [
    'IUserRepository',
    'IPasswordHasher',
    'ITokenService',
    'IVenueRepository',
    'IBookingRepository',
    'IRefreshTokenRepository',
  ],
})
export class InfraModule {}
