import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { GoogleStrategy } from 'src/strategy/google.strategy';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Configuring the JwtModule asynchronously
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // Factory function to configure the JWT module using values from the ConfigService
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        const expiresRaw = configService.get<string>('JWT_ACCESS_EXPIRES_IN');
        // Determine the expiration time, converting it to a number if it's a valid numeric string
        const expiresIn: number | string | undefined =
          expiresRaw && /^[0-9]+$/.test(expiresRaw)
            ? parseInt(expiresRaw, 10)
            : expiresRaw;
        // Return the configuration object for the JwtModule, including the secret and expiration options
        return {
          secret,
          signOptions: { expiresIn: expiresIn as any },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
