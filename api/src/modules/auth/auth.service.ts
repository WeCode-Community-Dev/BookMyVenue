import { ConflictException, HttpCode, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { createAccessToken } from './helpers/token';
import { ok } from 'node:assert';
import { UserRole } from 'generated/prisma/enums';


export type SignupResponse = {
  success: boolean;
  message: string;
};

export type LoginResponse = {
  success: boolean;
  data: { accessToken: string; role: UserRole; }
};


@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async signup(dto: SignupDto): Promise<SignupResponse> {
    try {

      const conditions = [];

      if (dto.email) {
        conditions.push({ email: dto.email });
      }

      if (dto.phone) {
        conditions.push({ phone: dto.phone });
      }

      const existingUser = await this.prismaService.user.findFirst({
        where: {
          OR: conditions,
        },
        select: {
          id: true,
          email: true,
          phone: true,
          emailVerified: true
        },
      });

      if (existingUser?.emailVerified && existingUser?.email === dto.email) {
        throw new ConflictException('Email already registered');
      }
      if (existingUser?.emailVerified && existingUser?.phone === dto.phone) {
        throw new ConflictException('Phone number already registered');
      }

      const passwordHash = await argon2.hash(dto.password);

      const data = {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        passwordHash,
        role: dto.role,
        phone: dto.phone,
        emailVerified: false,
      }

      if (existingUser) {
        await this.prismaService.user.update({
          where: { id: existingUser.id },
          data: data,
          select: {
            id: true
          },
        });
      }
      else {
        await this.prismaService.user.create({
          data: data,
          select: {
            id: true
          },
        });
      }

      return {
        success: true,
        message: 'Account created successfully',
      };
    } catch (error) {
      throw error;
    }

  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          email: dto.email,
          // emailVerified: true, TODO: uncomment after verification link
        },
      });

      if (!user) {
        throw new UnauthorizedException("Invalid Credentials")
      }

      const isPasswordValid = await argon2.verify(
        user.passwordHash,
        dto.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException(
          'Invalid credentials',
        );
      }

      const accessToken = createAccessToken(this.jwtService, {
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        success: true,
        data: {
           accessToken,
           role: user.role,
        }
      };
    } catch (error) {
      throw error
    }

  }

}