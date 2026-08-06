"use server";

import { BookingStatus, prisma, VerificationStatus, District, VenueCategory } from "@bookmyvenue/database";
import { unstable_cache } from "next/cache";
import { fromSmallUnit } from "../../lib/utils";

export type AdminDashboardStats = {
    totalRevenue: number;
    totalBookings: number;
    approvedVenues: number;
    totalUsers: number;
};

export type AdminDashboardRevenueData = {
    month: string;
    revenue: number;
    bookings: number;
};

export type AdminDashboardCategoryData = {
    name: VenueCategory;
    value: number;
};

export type AdminDashboardDistrictData = {
    district: District;
    venues: number;
    bookings: number;
};

export type AdminDashboardRecentBooking = {
    id: string;
    status: BookingStatus;
    user: {
        name: string | null;
    };
    venue: {
        name: string;
    };
    eventDate: string | null;
    totalAmount: number;
};

export type AdminDashboardResponse = {
    stats: AdminDashboardStats;
    revenueData: AdminDashboardRevenueData[];
    categoryData: AdminDashboardCategoryData[];
    districtData: AdminDashboardDistrictData[];
    recentBookings: AdminDashboardRecentBooking[];
};


export const fetchAdminDashboard = unstable_cache(
    async () => {
        const [
            totalBookings,
            approvedVenues,
            totalUsers,
            revenueResult,
            categoryResult,
            districtResult,
            recentBookingsResult,
            monthlyBookingSessions,
            monthlyBookings,
        ] = await Promise.all([
            prisma.venue.count(),
            prisma.venue.count({ where: { verificationStatus: VerificationStatus.APPROVED } }),
            prisma.user.count(),
            prisma.bookingSession.aggregate({
                where: { booking: { status: BookingStatus.CONFIRMED } },
                _sum: { pricePaid: true },
            }),
            prisma.venue.groupBy({ by: ["category"], _count: { id: true } }),
            prisma.venue.groupBy({ by: ["district"], _count: { id: true } }),
            prisma.booking.findMany({
                take: 5,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    status: true,
                    user: { select: { name: true } },
                    venue: { select: { name: true } },
                    bookingSessions: { select: { eventDate: true, pricePaid: true } },
                },
            }),
            prisma.bookingSession.findMany({
                where: { booking: { status: "CONFIRMED" } },
                select: { pricePaid: true, booking: { select: { createdAt: true } } },
            }),
            prisma.booking.findMany({ select: { createdAt: true } }),
        ]);
        const totalVenues = categoryResult.reduce((total, category) => total + category._count.id, 0);

        const categoryData = categoryResult.map((category) => ({
            name: category.category,
            value: totalVenues > 0 ? Math.round((category._count.id / totalVenues) * 100) : 0,
        }));

        const districtBookingCounts = await prisma.booking.groupBy({
            by: ["venueId"],
            _count: {
                id: true,
            },
        });

        const venueDistricts = await prisma.venue.findMany({
            select: {
                id: true,
                district: true,
            },
        });
        const bookingCountByVenue = new Map(
            districtBookingCounts.map((booking) => [booking.venueId, booking._count.id]),
        );

        const bookingsByDistrict = venueDistricts.reduce<Partial<Record<string, number>>>((result, venue) => {
            result[venue.district] = (result[venue.district] ?? 0) + (bookingCountByVenue.get(venue.id) ?? 0);

            return result;
        }, {});

        const districtData = districtResult.map((district) => ({
            district: district.district,
            venues: district._count.id,
            bookings: bookingsByDistrict[district.district] ?? 0,
        }));

        const revenueByMonth = new Map<string, number>();
        const bookingsByMonth = new Map<string, number>();

        for (const bookingSession of monthlyBookingSessions) {
            const month = bookingSession.booking.createdAt.toLocaleString("en-US", {
                month: "short",
            });
            revenueByMonth.set(month, (revenueByMonth.get(month) ?? 0) + bookingSession.pricePaid);
        }

        for (const booking of monthlyBookings) {
            const month = booking.createdAt.toLocaleString("en-US", {
                month: "short",
            });

            bookingsByMonth.set(month, (bookingsByMonth.get(month) ?? 0) + 1);
        }

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

        const revenueData = months.map((month) => ({
            month,
            revenue: fromSmallUnit(revenueByMonth.get(month) ?? 0),
            bookings: bookingsByMonth.get(month) ?? 0,
        }));

        const recentBookings = recentBookingsResult.map(({ bookingSessions, ...booking }) => ({
            ...booking,
            eventDate: bookingSessions[0]?.eventDate?.toISOString() ?? null,
            totalAmount: fromSmallUnit(
                bookingSessions.reduce((total, session) => total + session.pricePaid, 0),
            ),
        }));

        return {
            stats: {
                totalRevenue: fromSmallUnit(revenueResult._sum.pricePaid ?? 0),
                totalBookings,
                approvedVenues,
                totalUsers,
            },
            revenueData,
            categoryData,
            districtData,
            recentBookings,
        };
    },
    ["admin-dashboard"],
    { revalidate: 60, tags: ["admin-dashboard"] },
);
