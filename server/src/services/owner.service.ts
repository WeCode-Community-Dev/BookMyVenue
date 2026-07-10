import { ownerRepository } from '../repositories/owner.repository';

export const ownerService = {
  async approveOwner(userId: string) {
    const owner = await ownerRepository.findByUserId(userId);
    if (!owner) {
      throw new Error('Owner profile not found');
    }

    return await ownerRepository.approve(userId);
  },

  async rejectOwner(userId: string, reason: string) {
    const owner = await ownerRepository.findByUserId(userId);

    if (!owner) {
      throw new Error('Owner profile not found');
    }

    if (!reason.trim()) {
      throw new Error('Rejection reason is required');
    }

    return await ownerRepository.reject(userId, reason);
  },
};
