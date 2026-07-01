import { axiosClient } from 'src/lib/axios';

import type { PaymentStatus } from './types/payment.type';
import type { BookingStatus, BookingSummary } from './types/venue.type';

interface Pagination<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface BookingDetails {
    id?: string;
    bookingId?: string;
    venueId?: string;
    venueName?: string;
    venueCity?: string;
    venueState?: string;
    venueThumbnail?: string;
    venue?: {
        id: string;
        title: string;
        address?: string;
        images?: string[];
    };
    user?: {
        id: string;
        firstName: string;
        lastName?: string;
        email: string;
        phone?: string | null;
    };
    startDate: string;
    endDate: string;
    guestsCount: number;
    totalAmount: number;
    status: BookingStatus;
    paymentStatus?: PaymentStatus;
    specialRequests?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface CreateBookingRequest {
    venueId: string;
    startDate: string;
    endDate: string;
    guestsCount: number;
    specialRequests?: string;
}

export interface BookingPriceBreakdown {
    baseAmount: number;
    days: number;
    pricePerDay: number;
    serviceFee: number;
    totalAmount: number;
}

export class UserBookingApiService {
    static async createBooking(data: CreateBookingRequest): Promise<BookingDetails> {
        const response = await axiosClient.post('/bookings', data);
        return response.data;
    }

    static async getMyBookings(
        page: number = 1,
        limit: number = 10,
        status?: BookingStatus,
    ): Promise<Pagination<BookingSummary>> {
        const response = await axiosClient.get('/bookings/my-bookings', {
            params: { page, limit, ...(status ? { status } : {}) },
        });
        return response.data;
    }

    static async getBookingDetails(bookingId: string): Promise<BookingDetails> {
        const response = await axiosClient.get(`/bookings/${bookingId}`);
        return response.data?.data ?? response.data;
    }

    static async cancelBooking(bookingId: string): Promise<BookingDetails> {
        const response = await axiosClient.post(`/bookings/${bookingId}/cancel`);
        return response.data;
    }

    static async calculatePrice(
        venueId: string,
        startDate: string,
        endDate: string,
    ): Promise<BookingPriceBreakdown> {
        const response = await axiosClient.get(`/bookings/calculate-price`, {
            params: { venueId, startDate, endDate },
        });
        return response.data;
    }
}
