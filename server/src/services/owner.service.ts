import { ownerRepository } from '../repositories/owner.repository';
import { AppError } from '@/utils/AppError';
import { HTTP_STATUS } from '@/constants/http';

export const ownerService = {
  async approveOwner(userId: string) {
    const owner = await ownerRepository.findByUserId(userId);
    if (!owner) {
      // V-007: Use AppError for consistent status codes — plain Error produces 500
      throw new AppError('Owner profile not found', HTTP_STATUS.NOT_FOUND);
    }

    return await ownerRepository.approve(userId);
  },

  async rejectOwner(userId: string, reason: string) {
    const owner = await ownerRepository.findByUserId(userId);

    if (!owner) {
      throw new AppError('Owner profile not found', HTTP_STATUS.NOT_FOUND);
    }

    if (!reason || !reason.trim()) {
      // V-007: Return 400 Bad Request — not 500
      throw new AppError('Rejection reason is required', HTTP_STATUS.BAD_REQUEST);
    }

    return await ownerRepository.reject(userId, reason);
  },

  async resubmitOwner(userId: string, data: any) {
    const owner = await ownerRepository.findByUserId(userId);
    if (!owner) {
      throw new AppError('Owner profile not found', HTTP_STATUS.NOT_FOUND);
    }

    return await ownerRepository.resubmit(userId, data);
  },

  async toggleOwnerPayoutFreeze(userId: string, isPayoutFrozen: boolean) {
    const owner = await ownerRepository.findByUserId(userId);
    if (!owner) {
      throw new AppError('Owner profile not found', HTTP_STATUS.NOT_FOUND);
    }
    owner.isPayoutFrozen = isPayoutFrozen;
    await owner.save();
    return owner;
  },
};
