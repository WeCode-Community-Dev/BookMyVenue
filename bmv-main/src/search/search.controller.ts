import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchVenueDto } from './dto/search-venue.dto';
import { SearchNavbarDto } from './dto/search-navbar.dto';
import { SearchAllVenuesResponseDto } from './dto/search-all-venues-response.dto';
import { SearchNavbarResponseDto } from './dto/search-navbar-response.dto';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('recommended')
  @ApiOperation({
    summary: 'Get recommended venues',
  })
  @ApiResponse({
    status: 200,
    description: 'Recommended venues retrieved successfully.',
  })
  getRecommendedVenues() {
    return this.searchService.getRecommendedVenues();
  }

  @Get()
  @ApiOperation({
    summary: 'View all approved venues',
  })
  @ApiResponse({
    status: 200,
    description: 'Venues retrieved successfully.',
    type: SearchAllVenuesResponseDto,
  })
  getAllVenues(@Query() query: SearchVenueDto) {
    return this.searchService.getAllVenues(query);
  }

  @Get('navbar')
  @ApiOperation({
    summary: 'Search venues by name or city',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully.',
    type: SearchNavbarResponseDto,
  })
  searchNavbar(@Query() query: SearchNavbarDto) {
    return this.searchService.searchNavbar(query);
  }
}
