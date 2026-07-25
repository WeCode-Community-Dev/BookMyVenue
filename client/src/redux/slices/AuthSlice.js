import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";
import { ROLES } from "@/constants/Roles";

const initialState = {
  loading: false,
  error: null,
  user: null,
  role: null,
  accessToken: null,
  isAuthenticated: false,
  otpVerified: false,
};

// --- Async Thunks ---

// Register User
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ role = ROLES.USER, userData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ROUTES.AUTH.REGISTER(role),
        userData
      );

      return {
        ...response.data,
        role,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ role = ROLES.USER, email, otpCode }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ROUTES.AUTH.VERIFY_OTP(role),
        { email, otpCode }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

// Resend OTP
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async ({ role, email }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ROUTES.AUTH.RESEND_OTP(role),
        { email }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to resend OTP"
      );
    }
  }
);

// Login User / Vendor
export const login = createAsyncThunk(
  "auth/login",
  async ({ role = ROLES.USER, data }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(clearAuthError());

      const response = await api.post(
        API_ROUTES.AUTH.LOGIN(role),
        data
      );

      console.log("response from login: ", response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// Logout User / Vendor
export const logout = createAsyncThunk(
  "auth/logout",
  async ({ role }, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ROUTES.AUTH.LOGOUT(role));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Logout failed"
      );
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    { role = ROLES.USER, token, password, confirmPassword },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        API_ROUTES.AUTH.RESET_PASSWORD(role),
        { token, password, confirmPassword }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Password reset failed"
      );
    }
  }
);

// Check Auth Status (Get Me)
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ROUTES.AUTH.GETME);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Check auth failed"
      );
    }
  }
);

// --- Auth Slice ---

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    resetOtpStatus: (state) => {
      state.otpVerified = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload.role;
        state.otpVerified = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Resend OTP
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const responseData = action.payload?.data || action.payload || {};
        const accessToken = responseData.accessToken || responseData.token;
        const user = responseData.user || responseData.vendor;

        state.loading = false;
        state.accessToken = accessToken;
        state.user = user;
        state.role = user?.role || responseData.role || action.meta.arg.role;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, () => {
        return initialState; // Reset store completely back to original clean state
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        const responseData = action.payload?.data || action.payload || {};

        state.loading = false;
        state.accessToken = responseData.accessToken || responseData.token;
        state.user = responseData.user || responseData.vendor || responseData;
        state.role = responseData.role || responseData.user?.role;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthError, resetOtpStatus } = authSlice.actions;

export default authSlice.reducer;