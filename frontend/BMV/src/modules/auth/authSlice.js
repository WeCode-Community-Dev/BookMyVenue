import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "./services/authService";
import { clearTokens, isAuthenticated } from "../../core/auth/tokenStorage";

export const registerUserAsync = createAsyncThunk(
  "auth/register",
  async (fields, { rejectWithValue }) => {
    try {
      const user = await authService.register(fields);
      return user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const loginUserAsync = createAsyncThunk(
  "auth/login",
  async (fields, { rejectWithValue }) => {
    try {
      const data = await authService.login(fields);
      const user = await authService.getMe();
      return { ...data, user };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const adminLoginAsync = createAsyncThunk(
  "auth/adminLogin",
  async (fields, { rejectWithValue }) => {
    try {
      await authService.login(fields);
      const user = await authService.getMe();
      if (user.role !== "admin") {
        clearTokens();
        return rejectWithValue("Only admin users can access this panel");
      }
      return user;
    } catch (err) {
      clearTokens();
      return rejectWithValue(err.message);
    }
  },
);

export const fetchMeAsync = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getMe();
      return user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const googleAuthAsync = createAsyncThunk(
  "auth/google",
  async (idToken, { rejectWithValue }) => {
    try {
      const data = await authService.googleLogin(idToken);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const logoutUserAsync = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: isAuthenticated(),
    isLoading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetAuthStatus: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(loginUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      
      .addCase(googleAuthAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleAuthAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = true;
      })
      .addCase(googleAuthAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(adminLoginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminLoginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(adminLoginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })

      .addCase(fetchMeAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchMeAsync.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { resetAuthStatus } = authSlice.actions;
export default authSlice.reducer;
