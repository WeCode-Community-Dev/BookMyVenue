import * as venueService from '@/services/venue.service';
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '@/constants/http';
import { AppError } from '@/utils/AppError';
import { MESSAGES } from '@/constants/messages';
import success from '@/utils/response';
import { uploadToCloudinary, deleteFromCloudinary } from '@/libs/cloudinary';
import extractPublicId from '@/helpers/extractCloudinaryPublicId.helpers';
import fs from 'fs/promises';

// POST /owner/venues
export const createVenue = async (req: Request, res: Response, next: NextFunction) => {
  const tempFiles = (req.files as Express.Multer.File[]) || [];
  try {
    const ownerId = req.user?.id;

    if (!ownerId) throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    // Upload images to Cloudinary
    const imageUrls: string[] = [];
    for (const file of tempFiles) {
      const result = await uploadToCloudinary(file.path, 'bmv/venues');
      imageUrls.push(result.url);
      await fs.unlink(file.path).catch(() => {});
    }

    const data = { ...req.body, images: imageUrls };
    const venue = await venueService.createVenue(ownerId, data);

    return success(res, HTTP_STATUS.CREATED, venue, MESSAGES.VENUE_CREATED);
  } catch (error) {
    // Cleanup temp files on error
    for (const file of tempFiles) {
      await fs.unlink(file.path).catch(() => {});
    }
    next(error);
  }
};

// GET /owner/venues
export const getOwnerVenues = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.user?.id;

    if (!ownerId) throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    const result = await venueService.getOwnerVenues(ownerId, res.locals.validateQuery);

    return success(res, HTTP_STATUS.OK, result, MESSAGES.VENUES_FETCHED);
  } catch (error) {
    next(error);
  }
};

// GET /owner/venues/:id
export const getVenueById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const ownerId = req.user?.id;

    if (!ownerId) throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    const venue = await venueService.getVenueById(ownerId, id as string);

    return success(res, HTTP_STATUS.OK, venue, MESSAGES.VENUES_FETCHED);
  } catch (error) {
    next(error);
  }
};

// PATCH /owner/venues/:id
export const updateVenue = async (req: Request, res: Response, next: NextFunction) => {
  const tempFiles = (req.files as Express.Multer.File[]) || [];
  try {
    const { id } = req.params;
    const ownerId = req.user?.id;

    if (!ownerId) throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    // Upload new images to Cloudinary if provided
    const newImageUrls: string[] = [];
    for (const file of tempFiles) {
      const result = await uploadToCloudinary(file.path, 'bmv/venues');
      newImageUrls.push(result.url);
      await fs.unlink(file.path).catch(() => {});
    }

    const data = { ...req.body };

    // Parse existing images from body (sent as JSON string from frontend)
    let existingImages: string[] = [];
    if (data.existingImages) {
      try {
        existingImages = JSON.parse(data.existingImages);
      } catch {
        existingImages = [];
        delete data.existingImages;
      }
    }

    // Fetch the current venue to find deleted images
    const currentVenue = await venueService.getVenueById(ownerId, id as string);
    if (currentVenue && currentVenue.images) {
      const orphanedUrls = currentVenue.images.filter((url) => !existingImages.includes(url));

      // Delete orphaned images from Cloudinary
      for (const url of orphanedUrls) {
        const publicId = extractPublicId(url);
        await deleteFromCloudinary(publicId).catch((err) => {
          console.error(`Failed to delete orphaned image: ${publicId}`, err);
        });
      }
    }

    // Combine existing + new images
    if (newImageUrls.length > 0 || existingImages.length > 0) {
      data.images = [...existingImages, ...newImageUrls];
    }

    const venue = await venueService.updateVenue(ownerId, id as string, data);

    return success(res, HTTP_STATUS.OK, venue, MESSAGES.VENUE_UPDATED);
  } catch (error) {
    // Cleanup temp files on error
    for (const file of tempFiles) {
      await fs.unlink(file.path).catch(() => {});
    }
    next(error);
  }
};

export const softDeleteVenue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const ownerId = req.user?.id;

    if (!ownerId) throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    const venue = await venueService.softDeleteVenue(ownerId, id as string);

    return success(res, HTTP_STATUS.OK, venue, 'Venue archived successfully');
  } catch (error) {
    next(error);
  }
};

export const restoreVenue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const ownerId = req.user?.id;

    if (!ownerId) throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    const venue = await venueService.restoreVenue(ownerId, id as string);

    return success(res, HTTP_STATUS.OK, venue, 'Venue restored successfully');
  } catch (error) {
    next(error);
  }
};
