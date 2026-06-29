import { AsteriskWaves } from "@mynaui/icons-react";
import axiosInstance from "./axiosInstance";

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
    createPaymentOrder: async (amount) => {
        const response = await axiosInstance.post(`/payments/create-order`, {amount})
        return response.data
    },
    verifyPayment: async (paymentDetails) => {
        const response = await axiosInstance.post('/payments/verify-payment', paymentDetails);
        return response.data;
    },
    updateVenueAvailability: async (payload, venue_id) => {
        const response = await axiosInstance.patch(`/venues/active-status/${venue_id}`, payload)
        return response.data
    },

}

export default apiService