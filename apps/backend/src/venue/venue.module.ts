import { CloudinaryModule } from 'src/providers/cloudinary/cloudinary.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/providers/prisma/prisma.module';
import { VenueController } from './venue.controller';
import { VenueService } from './venue.service';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [VenueController],
  providers: [VenueService],
})
export class VenueModule {}
