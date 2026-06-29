import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CustomerProfile } from './entities/customer-profile.entity';
import { AuthModule } from '../auth/auth.module';
import { Venue } from 'src/venues/entities/venue.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, CustomerProfile, Venue]),
    AuthModule,

    // brings in JwtModule so UsersService can verify the phoneVerifiedToken
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
