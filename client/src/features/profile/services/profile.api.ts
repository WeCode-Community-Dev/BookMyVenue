import { apiClient } from '@/services/apiClient';

export interface ProfileResponse {
  success: boolean;
  message?: string;
  data: {
    user: {
      _id: string;
      fullName: string;
      email: string;
      phoneNumber?: string;
      role: 'user' | 'owner' | 'admin';
      isVerified: boolean;
      isBlocked: boolean;
      avatar?: string;
      authProvider: 'local' | 'google';
      createdAt: string;
      updatedAt: string;
    };
    owner?: {
      _id: string;
      userId: string;
      idProof: string;
      address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
      };
      bankDetails: {
        accountHolderName: string;
        accountNumber: string;
        ifscCode: string;
      };
      verificationStatus: 'pending' | 'approved' | 'rejected';
      verifiedAt?: string;
      rejectionReason?: string;
      createdAt: string;
      updatedAt: string;
    } | null;
  };
}

export const profileApi = {
  getProfile: async (): Promise<ProfileResponse> => {
    const res = await apiClient.get('/users/profile');
    return res.data;
  },

  updateProfile: async (formData: FormData): Promise<ProfileResponse> => {
    const res = await apiClient.put('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  requestPasswordOtp: async (): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.post('/users/profile/password/request-otp');
    return res.data;
  },

  changePassword: async (data: { otp: string; newPassword: string }): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.patch('/users/profile/password/change', data);
    return res.data;
  },
};
