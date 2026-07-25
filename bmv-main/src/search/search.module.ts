import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SearchController } from './search.controller';

@Module({
  imports: [PrismaModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
