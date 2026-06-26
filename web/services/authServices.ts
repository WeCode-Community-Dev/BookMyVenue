// "use server";

import { UserRole } from "@/components/auth/role-selector";
import { apiFetch } from "./api";

export type LoginResponse = {
    success: boolean;
    data: { accessToken: string; role: UserRole; }
}

export const login = async (data: { email: string, password: string }): Promise<LoginResponse> => {

    try {
        const response = await apiFetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export type SignupResponse = {
    success: boolean;
    data: { accessToken: string; role: UserRole; }
}

export const signup = async (data: { role: UserRole, firstName: string, lastName: string, email: string, phone: string, password: string, confirmPassword: string }): Promise<SignupResponse> => {

    try {
        const response = await apiFetch('/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

