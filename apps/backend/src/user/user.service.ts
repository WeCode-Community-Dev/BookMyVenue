import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserBookings(userId: string) {
    return this.prismaService.booking.findMany({
      where: {
        userId,
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            addressLine: true,
            city: true,
            images: {
              where: {
                isPrimary: true,
              },
              take: 1,
            },
          },
        },
        slots: {
          include: {
            slotTemplate: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async upgradeToVenueOwner(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (user && user.role === 'USER') {
      await this.prismaService.user.update({
        where: { id: userId },
        data: { role: 'VENUE_OWNER' },
      });
    }
  }
}
