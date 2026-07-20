import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  async findAll() {
    return this.reviewsService.findAll();
  }

  @Get('venue/:venueId')
  async findByVenue(@Param('venueId') venueId: string) {
    return this.reviewsService.findByVenue(venueId);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.reviewsService.findByUser(userId);
  }
}
