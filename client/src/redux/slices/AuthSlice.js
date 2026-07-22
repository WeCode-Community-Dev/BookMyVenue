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
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;