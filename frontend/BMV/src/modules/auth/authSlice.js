import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "./services/authService";
import { isAuthenticated } from "../../core/auth/tokenStorage";

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
      return data;
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
      .addCase(loginUserAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = true;
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
      });
  },
});

export const { resetAuthStatus } = authSlice.actions;
export default authSlice.reducer;
