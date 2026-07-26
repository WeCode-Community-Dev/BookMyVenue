import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async getDashboardStats() {
    const [totalBookings, totalVenues, totalUsers, totalOwners] =
      await Promise.all([
        this.prismaService.booking.count(),
        this.prismaService.venue.count(),
        this.prismaService.user.count(),
        this.prismaService.user.count({
          where: {
            role: 'VENUE_OWNER',
          },
        }),
      ]);

    return {
      totalBookings,
      totalVenues,
      totalUsers,
      totalOwners,
    };
  }

  async getPendingVenues() {
    return await this.prismaService.venue.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
          },
        },
        categories: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
        images: true,
        slotTemplates: {
          include: {
            pricingTiers: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async approveVenue(venueId: string) {
    const venue = await this.prismaService.venue.findUnique({
      where: { id: venueId },
      include: { owner: true },
    });

    if (!venue) {
      throw new BadRequestException('Venue not found.');
    }

    return await this.prismaService.$transaction(async (tx) => {
      const updatedVenue = await tx.venue.update({
        where: { id: venueId },
        data: { status: 'APPROVED' },
      });

      if (venue.owner.role === 'USER') {
        await tx.user.update({
          where: { id: venue.ownerId },
          data: { role: 'VENUE_OWNER' },
        });
      }

      return updatedVenue;
    });
  }

  async rejectVenue(venueId: string, rejectionNote?: string) {
    const venue = await this.prismaService.venue.findUnique({
      where: { id: venueId },
    });

    if (!venue) {
      throw new BadRequestException('Venue not found.');
    }

    return await this.prismaService.venue.update({
      where: { id: venueId },
      data: {
        status: 'REJECTED',
        rejectionNote: rejectionNote || null,
      },
    });
  }
}
