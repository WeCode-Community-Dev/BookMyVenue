import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";

const initialState = {
  loading: false,
  error: null,

  bookings: [],
  selectedBooking: null,

  statistics: {
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    completedBookings: 0,
  },

  pagination: {
    totalPages: 0,
    totalCount: 0,
  },
};

// ==============================
// GET ALL BOOKINGS
// ==============================

export const getBookings = createAsyncThunk(
  "adminBooking/getBookings",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ROUTES.ADMIN.BOOKING.BOOKINGS, {
        params: {
          search: params.search || "",
          status: params.status || undefined,
          paymentStatus: params.paymentStatus || undefined,
          page: params.page || 1,
          limit: params.limit || 10,
          sortBy: params.sortBy || "desc",
        },
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings."
      );
    }
  }
);

// ==============================
// GET BOOKING DETAILS
// ==============================

export const getBookingById = createAsyncThunk(
  "adminBooking/getBookingById",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.ADMIN.BOOKING.GET_BY_ID(bookingId)
      );
      console.log(response.data);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch booking."
      );
    }
  }
);

// ==============================
// GET BOOKING STATISTICS
// ==============================

export const getBookingStats = createAsyncThunk(
  "adminBooking/getBookingStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.ADMIN.BOOKING.STATISTICS
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch booking statistics."
      );
    }
  }
);

const adminBookingSlice = createSlice({
  name: "adminBooking",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ==============================
      // GET BOOKINGS
      // ==============================

      .addCase(getBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getBookings.fulfilled, (state, action) => {
        state.loading = false;

        state.bookings = action.payload.data;

        state.pagination.totalPages =
          action.payload.totalPages;

        state.pagination.totalCount =
          action.payload.totalCount;
      })

      .addCase(getBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==============================
      // GET BOOKING DETAILS
      // ==============================

      .addCase(getBookingById.pending, (state) => {
        state.loading = true;
      })

      .addCase(getBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBooking = action.payload;
        console.log(action.payload);
      })

      .addCase(getBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==============================
      // GET STATISTICS
      // ==============================

      .addCase(getBookingStats.pending, (state) => {
        state.loading = true;
      })

      .addCase(getBookingStats.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })

      .addCase(getBookingStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminBookingSlice.reducer;