import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getPendingVenues() {
    // Fetch all venues with status PENDING
    return this.prisma.venue.findMany({
      where: { status: 'PENDING' },
    });
  }   
}
