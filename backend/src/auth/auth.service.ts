import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

import { UserStatus } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (user) {
      const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
      if (isMatch) {
        if (user.status !== UserStatus.ACTIVE) {
          throw new UnauthorizedException(`Your account status is ${user.status || 'Pending'}. Access is only permitted for Active accounts.`);
        }
        const { passwordHash, ...result } = user.toObject();
        return result;
      }
    }
    throw new UnauthorizedException('Invalid login credentials');
  }

  async login(loginDto: LoginDto) {
    const validated = await this.validateUser(loginDto);
    const payload = {
      sub: validated._id,
      email: validated.email,
      role: validated.role,
    };
    return {
      user: validated,
      token: await this.jwtService.signAsync(payload),
    };
  }
}
