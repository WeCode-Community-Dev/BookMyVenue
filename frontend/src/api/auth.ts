
import { axiosClient } from 'src/lib/axios';

import type {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
} from './types/auth.type';

export class AuthApiService {
    /**
     * Login
     */
    static async login(
        payload: LoginRequest,
    ): Promise<AuthResponse> {
        const response =
            await axiosClient.post<AuthResponse>(
                '/auth/login',
                payload,
            );

        return response.data;
    }

    /**
     * Register
     */
    static async register(
        payload: RegisterRequest,
    ): Promise<AuthResponse> {
        const response =
            await axiosClient.post<AuthResponse>(
                '/auth/register',
                payload,
            );

        return response.data;
    }

    /**
     * Current User
     */
    static async me() {
        const response =
            await axiosClient.get('/auth/me');

        return response.data;
    }

    /**
     * Logout
     */
    static async logout() {
        await axiosClient.post('/auth/logout');
    }

    /**
     * Refresh Token
     */
    static async refreshToken(
        refreshToken: string,
    ) {
        const response =
            await axiosClient.post(
                '/auth/refresh',
                {
                    refreshToken,
                },
            );

        return response.data;
    }

    /**
     * Forgot Password
     */
    static async forgotPassword(
        email: string,
    ) {
        const response =
            await axiosClient.post(
                '/auth/forgot-password',
                {
                    email,
                },
            );

        return response.data;
    }

    /**
     * Reset Password
     */
    static async resetPassword(
        token: string,
        password: string,
    ) {
        const response =
            await axiosClient.post(
                '/auth/reset-password',
                {
                    token,
                    password,
                },
            );

        return response.data;
    }

    /**
     * Verify Email
     */
    static async verifyEmail(
        token: string,
    ) {
        const response =
            await axiosClient.post(
                '/auth/verify-email',
                {
                    token,
                },
            );

        return response.data;
    }
}