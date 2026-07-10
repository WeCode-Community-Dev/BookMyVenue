import Owner from '../models/owner.model';

export const ownerRepository = {
  async findByUserId(userId: string) {
    return await Owner.findOne({ userId }).populate('userId');
  },

  async approve(userId: string) {
    return await Owner.findOneAndUpdate(
      { userId },
      {
        verificationStatus: 'approved',
        verifiedAt: new Date(),
        rejectionReason: null,
      },
      { new: true }
    ).populate('userId');
  },

  async reject(userId: string, reason: string) {
    return await Owner.findOneAndUpdate(
      { userId },
      {
        verificationStatus: 'rejected',
        rejectionReason: reason,
        verifiedAt: null,
      },
      { new: true }
    ).populate('userId');
  },
};
