import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import type { AdminDashboardDto, IDashboardRepository, OwnerDashboardDto } from 'src/core/application/dashboard/dashboard.repository.interface';

@Injectable()
export class PrismaDashboardRepository implements IDashboardRepository {
    constructor(private readonly prisma: PrismaService) { }

    async getAdminDashboard(): Promise<AdminDashboardDto> {

        const [
            approvalPendingVenues,
            totalOwners,
            totalUsers,
            statusSummary
        ] = await Promise.all([
            this.prisma.venues.findMany({
                where: { status: 'PENDING' }
            }),
            this.prisma.users.count({ where: { role: 'VENUE_OWNER' } }),
            this.prisma.users.count({ where: { role: 'USER' } }),
            this.prisma.venues.groupBy({
                by: 'status',
                _count: true,
            })
        ])

        const totalVenues = statusSummary.reduce((p, c) => p + c._count, 0)

        return {
            totalOwners,
            totalUsers,
            totalVenues,
            venueStatusSummary: statusSummary.map((sm) => ({
                count: sm._count,
                status: sm.status
            })),
            approvalPendingVenues: approvalPendingVenues.map(v => ({
                id: v.id,
                addressLine1: v.address_line_1,
                capacity: v.capacity,
                title: v.title,
                venueType: v.venue_type
            })),

        }
    }

    async getOwnerDashboard(ownerId: string): Promise<OwnerDashboardDto> {

        const [
            bookingCount,
            totalRevenue,
            venueCount,
            recentBookings
        ] = await Promise.all([
            this.prisma.bookings.count({ where: { venue: { owner_id: ownerId } } }),
            this.prisma.bookings.aggregate({
                _sum: { total_amount: true },
                where: {
                    venue: { owner_id: ownerId }
                }
            }),
            this.prisma.venues.count({ where: { owner_id: ownerId } }),
            this.prisma.bookings.findMany({
                where: { venue: { owner_id: ownerId } },
                take: 10,
                orderBy: { created_at: 'desc' },
                include: {
                    venue: true
                }
            })
        ])

        return {
            bookingCount,
            venueCount,
            totalRevenue: totalRevenue._sum.total_amount?.toNumber() || 0,
            recentBookings: recentBookings.map(b => ({
                id: b.id,
                amount: b.total_amount.toNumber(),
                endDate: b.booking_end,
                startDate: b.booking_start,
                guestsCount: b.guests_count,
                venueName: b.venue.title,
            }))
        }
    }
}
