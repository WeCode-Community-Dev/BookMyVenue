import mongoose from 'mongoose';
import { userRepository } from '@/repositories/user.repository';
import Venue from '@/models/venue.model';
import { AppError } from '@/utils/AppError';
import { HTTP_STATUS } from '@/constants/http';
/**
 * Toggle a venue in the user's wishlist.
 * Validates the venue exists before adding.
 */
const toggleWishlist = async (
  userId: string,
  venueId: string
): Promise<{ wishlist: mongoose.Types.ObjectId[]; isAdded: boolean }> => {
  if (!mongoose.Types.ObjectId.isValid(venueId)) {
    throw new AppError('Invalid venue ID', HTTP_STATUS.BAD_REQUEST);
  }
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }
  const venueObjectId = new mongoose.Types.ObjectId(venueId);
  // Check if venue exists before adding
  const venueExists = await Venue.exists({ _id: venueObjectId });
  const wishlistIndex = user.wishlist.findIndex((id) => id.equals(venueObjectId));
  const isAdded = wishlistIndex === -1;
  if (isAdded) {
    // Only validate venue existence when adding, not when removing
    if (!venueExists) {
      throw new AppError('Venue not found', HTTP_STATUS.NOT_FOUND);
    }
    user.wishlist.push(venueObjectId);
  } else {
    user.wishlist.splice(wishlistIndex, 1);
  }
  await user.save();
  return { wishlist: user.wishlist, isAdded };
};
/**
 * Get the user's populated wishlist, filtering out deleted/inactive venues.
 */
const getWishlist = async (userId: string) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }
  
   const venues = await Venue.find({
    _id: { $in: user.wishlist },
    isActive: true,
    isDeleted: false,
  }).populate({
    path: 'categoryId',
    select: 'name',
  }).
  populate('availability');
  return venues;
};

export const wishlistService = {
  toggleWishlist,
  getWishlist,
};
