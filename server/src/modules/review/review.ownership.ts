import { ReviewModel } from './review.model';
import { ForbiddenError, NotFoundError } from '../../utils/errors';
import mongoose from 'mongoose';

const toObjectId = (id: string): mongoose.Types.ObjectId => {
  return new mongoose.Types.ObjectId(id);
};

export async function assertReviewOwner(reviewId: string, userId: string): Promise<void> {
  const review = await ReviewModel.findById(toObjectId(reviewId)).exec();
  if (!review) {
    throw new NotFoundError('Review not found');
  }
  if (review.userId.toString() !== userId) {
    throw new ForbiddenError('You do not have permission to modify this review');
  }
}

export async function isReviewEditableByOwner(reviewId: string, userId: string): Promise<boolean> {
  const review = await ReviewModel.findById(toObjectId(reviewId)).exec();
  if (!review) {
    return false;
  }

  if (review.userId.toString() !== userId) {
    return false;
  }

  // Check 30-day edit window from creation
  const createdAt = review.createdAt;
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  return now - createdAt.getTime() <= thirtyDaysInMs;
}

export function requireOwnReview(userId: string): (reviewId: string) => Promise<void> {
  return async (reviewId: string) => {
    await assertReviewOwner(reviewId, userId);
  };
}
