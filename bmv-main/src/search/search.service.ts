import { Injectable } from '@nestjs/common';
import { Prisma, VenueStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchVenueDto } from './dto/search-venue.dto';
import { SearchNavbarDto } from './dto/search-navbar.dto';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async getRecommendedVenues() {
    return this.prisma.venue.findMany({
      where: {
        status: VenueStatus.APPROVED,
      },
      include: {
        images: true,
        owner: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
  }
  async getAllVenues(query: SearchVenueDto) {
    const where: Prisma.VenueWhereInput = {
      status: VenueStatus.APPROVED,
    };

    if (query.city) {
      where.city = {
        contains: query.city,
        mode: Prisma.QueryMode.insensitive,
      };
    }

    if (query.category) {
      where.categories = {
        has: query.category,
      };
    }

    if (query.capacity) {
      where.capacity = {
        gte: query.capacity,
      };
    }

    const total = await this.prisma.venue.count({
      where,
    });

    const skip = Number(query.skip ?? 0);
    const take = Number(query.take ?? 10);

    const venues = await this.prisma.venue.findMany({
      where,

      include: {
        images: {
          take: 1,
        },
      },

      orderBy: {
        createdAt: 'desc',
      },

      skip,
      take,
    });

    return {
      data: venues,

      pagination: {
        total,
        skip,
        take,
        hasMore: skip + venues.length < total,
      },
    };
  }

  async searchNavbar(query: SearchNavbarDto) {
    if (!query.q?.trim()) {
      return [];
    }

    return this.prisma.venue.findMany({
      where: {
        status: VenueStatus.APPROVED,

        OR: [
          {
            name: {
              contains: query.q,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            city: {
              contains: query.q,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      },

      select: {
        id: true,
        name: true,
        city: true,
        address: true,
        price: true,

        images: {
          take: 1,
          select: {
            imageUrl: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },

      take: 8,
    });
  }
}
