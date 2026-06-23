import { axiosClient } from 'src/lib/axios';

export interface AdminDashboardDto {
    totalUsers: number;
    totalOwners: number;
    totalVenues: number;
    venueStatusSummary: { status: string; count: number }[];
    approvalPendingVenues: {
        id: string;
        title: string;
        addressLine1: string;
        venueType: string;
        capacity: number;
    }[];
}

export interface OwnerDashboardDto {
    venueCount: number;
    bookingCount: number;
    totalRevenue: number;
    recentBookings: {
        id: string;
        venueName: string;
        startDate: string;
        endDate: string;
        guestsCount: number;
        amount: number;
    }[];
}

export class DashboardApiService {
    static async getAdminDashboard(): Promise<AdminDashboardDto> {
        const response = await axiosClient.get('/dashboard/admin');
        return response.data;
    }

    static async getOwnerDashboard(): Promise<OwnerDashboardDto> {
        const response = await axiosClient.get('/dashboard/owner');
        return response.data;
    }
}
