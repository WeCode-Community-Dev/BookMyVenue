import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
//import { MongooseModule } from '@nestjs/mongoose';
//import { AuthLog, AuthLogSchema } from './schemas/auth.schema';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<any>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    //MongooseModule.forFeature([{ name: AuthLog.name, schema: AuthLogSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
