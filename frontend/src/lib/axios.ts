import axios from 'axios';

import { tokenStorage } from './token';

const API_URL =
    import.meta.env.VITE_API_URL;

export const axiosClient = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request Interceptor
 */
axiosClient.interceptors.request.use(
    (config) => {
        const accessToken =
            tokenStorage.getAccessToken();

        if (accessToken) {
            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) =>
        Promise.reject(error),
);

/**
 * Response Interceptor
 */
axiosClient.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest =
            error.config;

        if (
            error.response?.status !== 401 ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const refreshToken =
                tokenStorage.getRefreshToken();

            if (!refreshToken) {
                throw error;
            }

            const response =
                await axios.post(
                    `${API_URL}/auth/refresh`,
                    {
                        refreshToken,
                    },
                );

            const {
                accessToken,
                refreshToken: newRefreshToken,
            } = response.data;

            tokenStorage.setTokens(
                accessToken,
                newRefreshToken,
            );

            originalRequest.headers.Authorization =
                `Bearer ${accessToken}`;

            return axiosClient(originalRequest);
        } catch (refreshError) {
            tokenStorage.clear();

            // if (window.location.href !== '/sign-in') window.location.href = '/sign-in';

            return Promise.reject(
                refreshError,
            );
        }
    },
);