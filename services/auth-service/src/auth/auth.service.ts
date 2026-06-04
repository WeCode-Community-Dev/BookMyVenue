import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

export interface JwtPayload {
  sub: number;
  email: string;
  fullName: string;
  roles: string[];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers a new user with their email, password, fullName, and roles.
   */
  async register(
    email: string,
    password: string,
    fullName: string,
    roles: string[] = ['USER'],
  ) {
    if (!email || !password || !fullName) {
      throw new ConflictException(
        'Email, password, and fullName are required.',
      );
    }

    const passwordHash = await this.hashPassword(password);
    return this.usersService.createUser(email, passwordHash, fullName, roles);
  }

  /**
   * Logs in a user, verifying email/password and minting a JWT with ID and exact roles.
   */
  async login(email: string, password: string) {
    if (!email || !password) {
      throw new UnauthorizedException('Email and password must be provided.');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Extract exact roles
    const roles = user.userRoles.map((ur) => ur.role.name);

    // Mint stateless JWT containing ID (sub) and exact roles
    const payload = {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      roles: roles,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: roles,
      },
    };
  }

  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
