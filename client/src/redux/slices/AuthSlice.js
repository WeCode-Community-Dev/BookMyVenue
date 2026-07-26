import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";


const initialState = {
  loading: false,
  error: null,
  user: null,
  role: null,
  accessToken: null,
  isAuthenticated: false,
};


export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ role, userData }, { rejectWithValue }) => {
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

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ role, email, otpCode }, { rejectWithValue }) => {
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

export const login = createAsyncThunk(
  "auth/login",
  async ({ role, data }, { rejectWithValue }) => {
    try {
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


export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    { role, token, password, confirmPassword },
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



const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload.role;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken
        state.user = action.payload.user
        state.role = action.payload.role
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.accessToken = null
        state.isAuthenticated = false
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken
        state.user = action.payload.user
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { setAccessToken } = authSlice.actions;

export default authSlice.reducer;