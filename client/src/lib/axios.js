import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api/v1` : 'http://localhost:4000/api/v1'

const api = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true
})


export default api