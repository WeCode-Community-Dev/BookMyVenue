import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  //signup method to handle user registration
  async signUp(signUpDto: SignUpDto) {
    if (signUpDto.password !== signUpDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const existingUser = await this.prisma.user.findUnique({
      where: { email: signUpDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    const hashedpassword = await bcrypt.hash(signUpDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: signUpDto.email,
        passwordHash: hashedpassword,
      },
    });
    return { message: 'User registered successfully', userId: user.id };
  }

  //Google login method to handle user login via Google OAuth
  async googleLogin(googleUser: any) {
    let user = await this.prisma.user.findUnique({
      where: {
        email: googleUser.email,
      },
    });

    // First Google login
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          googleId: googleUser.googleId,
          isEmailVerified: true,
        },
      });

      await this.prisma.profile.create({
        data: {
          name: googleUser.name,
          profilePicture: googleUser.picture,
          userId: user.id,
        },
      });
    }

    // Email user later logs in with Google
    else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          googleId: googleUser.googleId,
        },
      });
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Google login successful',
      userId: user.id,
      token,
    };
  }

  //login method to handle user login
  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user || !user.passwordHash) {
      throw new BadRequestException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }
    const token = await this.getAccessToken(user.id, user.email, user.role);

    return { message: 'User logged in successfully', userId: user.id, token };
  }

  // Method to generate an access token for the user
  private async getAccessToken(userId: string, email: string, role: string) {
    const payload = {
      sub: userId,
      email,
      role,
    };

    return this.jwtService.signAsync(payload);
  }
}
