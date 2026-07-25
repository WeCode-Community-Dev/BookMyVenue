import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";

const initialState = {
  bookings: [],
  booking: null,
  loading: false,
  error: null,

  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    limit: 5,
  },
};

// =========================
// Get All Bookings
// =========================

export const getBookings = createAsyncThunk(
  "userBooking/getBookings",
  async ({ page = 1, limit = 5, status, }, { rejectWithValue }) => {
    console.log(page, limit, status);
    try {
      const response = await api.get(API_ROUTES.USER.BOOKING.GET_ALL, {
        params: {
          page,
          limit,
          status,
        },
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

// =========================
// Get Booking By Id
// =========================

export const getBookingById = createAsyncThunk(
  "userBooking/getBookingById",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.USER.BOOKING.GET_BY_ID(bookingId)
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch booking"
      );
    }
  }
);

const UserBookingSlice = createSlice({
  name: "userBooking",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // =========================
      // Get All Bookings
      // =========================

      .addCase(getBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings;
        state.pagination = action.payload.pagination;
      })

      .addCase(getBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =========================
      // Get Booking Details
      // =========================

      .addCase(getBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload;
      })

      .addCase(getBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default UserBookingSlice.reducer;
