import axios from 'axios'
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get("authToken")
        const role = Cookies.get("userRole")

        if(token){
            config.headers["Authorization"] = `Bearer ${token}`
        }
        if (role){
            config.headers["role"] = role
        }

        config.headers["ngrok-skip-browser-warning"] = 'true';
        
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default axiosInstance