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

  async resubmitOwner(userId: string, data: any) {
    const owner = await ownerRepository.findByUserId(userId);
    if (!owner) {
      throw new Error('Owner profile not found');
    }

    return await ownerRepository.resubmit(userId, data);
  },

  async toggleOwnerPayoutFreeze(userId: string, isPayoutFrozen: boolean) {
    const owner = await ownerRepository.findByUserId(userId);
    if (!owner) {
      throw new Error('Owner profile not found');
    }
    owner.isPayoutFrozen = isPayoutFrozen;
    await owner.save();
    return owner;
  },
};
