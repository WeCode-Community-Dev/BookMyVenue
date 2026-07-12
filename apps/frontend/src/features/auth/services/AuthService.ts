import {
    selectAuthError,
    selectAuthLoading,
    selectIsAuthenticated,
    selectUser,
    setAuthSuccess,
    setError,
    setLoading,
    setLogout,
} from "@/features/auth/AuthSlice";
import { useDispatch, useSelector } from "react-redux";

import store from "@/store/Store";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

let refreshPromise: Promise<any> | null = null;

async function silentRefresh() {
    if (refreshPromise) {
        return refreshPromise;
    }

    const url = `${BASE_URL}/auth/refresh`;

    refreshPromise = fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    })
        .then(async (response) => {
            refreshPromise = null;
            if (!response.ok) {
                throw new Error("Failed to refresh token");
            }

            return response.json();
        })
        .catch((error) => {
            refreshPromise = null;
            store.dispatch(setLogout());
            console.error("Failed to refresh token:", error);
            throw error;
        });

    return refreshPromise;
}

async function parseResponse(response: Response) {
    if (response.status === 204) {
        return null;
    }

    try {
        return await response.json();
    } catch (error) {
        console.error("Failed to parse response:", error);
        return null;
    }
}

export async function apiFetch(path: string, options: RequestInit = {}) {
    const url = `${BASE_URL}${path}`;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers,
            credentials: "include",
        });

        // (if request gets 401, refresh and retry once)
        if (response.status === 401 && path !== "/auth/refresh") {
            try {
                await silentRefresh();

                // Retry with fresh credentials
                const retryResponse = await fetch(url, {
                    ...options,
                    headers,
                    credentials: "include",
                });

                return await parseResponse(retryResponse);
            } catch (error) {
                store.dispatch(setLogout());
                console.error("Session expired:", error);
                throw new Error("Session expired");
            }
        }

        if (!response.ok) {
            let errorMessage = "An error occurred";

            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
                console.error("API Error:", errorMessage);
            } catch (error) {
                console.error("Failed to parse error response:", error);
            }

            throw new Error(errorMessage);
        }

        return await parseResponse(response);
    } catch (error: any) {
        throw new Error(error.message || "Network error");
    }
}

export const useAuthService = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    const requestOtp = async (email: string) => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            await apiFetch("/auth/otp/request", {
                method: "POST",
                body: JSON.stringify({ email }),
            });
            return { success: true };
        } catch (apiError: any) {
            dispatch(setError(apiError.message || "Failed to send OTP"));
            return { success: false, error: apiError.message };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const verifyOtp = async (email: string, otp: string) => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const result = await apiFetch("/auth/otp/verify", {
                method: "POST",
                body: JSON.stringify({ email, otp }),
            });

            dispatch(setAuthSuccess(result.user));
            router.push("/");
            return { success: true, user: result.user };
        } catch (apiError: any) {
            dispatch(setError(apiError.message || "Verification failed"));
            return { success: false, error: apiError.message };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const submitRegistration = async (
        userName: string,
        email: string,
        mobile: string,
        password?: string,
    ) => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const result = await apiFetch("/auth/register", {
                method: "POST",
                body: JSON.stringify({ name: userName, email, mobile, password }),
            });

            return { success: true, message: result.message };
        } catch (apiError: any) {
            dispatch(setError(apiError.message || "Registration failed"));
            return { success: false, error: apiError.message };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const fetchProfile = async () => {
        dispatch(setLoading(true));

        try {
            const userProfile = await apiFetch("/auth/myprofile");

            if (userProfile) {
                dispatch(setAuthSuccess(userProfile));
            }
        } catch (apiError: any) {
            console.error("Failed to fetch profile:", apiError);
            dispatch(setLogout());
        } finally {
            dispatch(setLoading(false));
        }
    };

    const logout = async () => {
        dispatch(setLoading(true));
        try {
            await apiFetch("/auth/logout", { method: "POST" });
        } catch (apiError: any) {
            console.error("Logout error on backend:", apiError);
        } finally {
            dispatch(setLogout({ isManual: true }));
            router.push("/venues");
            dispatch(setLoading(false));
        }
    };

    return {
        user,
        isAuthenticated,
        loading,
        error,
        requestOtp,
        verifyOtp,
        submitRegistration,
        fetchProfile,
        logout,
        clearError: () => {
            return dispatch(setError(null));
        },
    };
};
