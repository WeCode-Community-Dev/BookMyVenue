import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Reviews')
@Controller('venues/:venueId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a review', description: 'Post a review for a venue (requires completed booking)' })
  @ApiResponse({ status: 201, description: 'Review created' })
  @ApiResponse({ status: 403, description: 'No completed booking at this venue' })
  @ApiResponse({ status: 400, description: 'Already reviewed this venue' })
  @ApiParam({ name: 'venueId', description: 'Venue UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        rating: { type: 'number', example: 4, minimum: 1, maximum: 5 },
        comment: { type: 'string', example: 'Great venue, loved the ambiance!' },
      },
      required: ['rating'],
    },
  })
  async create(
    @Param('venueId') venueId: string,
    @Body() body: { rating: number; comment: string },
    @CurrentUser() user: User,
  ) {
    return this.reviewsService.create(venueId, user.id, body.rating, body.comment);
  }

  @Get()
  @ApiOperation({ summary: 'Get venue reviews', description: 'List all reviews for a venue' })
  @ApiResponse({ status: 200, description: 'Review list with pagination' })
  @ApiParam({ name: 'venueId', description: 'Venue UUID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findByVenue(
    @Param('venueId') venueId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.reviewsService.findByVenue(venueId, page ? +page : 1, limit ? +limit : 10);
  }
}
