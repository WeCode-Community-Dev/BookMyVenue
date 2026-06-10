import { Module } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { VenuesController } from './venues.controller';

@Module({
  controllers: [VenuesController],
  providers: [VenuesService],
})
export class VenuesModule {}
