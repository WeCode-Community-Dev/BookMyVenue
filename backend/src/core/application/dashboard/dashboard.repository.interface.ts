import type { VenueStatus } from "src/core/domain/venues/entities/venue.entity";

export interface AdminDashboardDto {
    totalUsers: number;
    totalOwners: number;
    totalVenues: number;
    venueStatusSummary: { status: VenueStatus, count: number }[]
    approvalPendingVenues: {
        id: string
        title: string
        addressLine1: string
        venueType: string
        capacity: number
    }[]
}

export interface OwnerDashboardDto {
    venueCount: number,
    bookingCount: number,
    totalRevenue: number
    recentBookings: {
        id: string,
        venueName: string,
        startDate: Date,
        endDate: Date,
        guestsCount: number,
        amount: number,
    }[]
}

export interface IDashboardRepository {

    getAdminDashboard(): Promise<AdminDashboardDto>;
    getOwnerDashboard(ownerId: string): Promise<OwnerDashboardDto>;
}