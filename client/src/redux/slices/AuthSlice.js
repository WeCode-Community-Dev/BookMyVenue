import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";
import { ROLES } from "@/constants/Roles";

const initialState = {
  loading: false,
  error: null,
  role: null,
  
};

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

//verify OTP

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ role = ROLES.USER, email, otpCode }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ROUTES.AUTH.VERIFY_OTP(role),
        {
          email,
          otpCode,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

//Resend OTP

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async ({ role, email }, thunkAPI) => {
    try {
      const response = await api.post(
        API_ROUTES.AUTH.RESEND_OTP(role),
        { email }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
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

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
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

      //Resend OTP

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
        state.loading = false;
        
        // Safely extract token and user
        const responseData = action.payload.data || action.payload;
        const accessToken = responseData.accessToken || responseData.token;
        const user = responseData.user;

        state.accessToken = accessToken;
        state.user = user;
        state.role = user?.role || action.meta.arg.role; // Track current user role
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
  },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;