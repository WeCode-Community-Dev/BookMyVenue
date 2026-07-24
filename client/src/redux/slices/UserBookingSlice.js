import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";

// ======================================
// INITIAL STATE
// ======================================

const initialState = {
  loading: false,

  bookings: [],

  currentBooking: null,

  reservation: null,

  error: null,

  success: false,
};

// ======================================
// RESERVE BOOKING
// ======================================

export const reserveBooking = createAsyncThunk(
  "userBooking/reserveBooking",

  async (
    bookingData,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        API_ROUTES.USER.BOOKINGS.RESERVE,
        bookingData
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to reserve booking"
      );
    }
  }
);

// ======================================
// CONFIRM BOOKING
// ======================================

export const confirmBooking = createAsyncThunk(
  "userBooking/confirmBooking",

  async (
    {
      reservationId,
      venueId,
      bookingDate,
      paymentId,
      paymentStatus,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        API_ROUTES.USER.BOOKINGS.CONFIRM,
        {
          reservationId,
          venueId,
          bookingDate,
          paymentId,
          paymentStatus,
        }
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to confirm booking"
      );
    }
  }
);

// ======================================
// FETCH USER BOOKINGS
// ======================================

export const fetchUserBookings = createAsyncThunk(
  "userBooking/fetchUserBookings",

  async (
    params = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        API_ROUTES.USER.BOOKINGS.GET_ALL,
        {
          params: {
            page: params.page || 1,
            limit: params.limit || 10,
            status:
              params.status || undefined,
            search:
              params.search || undefined,
            sortBy:
              params.sortBy || undefined,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch bookings"
      );
    }
  }
);

// ======================================
// FETCH BOOKING BY ID
// ======================================

export const fetchBookingById = createAsyncThunk(
  "userBooking/fetchBookingById",

  async (
    bookingId,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        API_ROUTES.USER.BOOKINGS.GET_BY_ID(
          bookingId
        )
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch booking details"
      );
    }
  }
);

// ======================================
// SLICE
// ======================================

const userBookingSlice = createSlice({
  name: "userBooking",

  initialState,

  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },

    clearReservation: (state) => {
      state.reservation = null;
    },

    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },

    resetBookingState: (state) => {
      state.loading = false;

      state.bookings = [];

      state.currentBooking = null;

      state.reservation = null;

      state.error = null;

      state.success = false;
    },
  },

  extraReducers: (builder) => {

    // ==================================
    // RESERVE BOOKING
    // ==================================

    builder
      .addCase(
        reserveBooking.pending,
        (state) => {
          state.loading = true;

          state.error = null;

          state.success = false;
        }
      )

      .addCase(
        reserveBooking.fulfilled,
        (state, action) => {
          state.loading = false;

          state.reservation =
            action.payload;

          state.success = true;
        }
      )

      .addCase(
        reserveBooking.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload;

          state.success = false;
        }
      );

    // ==================================
    // CONFIRM BOOKING
    // ==================================

    builder
      .addCase(
        confirmBooking.pending,
        (state) => {
          state.loading = true;

          state.error = null;

          state.success = false;
        }
      )

      .addCase(
        confirmBooking.fulfilled,
        (state, action) => {
          state.loading = false;

          state.currentBooking =
            action.payload;

          state.bookings.unshift(
            action.payload
          );

          state.reservation = null;

          state.success = true;
        }
      )

      .addCase(
        confirmBooking.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload;

          state.success = false;
        }
      );

    // ==================================
    // FETCH USER BOOKINGS
    // ==================================

    builder
      .addCase(
        fetchUserBookings.pending,
        (state) => {
          state.loading = true;

          state.error = null;
        }
      )

      .addCase(
        fetchUserBookings.fulfilled,
        (state, action) => {
          state.loading = false;

          const payload =
            action.payload;

          state.bookings =
            payload?.bookings ||
            payload?.data ||
            payload ||
            [];
        }
      )

      .addCase(
        fetchUserBookings.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload;
        }
      );

    // ==================================
    // FETCH BOOKING BY ID
    // ==================================

    builder
      .addCase(
        fetchBookingById.pending,
        (state) => {
          state.loading = true;

          state.error = null;
        }
      )

      .addCase(
        fetchBookingById.fulfilled,
        (state, action) => {
          state.loading = false;

          state.currentBooking =
            action.payload;
        }
      )

      .addCase(
        fetchBookingById.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload;
        }
      );
  },
});

// ======================================
// ACTIONS
// ======================================

export const {
  clearBookingError,
  clearReservation,
  clearCurrentBooking,
  resetBookingState,
} = userBookingSlice.actions;

// ======================================
// REDUCER
// ======================================

export default userBookingSlice.reducer;