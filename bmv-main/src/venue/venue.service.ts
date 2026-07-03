import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVenueDto } from './dto/create.venue.dto';
import { VenueStatus } from '@prisma/client';
@Injectable()
export class VenueService {
  constructor(private readonly prisma: PrismaService) {}
// Create a new venue for a specific user
  async createVenue(userId: string, createVenueDto: CreateVenueDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return this.prisma.venue.create({
      data: {
        ...createVenueDto,
        ownerId: userId,
        status: VenueStatus.PENDING,
      },
    });
  }
  // Fetch all venues for a specific user
    async getAllVenues(userId: string) {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new Error('User not found');
            }
            return this.prisma.venue.findMany({
                where: { ownerId: userId },
            });
        }
}
