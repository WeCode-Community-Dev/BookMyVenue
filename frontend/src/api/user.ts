import { axiosClient } from "src/lib/axios";


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
}