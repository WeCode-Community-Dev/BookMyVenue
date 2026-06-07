import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {

  signup(dto: SignupDto) {
    return {
      message: 'signup success',
      user: dto
    };
  }

  login(dto: LoginDto) {
    return {
      message: 'login success'
    };
  }

}