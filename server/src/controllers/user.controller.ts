import { Request, Response, NextFunction } from 'express';
import * as userService from '@/services/user.service';
import { getUserBookingsService } from '@/services/booking.service';
import success from '@/utils/response';
import { HTTP_STATUS } from '@/constants/http';
import Owner from '@/models/owner.model';
import User from '@/models/user.model';

import { uploadToCloudinary } from '@/libs/cloudinary';
import fs from 'fs/promises';
import { AppError } from '@/utils/AppError';

/**
 * Get all users with filters, search, sorting, and pagination
 */
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, role, search, sort, page, limit } = req.query;

    const query = {
      status: status as any,
      role: role as any,
      search: search as string,
      sort: sort as any,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    };

    const result = await userService.getAllUsers(query);

    return success(res, HTTP_STATUS.OK, result, 'Users fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID (admin only)
 */
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const user = await userService.getUserById(id);

    if (!user) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ success: false, message: 'User not found', data: null });
    }

    // Exclude sensitive data from response
    const { password, googleId, ...safeUser } = user.toObject();

    let owner = null;
    if (user.role === 'owner') {
      owner = await Owner.findOne({ userId: id });
    }

    return success(res, HTTP_STATUS.OK, { ...safeUser, owner }, 'User fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Block (disable) a user
 */
export const blockUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const user = await userService.blockUser(id);
    return success(res, HTTP_STATUS.OK, user, 'User blocked successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Unblock (restore) a user
 */
export const unblockUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const user = await userService.unblockUser(id);
    return success(res, HTTP_STATUS.OK, user, 'User unblocked successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get current logged-in user profile details (User + Owner if role is owner)
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError('Unauthorized access', HTTP_STATUS.UNAUTHORIZED));
    }

    const user = await User.findById(userId).select('-password -googleId');
    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    let owner = null;
    if (user.role === 'owner') {
      owner = await Owner.findOne({ userId });
    }

    return success(res, HTTP_STATUS.OK, { user, owner }, 'Profile fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update current logged-in user profile details (User + Owner if role is owner)
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const tempFiles: Express.Multer.File[] = [];

  // Gather all temp files for error cleanup
  if (files) {
    Object.values(files).forEach((fileArr) => {
      tempFiles.push(...fileArr);
    });
  }

  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Unauthorized access', HTTP_STATUS.UNAUTHORIZED);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    const { fullName, phoneNumber } = req.body;
    const userUpdate: any = {};
    if (fullName) userUpdate.fullName = fullName;
    if (phoneNumber) userUpdate.phoneNumber = phoneNumber;

    // Handle avatar upload if provided
    if (files?.avatar?.[0]) {
      const avatarFile = files.avatar[0];
      const uploadResult = await uploadToCloudinary(avatarFile.path, 'bmv/avatars');
      userUpdate.avatar = uploadResult.url;
      await fs.unlink(avatarFile.path).catch(() => {});
    }

    const updatedUser = await User.findByIdAndUpdate(userId, userUpdate, { new: true }).select(
      '-password -googleId'
    );

    let updatedOwner = null;
    if (user.role === 'owner') {
      const ownerUpdate: any = {
        address: {
          street: req.body.street || '',
          city: req.body.city || '',
          state: req.body.state || '',
          pincode: req.body.pincode || '',
        },
        bankDetails: {
          accountHolderName: req.body.accountHolderName || '',
          accountNumber: req.body.accountNumber || '',
          ifscCode: req.body.ifscCode || '',
        },
      };

      // Handle owner profileImage upload if provided
      if (files?.profileImage?.[0]) {
        const profileImageFile = files.profileImage[0];
        const uploadResult = await uploadToCloudinary(profileImageFile.path, 'bmv/owners');
        ownerUpdate.profileImage = uploadResult.url;
        await fs.unlink(profileImageFile.path).catch(() => {});
      }

      // Handle owner idProof upload if provided
      if (files?.idProof?.[0]) {
        const idProofFile = files.idProof[0];
        const uploadResult = await uploadToCloudinary(idProofFile.path, 'bmv/proofs');
        ownerUpdate.idProof = uploadResult.url;
        await fs.unlink(idProofFile.path).catch(() => {});
      }

      // Find existing owner document
      const existingOwner = await Owner.findOne({ userId });
      if (existingOwner) {
        // If owner exists, update
        const mergedUpdate: any = {
          address: {
            street: req.body.street !== undefined ? req.body.street : existingOwner.address?.street,
            city: req.body.city !== undefined ? req.body.city : existingOwner.address?.city,
            state: req.body.state !== undefined ? req.body.state : existingOwner.address?.state,
            pincode:
              req.body.pincode !== undefined ? req.body.pincode : existingOwner.address?.pincode,
          },
          bankDetails: {
            accountHolderName:
              req.body.accountHolderName !== undefined
                ? req.body.accountHolderName
                : existingOwner.bankDetails?.accountHolderName,
            accountNumber:
              req.body.accountNumber !== undefined
                ? req.body.accountNumber
                : existingOwner.bankDetails?.accountNumber,
            ifscCode:
              req.body.ifscCode !== undefined
                ? req.body.ifscCode
                : existingOwner.bankDetails?.ifscCode,
          },
        };

        if (ownerUpdate.profileImage) mergedUpdate.profileImage = ownerUpdate.profileImage;
        if (ownerUpdate.idProof) mergedUpdate.idProof = ownerUpdate.idProof;

        // Reset verification status to pending if they edit crucial info or if they were rejected
        if (existingOwner.verificationStatus === 'rejected') {
          mergedUpdate.verificationStatus = 'pending';
          mergedUpdate.rejectionReason = null;
        }

        updatedOwner = await Owner.findOneAndUpdate({ userId }, mergedUpdate, { new: true });
      } else {
        // If owner doesn't exist, create
        if (!ownerUpdate.idProof && !req.body.idProof) {
          throw new AppError(
            'ID proof document is required for venue owners',
            HTTP_STATUS.BAD_REQUEST
          );
        }

        updatedOwner = await Owner.create({
          userId,
          idProof: ownerUpdate.idProof || req.body.idProof,
          address: ownerUpdate.address,
          bankDetails: ownerUpdate.bankDetails,
          verificationStatus: 'pending',
        });
      }
    }

    return success(
      res,
      HTTP_STATUS.OK,
      { user: updatedUser, owner: updatedOwner },
      'Profile updated successfully'
    );
  } catch (error) {
    // Cleanup local temp files on failure
    for (const file of tempFiles) {
      await fs.unlink(file.path).catch(() => {});
    }
    next(error);
  }
};

export const getUserBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Unauthorized access', HTTP_STATUS.UNAUTHORIZED);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    const status = req.query.status as string | undefined;

    const result = await getUserBookingsService(userId, page, limit, status);

    return success(
      res,
      HTTP_STATUS.OK,
      {
        bookings: result.bookings,
        totalBookings: result.pagination.total,
        pagination: result.pagination,
      },
      'Bookings fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};
