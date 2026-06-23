import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { VenueStatus } from '@prisma/client';

@Injectable()
export class VenueService {
  constructor(private prisma: PrismaService) {}

  async create(createVenueDto: CreateVenueDto, ownerId: string) {
    return this.prisma.venue.create({
      data: {
        ...createVenueDto,
        ownerId,
        status: VenueStatus.APPROVED,
      },
    });
  }

  async findAllApproved() {
    return this.prisma.venue.findMany({
      where: { status: VenueStatus.APPROVED },
      include: {
        owner: {
          select: { name: true, email: true },
        },
      },
    });
  }

  async findOwnerVenues(ownerId: string) {
    return this.prisma.venue.findMany({
      where: { ownerId },
    });
  }
}