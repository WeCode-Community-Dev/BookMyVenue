import { Module } from '@nestjs/common';
import { VenueService } from './venue.service';
import { VenueController } from './venue.controller';
import { PrismaService } from '../../shared/prisma/prisma.service'; 

@Module({
  controllers: [VenueController],
  providers: [VenueService, PrismaService],
})
export class VenueModule {}