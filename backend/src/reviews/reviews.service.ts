import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const createdReview = new this.reviewModel(createReviewDto);
    return createdReview.save();
  }

  async findByVenue(venueId: string): Promise<Review[]> {
    return this.reviewModel.find({ venueId }).populate('userId').exec();
  }

  async findByUser(userId: string): Promise<Review[]> {
    return this.reviewModel.find({ userId }).populate('venueId').exec();
  }

  async findAll(): Promise<Review[]> {
    return this.reviewModel.find().exec();
  }
}
