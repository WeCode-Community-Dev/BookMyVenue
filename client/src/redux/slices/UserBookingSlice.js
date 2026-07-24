import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";

const initialState = {
  loading: false,
  availabilityLoading: false,

  success: false,

  availability: [],
  bookings: [],
  currentBooking: null,

  error: null,
};

// ======================================
// CHECK VENUE AVAILABILITY
// ======================================

export const checkVenueAvailability = createAsyncThunk(
  "userBooking/checkVenueAvailability",
  async (
    {
      venueId,
      startDate,
      endDate,
      bookingType,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        API_ROUTES.USER.BOOKING.AVAILABILITY(venueId),
        {
          params: {
            startDate,
            endDate,
            bookingType,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to check venue availability"
      );
    }
  }
);

// ======================================
// CREATE BOOKING
// ======================================

export const createBooking = createAsyncThunk(
  "userBooking/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ROUTES.USER.BOOKING.CREATE,
        bookingData
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create booking"
      );
    }
  }
);

// ======================================
// FETCH USER BOOKINGS
// ======================================

export const fetchUserBookings = createAsyncThunk(
  "userBooking/fetchUserBookings",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.USER.BOOKING.BOOKINGS,
        {
          params,
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
        API_ROUTES.USER.BOOKING.BY_ID(bookingId)
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
// CANCEL BOOKING
// ======================================

export const cancelBooking = createAsyncThunk(
  "userBooking/cancelBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        API_ROUTES.USER.BOOKING.CANCEL(bookingId)
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to cancel booking"
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

    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },

    clearAvailability: (state) => {
      state.availability = [];
    },

    resetBookingState: (state) => {
      state.loading = false;
      state.availabilityLoading = false;
      state.success = false;
      state.availability = [];
      state.currentBooking = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ==================================
    // CHECK AVAILABILITY
    // ==================================

    builder
      .addCase(
        checkVenueAvailability.pending,
        (state) => {
          state.availabilityLoading = true;
          state.error = null;
        }
      )

      .addCase(
        checkVenueAvailability.fulfilled,
        (state, action) => {
          state.availabilityLoading = false;
          state.availability = action.payload;
        }
      )

      .addCase(
        checkVenueAvailability.rejected,
        (state, action) => {
          state.availabilityLoading = false;
          state.error = action.payload;
        }
      );

    // ==================================
    // CREATE BOOKING
    // ==================================

    builder
      .addCase(
        createBooking.pending,
        (state) => {
          state.loading = true;
          state.success = false;
          state.error = null;
        }
      )

      .addCase(
        createBooking.fulfilled,
        (state, action) => {
          state.loading = false;
          state.success = true;
          state.currentBooking = action.payload;

          state.bookings.unshift(
            action.payload
          );
        }
      )

      .addCase(
        createBooking.rejected,
        (state, action) => {
          state.loading = false;
          state.success = false;
          state.error = action.payload;
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

          state.bookings =
            action.payload?.data ||
            action.payload ||
            [];
        }
      )

      .addCase(
        fetchUserBookings.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
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
          state.currentBooking = action.payload;
        }
      )

      .addCase(
        fetchBookingById.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    // ==================================
    // CANCEL BOOKING
    // ==================================

    builder
      .addCase(
        cancelBooking.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        cancelBooking.fulfilled,
        (state, action) => {
          state.loading = false;

          state.currentBooking =
            action.payload;

          const updatedBooking =
            action.payload;

          state.bookings =
            state.bookings.map((booking) =>
              booking._id === updatedBooking._id
                ? updatedBooking
                : booking
            );
        }
      )

      .addCase(
        cancelBooking.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearBookingError,
  clearCurrentBooking,
  clearAvailability,
  resetBookingState,
} = userBookingSlice.actions;

export default userBookingSlice.reducer;