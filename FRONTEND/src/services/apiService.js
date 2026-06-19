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
    
}

export default apiService