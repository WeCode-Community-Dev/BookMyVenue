import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";

// ==============================
// INITIAL STATE
// ==============================

const initialState = {
  loading: false,
  dashboard: null,
  error: null,
};

// ==============================
// GET VENDOR DASHBOARD
// ==============================

export const fetchDashboard = createAsyncThunk(
  "vendorDashboard/fetchDashboard",

  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.VENDOR.DASHBOARD
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch dashboard"
      );
    }
  }
);

// ==============================
// SLICE
// ==============================

const VendorDashboardSlice = createSlice({
  name: "vendorDashboard",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ==========================
      // GET DASHBOARD
      // ==========================

      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;

        state.dashboard =
          action.payload;
      })

      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default VendorDashboardSlice.reducer;

