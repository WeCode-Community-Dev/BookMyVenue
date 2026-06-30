import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  private formatProfile(profile: {
    name: string;
    phoneNumber: string | null;
    profilePicture: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    dateOfBirth: Date | null;
    gender: string | null;
    biography: string | null;
  }) {
    return {
      name: profile.name,
      phoneNumber: profile.phoneNumber,
      profilePicture: profile.profilePicture,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      country: profile.country,
      dateOfBirth: profile.dateOfBirth?.toISOString() ?? null,
      gender: profile.gender,
      biography: profile.biography,
    };
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return {
      ...this.formatProfile(profile),
      email: profile.user.email,
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const data = {
      ...updateProfileDto,
      dateOfBirth: updateProfileDto.dateOfBirth
        ? new Date(updateProfileDto.dateOfBirth)
        : updateProfileDto.dateOfBirth,
    };

    const updatedProfile = await this.prisma.profile.update({
      where: {
        userId,
      },
      data,
    });

    return {
      ...this.formatProfile(updatedProfile),
      email: profile.user.email,
    };
  }
}
