import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { PrismaVenueRepository } from './repositories/prisma-venue.repository';
import { PrismaBookingRepository } from './repositories/prisma-booking.repository';
import { PrismaRefreshTokenRepository } from './repositories/prisma-refresh-token.repository';
import { CryptoPasswordHasher } from './services/crypto-password-hasher';
import { JwtTokenService } from './services/jwt-token.service';
import { PrismaVenueImageRepository } from './repositories/prisma-venue-image.repository';
import { LocalFileStorageService } from './storage/local-file.storage';

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
      provide: 'IFileStorage',
      useClass: LocalFileStorageService,
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
      provide: 'IVenueImageRepository',
      useClass: PrismaVenueImageRepository,
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
    'IFileStorage',
    'IUserRepository',
    'IPasswordHasher',
    'ITokenService',
    'IVenueRepository',
    'IVenueImageRepository',
    'IBookingRepository',
    'IRefreshTokenRepository',
  ],
})
export class InfraModule { }
