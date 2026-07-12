import { createSlice } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: "USER" | "VENUE_OWNER" | "ADMIN";
  profileIssues: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  justLoggedOut: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    justLoggedOut: false,
};

const AuthSlice = createSlice({
    name: "AuthReducer",
    initialState,
    reducers: {
        setLoading: (state, action: { payload: boolean }) => {
            state.loading = action.payload;
        },
        setError: (state, action: { payload: string | null }) => {
            state.error = action.payload;
        },
        setAuthSuccess: (state, action: { payload: User }) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
            state.justLoggedOut = false;
        },
        setLogout: (
            state,
            action: { payload: { isManual?: boolean } | undefined },
        ) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            state.loading = false;
            state.justLoggedOut = action.payload?.isManual ?? false;
        },
    },
});

export const { setLoading, setError, setAuthSuccess, setLogout } =
  AuthSlice.actions;

export const selectUser = (state: { AuthReducer: AuthState }) => {
    return state.AuthReducer.user;
};

export const selectIsAuthenticated = (state: { AuthReducer: AuthState }) => {
    return state.AuthReducer.isAuthenticated;
};

export const selectAuthLoading = (state: { AuthReducer: AuthState }) => {
    return state.AuthReducer.loading;
};

export const selectAuthError = (state: { AuthReducer: AuthState }) => {
    return state.AuthReducer.error;
};

export const selectJustLoggedOut = (state: { AuthReducer: AuthState }) => {
    return state.AuthReducer.justLoggedOut;
};

export default AuthSlice.reducer;
