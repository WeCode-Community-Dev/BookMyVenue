import axios, { type AxiosError } from 'axios';

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

    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (
            error.response?.status !== 401 ||
            originalRequest?._retry
        ) {
            return Promise.reject(normalizeAxiosError(error));
        }

        originalRequest._retry = true;

        try {
            const refreshToken = tokenStorage.getRefreshToken();

            if (!refreshToken) {
                throw error;
            }

            const response = await axios.post(
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

            // window.location.href = '/sign-in';

            return Promise.reject(
                normalizeAxiosError(refreshError),
            );
        }
    },
);

function normalizeAxiosError(error: unknown): Error {
    if (!axios.isAxiosError(error)) {
        return error instanceof Error
            ? error
            : new Error('Something went wrong');
    }

    const data = error.response?.data as any;

    const message =
        data?.message ||
        data?.error ||
        error.message ||
        'Something went wrong';

    return new Error(
        Array.isArray(message)
            ? message.join('\n')
            : message,
    );
}