import { apiClient } from '@/services/apiClient';
import type { OwnerVerificationResponse, User, UserQuery, MyBookingsResponse } from '../types';

export const usersApi = {
  getAll: async (
    query: UserQuery
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      users: User[];
      totalUsers: number;
    };
  }> => {
    const res = await apiClient.get('/admin/users', { params: query });
    const usersData = res.data.data.users.map((u: any) => ({
      id: u._id,
      name: u.fullName,
      email: u.email,
      role: u.role,
      isActive: !u.isBlocked,
      imageUrl: u.avatar || null,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
    console.log(usersData);
    return {
      ...res.data,
      data: {
        users: usersData,
        totalUsers: res.data.data.totalUsers,
      },
    };
  },

  getById: async (id: string): Promise<{ success: boolean; message: string; data: User }> => {
    const res = await apiClient.get(`/admin/users/${id}`);
    const u = res.data.data;
    const mappedUser = {
      id: u._id,
      name: u.fullName,
      email: u.email,
      role: u.role,
      isActive: !u.isBlocked,
      imageUrl: u.avatar || null,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      verificationStatus: u.owner?.verificationStatus,
      rejectionReason: u.owner?.rejectionReason,
      verifiedAt: u.owner?.verifiedAt,
      owner: u.owner,
    };
    return {
      ...res.data,
      data: mappedUser,
    };
  },

  remove: async (id: string): Promise<{ success: boolean; message: string; data: User }> => {
    const res = await apiClient.patch(`/admin/users/${id}/block`);
    const u = res.data.data;
    const mappedUser = {
      id: u._id,
      name: u.fullName,
      email: u.email,
      role: u.role,
      isActive: !u.isBlocked,
      imageUrl: u.avatar || null,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
    return {
      ...res.data,
      data: mappedUser,
    };
  },

  restore: async (id: string): Promise<{ success: boolean; message: string; data: User }> => {
    const res = await apiClient.patch(`/admin/users/${id}/unblock`);
    const u = res.data.data;
    const mappedUser = {
      id: u._id,
      name: u.fullName,
      email: u.email,
      role: u.role,
      isActive: !u.isBlocked,
      imageUrl: u.avatar || null,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
    return {
      ...res.data,
      data: mappedUser,
    };
  },
  approveOwner: async (
    id: string
  ): Promise<{ success: boolean; message: string; data: OwnerVerificationResponse }> => {
    const res = await apiClient.patch(`/admin/owners/${id}/approve`);

    console.log(res.data);

    return {
      ...res.data,
    };
  },

  rejectOwner: async (
    id: string,
    reason: string
  ): Promise<{ success: boolean; message: string; data: OwnerVerificationResponse }> => {
    const res = await apiClient.patch(`/admin/owners/${id}/reject`, {
      reason,
    });

    return {
      ...res.data,
    };
  },

  getBookings: async (page = 1, limit = 10, status?: string): Promise<{
    success: boolean;
    message: string;
    data: MyBookingsResponse;
  }> => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (status && status !== 'all') {
      params.append('status', status);
    }
    const res = await apiClient.get(`/users/bookings?${params.toString()}`);
    const rawData = res.data?.data;

    return {
      success: res.data?.success ?? true,
      message: res.data?.message ?? '',
      data: {
        bookings: rawData?.bookings ?? [],
        totalBookings: rawData?.totalBookings ?? 0,
        pagination: rawData?.pagination ?? null,
      },
    };
  },
};
