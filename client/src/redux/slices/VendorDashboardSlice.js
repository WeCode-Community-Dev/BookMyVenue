import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDashboardStatsService } from "@/services/vendor/dashboardService";

const initialState = {
  loading: false,
  dashboard: null,
  error: null,
};

export const fetchDashboard = createAsyncThunk(
  "vendorDashboard/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDashboardStatsService();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

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