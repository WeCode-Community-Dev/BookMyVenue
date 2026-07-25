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
      const response = await api.get(API_ROUTES.VENDOR.DASHBOARD);
      console.log("DASHBOARD RAW RESPONSE:", response.data);


      const normalized = {
        recentBookings: data.recentBookings || [],
        topVenues: data.topVenues || [],
        totalBookings: data.stats?.totalBookings ?? 0,
        totalVenues: data.stats?.totalVenues ?? 0,
        pendingApprovals: data.stats?.pendingBookings ?? 0,
        confirmedBookings: data.stats?.confirmedBookings ?? 0,
        completedBookings: data.stats?.completedBookings ?? 0,
        totalRevenue: data.stats?.totalRevenue ?? 0,
        bookingTrend: data.stats?.bookingTrend || [],
        monthlyRevenue: data.stats?.monthlyRevenue || [],
      };

      return normalized;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard"
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
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default VendorDashboardSlice.reducer;
