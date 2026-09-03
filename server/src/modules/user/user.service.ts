import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import * as repo from './user.repository';
import { NotFoundError, ForbiddenError, ConflictError, ValidationError } from '../../utils/errors';
import type { IUser } from './user.models';
import { getUserRole } from '../../services/roles.service';
import type { PaginatedResponse, PaginationParams } from '../../types/pagination.types';
import { signUploadParams, type CloudinarySignature } from '../../utils/cloudinarySign';
import { logError } from '../../utils/logger';

interface ProfileDto {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

function toProfileDto(user: IUser): ProfileDto {
  return {
    _id: user._id.toString(),
    name: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
  };
}

export async function getProfile(userId: string): Promise<ProfileDto & { role?: string }> {
  const user = await repo.findUserById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const roleInfo = await getUserRole(userId);

  return { ...toProfileDto(user), role: roleInfo?.roleName };
}

export async function updateProfile(
  userId: string,
  dto: { username?: string; profilePicturePublicId?: string }
): Promise<ProfileDto> {
  const existingUser = await repo.findUserById(userId);
  if (!existingUser) {
    throw new NotFoundError('User not found');
  }

  if (dto.username && dto.username !== existingUser.username) {
    const usernameTaken = await repo.findActiveUserByUsernameExcludingId(dto.username, userId);
    if (usernameTaken) {
      throw new ConflictError('Username is already taken');
    }
  }

  const updateData: {
    username?: string;
    profilePicture?: string;
    profilePicturePublicId?: string;
  } = {};
  if (dto.username) {
    updateData.username = dto.username;
  }

  if (dto.profilePicturePublicId) {
    const ownFolderPrefix = `bookmyvenue/users/${userId}/`;
    if (!dto.profilePicturePublicId.startsWith(ownFolderPrefix)) {
      throw new ForbiddenError('Profile picture must be one you uploaded');
    }

    let verifiedUrl: string;
    try {
      const resource = (await cloudinary.api.resource(dto.profilePicturePublicId)) as {
        secure_url: string;
      };
      verifiedUrl = resource.secure_url;
    } catch {
      throw new ValidationError('Could not verify the uploaded profile picture');
    }

    if (
      existingUser.profilePicturePublicId &&
      existingUser.profilePicturePublicId !== dto.profilePicturePublicId
    ) {
      try {
        await cloudinary.uploader.destroy(existingUser.profilePicturePublicId);
      } catch (e) {
        const error = e as Error;
        logError('Failed to delete old profile picture from Cloudinary', {
          module: 'user.service.ts/updateProfile',
          userId,
          publicId: existingUser.profilePicturePublicId,
          error: error.message,
        });
      }
    }

    updateData.profilePicture = verifiedUrl;
    updateData.profilePicturePublicId = dto.profilePicturePublicId;
  }

  const updated = await repo.updateUserProfile(userId, updateData);
  if (!updated) {
    throw new NotFoundError('User not found');
  }

  return toProfileDto(updated);
}

export async function deleteProfilePicture(userId: string): Promise<ProfileDto> {
  const existingUser = await repo.findUserById(userId);
  if (!existingUser) {
    throw new NotFoundError('User not found');
  }

  if (!existingUser.profilePicturePublicId) {
    throw new ValidationError('No profile picture to remove');
  }

  try {
    await cloudinary.uploader.destroy(existingUser.profilePicturePublicId);
  } catch (e) {
    const error = e as Error;
    logError('Failed to delete profile picture from Cloudinary', {
      module: 'user.service.ts/deleteProfilePicture',
      userId,
      publicId: existingUser.profilePicturePublicId,
      error: error.message,
    });
  }

  const updated = await repo.clearUserProfilePicture(userId);
  if (!updated) {
    throw new NotFoundError('User not found');
  }

  return toProfileDto(updated);
}

export function getAvatarUploadSignature(userId: string): CloudinarySignature | null {
  return signUploadParams(`bookmyvenue/users/${userId}`);
}

export async function getAllUsers(
  paginationParams: PaginationParams,
  filters?: { role?: string }
): Promise<PaginatedResponse<Record<string, unknown>, 'users'>> {
  return repo.findAllUsers(paginationParams, filters);
}

export async function toggleUserStatus(userId: string): Promise<IUser | null> {
  return repo.toggleUserStatus(userId);
}

export async function generateRandomPasswordWithHash(): Promise<{ plain: string; hashed: string }> {
  const bcrypt = await import('bcrypt');
  const newPassword = crypto.randomBytes(12).toString('base64url');
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  return { plain: newPassword, hashed: hashedPassword };
}

export async function banUser(userId: string, adminId: string, banReason: string): Promise<IUser> {
  // Prevent self-ban
  if (userId === adminId) {
    throw new ForbiddenError('You cannot ban yourself');
  }

  // Get the user to be banned
  const userToban = await repo.findUserById(userId);
  if (!userToban) {
    throw new NotFoundError('User not found');
  }

  // Prevent banning a superAdmin
  const userRole = await getUserRole(userId);
  if (userRole?.roleName === 'superAdmin') {
    throw new ForbiddenError('You cannot ban a super admin');
  }

  // Ban the user
  return repo.banUser(userId, adminId, banReason);
}

export async function unbanUser(userId: string): Promise<IUser> {
  const user = await repo.findUserById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Also lift any BannedUsers records to keep systems in sync
  const bannedUserRepo = await import('../moderation/bannedUser.repository.js');
  await bannedUserRepo.liftAllBansForUser(userId, userId); // using userId as a dummy liftedBy

  return repo.unbanUser(userId);
}
