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
    }
}

export default apiService