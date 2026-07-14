import { axiosClient } from "src/lib/axios";


export class BookingApiService {

    /**
     * Get list of users with pagination
     */
    static async getAllBookingsForOwner() {
        const response = await axiosClient.get('/bookings/owner/all-bookings');
        return response.data
    }

    /**
     * Get list of users with pagination
     */
    static async getBookingDetailsForOwner(bookingId: string) {
        const response = await axiosClient.get('/bookings/' + bookingId);
        return response.data
    }


}