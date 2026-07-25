import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";

const initialState = {
  loading: false,
  error: null,

  statistics: {
    totalUsers: 0,
    totalVendors: 0,
    totalVenues: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingVendorApprovals: 0,
    pendingVenueApprovals: 0,

    bookingOverview: [],
    revenueOverview: [],
  },
};

// ==========================
// GET DASHBOARD STATISTICS
// ==========================

export const getDashboardStatistics = createAsyncThunk(
  "adminDashboard/getDashboardStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.ADMIN.DASHBOARD.STATISTICS
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch dashboard statistics."
      );
    }
  }
);

const adminDashboardSlice = createSlice({
  name: "adminDashboard",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ==========================
      // DASHBOARD STATS
      // ==========================

      .addCase(getDashboardStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getDashboardStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })

      .addCase(getDashboardStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminDashboardSlice.reducer;