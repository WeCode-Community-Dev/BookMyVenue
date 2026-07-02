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

export const registerVenueOwnerAsync = createAsyncThunk(
  "auth/registerVenueOwner",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const result = await authService.registerVenueOwner(payload);
      // After registering (new user gets a token, existing user gets updated profile),
      // refresh /auth/me so is_venue_owner is up to date for redirect logic.
      await dispatch(fetchCurrentUserAsync());
      return result;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const loginUserAsync = createAsyncThunk(
  "auth/login",
  async (fields, { rejectWithValue, dispatch }) => {
    try {
      const data = await authService.login(fields);
      await dispatch(fetchCurrentUserAsync());
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const googleAuthAsync = createAsyncThunk(
  "auth/google",
  async (idToken, { rejectWithValue, dispatch }) => {
    try {
      const data = await authService.googleLogin(idToken);
      await dispatch(fetchCurrentUserAsync());
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// Fetches the current logged-in user's profile (includes is_venue_owner).
// Dispatched right after any successful login/registration that results in a token.

export const fetchCurrentUserAsync = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getMe();
      return user;
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
      .addCase(registerVenueOwnerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerVenueOwnerAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
        state.isAuthenticated = true;
      })
      .addCase(registerVenueOwnerAsync.rejected, (state, action) => {
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

      .addCase(fetchCurrentUserAsync.fulfilled, (state, action) => {
        state.user = action.payload; // includes is_venue_owner
      })
      .addCase(fetchCurrentUserAsync.rejected, (state) => {
        // If /auth/me fails (e.g. expired token), don't crash — just leave user as-is.
        // RequireAuth/RequireVenueOwner guards will handle redirecting if needed.
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
