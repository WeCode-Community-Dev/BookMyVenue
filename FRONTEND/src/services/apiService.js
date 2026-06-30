import { AsteriskWaves } from "@mynaui/icons-react";
import axiosInstance from "./axiosInstance";
import axios from "axios";

const apiService = {
    login: async (payload) => {
        const response = await axiosInstance.post('/auth/login', payload)
        return response.data
    },
    signup: async (payload) => {
        const response = await axiosInstance.post('/auth/signup', payload)
        return response.data
    },
    getAllVenues: async () => {
        const response = await axiosInstance.get('/venues/')
        return response.data
    },
    getVenueByID: async (id) => {
        const response = await axiosInstance.get(`/venues/details/${id}`)
        return response.data
    },
    postBasicVenueDetails: async(payload) => {
        const response = await axiosInstance.post(`/venues/basic-details`, payload)
        return response.data
    },
    postVenueAmenities: async(payload, venue_id) => {
        const response = await axiosInstance.post(`/venues/${venue_id}/amenities`, payload)
        return response.data
    },
    postVenuePhotos: async(payload, venue_id) => {
        const response = await axiosInstance.post(`/venues/${venue_id}/images`, payload)
        return response.data
    },
    postVenueAvailability: async (payload, venue_id) => {
        const response = await axiosInstance.post(`/venues/${venue_id}/availability`, payload)
        return response.data
    },
    createPaymentOrder: async (payload) => {
        const response = await axiosInstance.post(`/payments/create-order`, payload);
        return response.data;
    },
    verifyPayment: async (payload) => {
        const response = await axiosInstance.post('/payments/verify-payment', payload);
        return response.data;
    },
    updateVenueAvailability: async (payload, venue_id) => {
        const response = await axiosInstance.patch(`/venues/active-status/${venue_id}`, payload)
        return response.data
    },
    GetVenueBookings: async (venue_id) => {
        const response = await axiosInstance.get(`/booking/bookings/${venue_id}`)
        return response.data
    },
    GetOwnerVenues: async (user_id) => {
        const response = await axiosInstance.get(`/venues/user/${user_id}`)
        return response.data
    },
    GetAllVenuesForAdmin: async () => {
        const response = await axiosInstance.get(`/venues/all`)
        return response.data
    },
    updateAdminVenueApproval: async (payload, venue_id) => {
        const response = await axiosInstance.post(`/admin/venue/${venue_id}`, payload)
        return response.data
    }

}

export default apiService