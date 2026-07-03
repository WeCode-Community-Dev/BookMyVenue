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

// axiosInstance.interceptors.response.use(
//     (response) => {
//         const newTokenHeader = response.headers['authorization'] || response.headers['x-new-token'];

//         if (newTokenHeader) {
//             const tokenValue = newTokenHeader.startsWith('Bearer ') 
//                 ? newTokenHeader.split(' ')[1] 
//                 : newTokenHeader;
            
//             Cookies.set("authToken", tokenValue, { expires: 30, secure: true, sameSite: 'Lax' });
//             console.log("Token successfully refreshed and saved to cookies!");
//         }

//         return response;
//     },
//     (error) => {
//         if (error.response && error.response.status === 401) {
//             console.warn("Session expired. Logging out.");
//             Cookies.remove("authToken");
//             Cookies.remove("userRole");
//             window.location.href = '/auth';
//         }
        
//         return Promise.reject(error);
//     }
// )

export default axiosInstance