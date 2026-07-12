import { useDispatch, useSelector } from "react-redux";
import { apiFetch } from "@/features/auth/authApi";
import {
    setLoading,
    setError,
    setOtpSent,
    clearOtpSent,
    setAuthSuccess,
    setLogout,
    selectUser,
    selectIsAuthenticated,
    selectAuthLoading,
    selectAuthError,
    selectOtpSent,
    selectEmailSentTo,
} from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";

export const authService = () => {

    const dispatch = useDispatch();
    const router = useRouter();

    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);
    const otpSent = useSelector(selectOtpSent);
    const emailSentTo = useSelector(selectEmailSentTo);

    const requestOtp = async (email: string) => {

        dispatch(setLoading(true));
        dispatch(setError(null));

        try {

            await apiFetch('/auth/otp/request', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });

            dispatch(setOtpSent({ email }));
            return { success: true };

        } catch (err: any) {

            dispatch(setError(err.message || 'Failed to send OTP'));
            return { success: false, error: err.message };

        } finally {
            dispatch(setLoading(false));
        }
    };

    const verifyOtp = async (email: string, otp: string) => {

        dispatch(setLoading(true));
        dispatch(setError(null));

        try {

            const result = await apiFetch('/auth/otp/verify', {
                method: 'POST',
                body: JSON.stringify({ email, otp }),
            });

            dispatch(setAuthSuccess(result.user));
            router.push('/');
            return { success: true, user: result.user };

        } catch (err: any) {

            dispatch(setError(err.message || 'Verification failed'));
            return { success: false, error: err.message };

        } finally {
            dispatch(setLoading(false));
        }
    };

    const register = async (name: string, email: string, mobile: string, password?: string) => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const result = await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, mobile, password }),
            });

            return { success: true, message: result.message };

        } catch (err: any) {
            dispatch(setError(err.message || 'Registration failed'));
            return { success: false, error: err.message };

        } finally {
            dispatch(setLoading(false));
        }
    };

    const fetchProfile = async () => {
        dispatch(setLoading(true));

        try {
            const userProfile = await apiFetch('/auth/myprofile');

            if (userProfile) {
                dispatch(setAuthSuccess(userProfile));
            }

        } catch (err) {
            dispatch(setLogout());

        } finally {
            dispatch(setLoading(false));
        }
    };

    const logout = async () => {
        dispatch(setLoading(true));
        try {
            await apiFetch('/auth/logout', { method: 'POST' });
        } catch (err) {
            console.error('Logout error on backend:', err);
        } finally {
            dispatch(setLogout({ isManual: true }));
            dispatch(clearOtpSent());
            router.push('/venues');
            dispatch(setLoading(false));
        }
    };

    return {
        user,
        isAuthenticated,
        loading,
        error,
        otpSent,
        emailSentTo,
        requestOtp,
        verifyOtp,
        register,
        fetchProfile,
        logout,
        clearError: () => dispatch(setError(null)),
        changeEmail: () => dispatch(clearOtpSent()),
    };
};
