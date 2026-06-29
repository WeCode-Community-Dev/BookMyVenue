import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PhoneOtp } from './entities/phone-otp.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from '../users/entities/user.entity';
import { JwtStrategy } from '../common/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // PhoneOtp  — OTP flow
    // RefreshToken — refresh token rotation & revocation
    // User — login credential lookup
    TypeOrmModule.forFeature([PhoneOtp, RefreshToken, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        // No global default expiry — set per-token in the service
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [
    JwtModule,      // UsersModule needs JwtService to verify phoneVerifiedToken
    AuthService,    // UsersModule needs AuthService.issueTokenPair() after registration
    PassportModule, // exports the passport strategy for JwtAuthGuard
  ],
})
export class AuthModule {}

