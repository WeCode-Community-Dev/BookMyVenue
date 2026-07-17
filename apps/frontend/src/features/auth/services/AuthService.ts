import {
    selectAuthLoading,
    selectIsAuthenticated,
    selectUser,
    setAuthSuccess,
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
            console.warn(
                "Failed to refresh token (session expired or logged out):",
                error,
            );
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

function getCookie(cookieName: string): string | null {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${cookieName}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
}

function deleteCookie(cookieName: string) {
    if (typeof document === "undefined") return;
    document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export const useAuthService = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectAuthLoading);

    async function apiFetch(path: string, options: RequestInit = {}) {
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
                    dispatch(setLogout());
                    console.warn("Session expired or invalid token:", error);
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

    const requestOtp = async (email: string) => {
        dispatch(setLoading(true));

        try {
            await apiFetch("/auth/otp/request", {
                method: "POST",
                body: JSON.stringify({ email }),
            });
            return { success: true };
        } catch (apiError: any) {
            return {
                success: false,
                error: apiError.message || "Failed to send OTP",
            };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const googleAuthCallback = async () => {
        console.log("Google auth callback triggered");
    };

    const verifyOtp = async (email: string, otp: string) => {
        dispatch(setLoading(true));

        try {
            const result = await apiFetch("/auth/otp/verify", {
                method: "POST",
                body: JSON.stringify({ email, otp }),
            });

            setTimeout(() => {
                dispatch(setAuthSuccess(result.user));
                router.push("/");
            }, 1000);

            return { success: true, user: result.user };
        } catch (apiError: any) {
            return {
                success: false,
                error: apiError.message || "Verification failed",
            };
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

        try {
            const result = await apiFetch("/auth/register", {
                method: "POST",
                body: JSON.stringify({ name: userName, email, mobile, password }),
            });

            return { success: true, message: result.message };
        } catch (apiError: any) {
            return {
                success: false,
                error: apiError.message || "Registration failed",
            };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const fetchProfile = async () => {
        if (typeof window !== "undefined") {
            const oauthLogin = getCookie("oauth_login");
            if (oauthLogin === "true") {
                localStorage.setItem("isAuthenticated", "true");
                deleteCookie("oauth_login");
            }
        }

        if (
            typeof window !== "undefined" &&
      localStorage.getItem("isAuthenticated") !== "true"
        ) {
            dispatch(setLogout());
            return;
        }

        dispatch(setLoading(true));

        try {
            const userProfile = await apiFetch("/auth/myprofile");

            if (userProfile && userProfile.user) {
                dispatch(setAuthSuccess(userProfile.user));
            }
        } catch (apiError: any) {
            console.warn(
                "Failed to fetch profile (unauthenticated or session expired):",
                apiError,
            );
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

    const loginWithGoogle = () => {
        if (typeof window !== "undefined") {
            window.location.href = `${BASE_URL}/auth/google`;
        }
    };

    return {
        user,
        isAuthenticated,
        loading,
        requestOtp,
        verifyOtp,
        submitRegistration,
        fetchProfile,
        googleAuthCallback,
        loginWithGoogle,
        logout,
    };
};
