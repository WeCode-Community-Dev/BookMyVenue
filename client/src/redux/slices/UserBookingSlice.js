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

  totalPages: 1,

  totalCount: 0,

  currentPage: 1,

  error: null,

  success: false,
};

// ======================================
// RESERVE BOOKING
// ======================================

export const reserveBooking = createAsyncThunk(
  "userBooking/reserveBooking",

  async (bookingData, { rejectWithValue }) => {
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
      paymentOption,
      paymentMethod,
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
          paymentOption,
          paymentMethod,
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
    {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy,
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        API_ROUTES.USER.BOOKINGS.GET_ALL,
        {
          params: {
            page,
            limit,
            status: status || undefined,
            search: search || undefined,
            sortBy: sortBy || undefined,
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

  async (bookingId, { rejectWithValue }) => {
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
    // ==============================
    // CLEAR BOOKING ERROR
    // ==============================

    clearBookingError: (state) => {
      state.error = null;
    },

    // ==============================
    // CLEAR RESERVATION
    // ==============================

    clearReservation: (state) => {
      state.reservation = null;
    },

    // ==============================
    // CLEAR CURRENT BOOKING
    // ==============================

    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },

    // ==============================
    // RESET BOOKING STATE
    // ==============================

    resetBookingState: (state) => {
      state.loading = false;

      state.bookings = [];

      state.currentBooking = null;

      state.reservation = null;

      state.totalPages = 1;

      state.totalCount = 0;

      state.currentPage = 1;

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

          state.success = false;
        }
      )

      .addCase(
        fetchUserBookings.fulfilled,
        (state, action) => {
          state.loading = false;

          const payload =
            action.payload;

          /*
           * Expected backend response:
           *
           * {
           *   bookings: [],
           *   totalPages: 1,
           *   totalCount: 10,
           *   currentPage: 1
           * }
           */

          state.bookings =
            payload?.bookings || [];

          state.totalPages =
            payload?.totalPages || 1;

          state.totalCount =
            payload?.totalCount || 0;

          state.currentPage =
            payload?.currentPage || 1;
        }
      )

      .addCase(
        fetchUserBookings.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload;

          state.success = false;
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

          state.success = false;
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