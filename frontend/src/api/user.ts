import { axiosClient } from "src/lib/axios";

import type { ListUserResponse } from "./types/user.typs";


export class UserApiService {
    /**
     * Get current user profile
     */
    static async me() {
        const response =
            await axiosClient.get(
                '/users/me',
            );
        return response.data;
    }

    /**
     * Get list of users with pagination
     */
    static async listUsers(page: number = 1, limit: number = 10) {
        const response =
            await axiosClient.get(
                '/users',
                {
                    params: { page, limit },
                }
            );
        return response.data as ListUserResponse
    }
}