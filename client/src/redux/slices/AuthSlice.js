import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";
import { ROLES } from "@/constants/Roles";

const initialState = {
  loading: false,
  error: null,
  role: null,
  user: null,
  accessToken: null
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

      console.log('response from login: ', response.data.data)
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
  async ({ role }, {rejectWithValue }) => {
    try {

      const response = await api.post(API_ROUTES.AUTH.LOGOUT(role));

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Logoutfailed"
      );
    }
  }
);


export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async ( __, {rejectWithValue }) => {
    try {

      const response = await api.get(API_ROUTES.AUTH.GETME);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "checkauth failed"
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
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.role = action.payload.role; 
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
      state.loading = false;
      state.user = null 
      state.accessToken = null
      state.role = null
      state.isAuthenticated = false     
    })
    .addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }) 
    .addCase(checkAuth.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(checkAuth.fulfilled, (state, action) => {
      state.loading = false;
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.role = action.payload.role; 
      state.isAuthenticated = true;
    })
    .addCase(checkAuth.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    }) 
  },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;