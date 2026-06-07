import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto'
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.userService.verifyOtp(verifyOtpDto);
  }
}