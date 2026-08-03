import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";

const initialState = {
  bookings: [],
  booking: null,
  loading: false,
  error: null,
  currentBooking: null,

  reservation: null,
  availabilityData: {},
  totalPages: 1,

  totalCount: 0,

  currentPage: 1,

  success: false,

  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    limit: 5,
  },

  
};

// ======================================
//  AVAILABILITY
// ======================================
export const fetchAvailability = createAsyncThunk(
  "booking/fetchAvailability",
  async ({ venueId, month, year }, { rejectWithValue }) => {
    try {


      const response = await api.get(
        API_ROUTES.USER.BOOKINGS.AVAILABILITY(venueId),
        {
          params: {
            month,
            year,
          },
        }
      );
console.log("API Response:", response.data);

      return response.data.data;
    } catch (err) {
      console.log(err.response);

      return rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);
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


// =========================
// Get All Bookings
// =========================

export const getBookings = createAsyncThunk(
  "userBooking/getBookings",
  async ({ page = 1, limit = 5, status, }, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ROUTES.USER.BOOKINGS.GET_ALL, {
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
        API_ROUTES.USER.BOOKINGS.GET_BY_ID(bookingId)
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch booking"
      );
    }
  }
);

// =========================
// Cancel Booking
// =========================
export const cancelBooking = createAsyncThunk(
  "userBooking/cancelBooking",
  async ({ bookingId, cancellationReason }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        API_ROUTES.USER.BOOKINGS.CANCEL(bookingId),
        {
          cancellationReason,
        }
        );
  
        return response.data.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to cancel booking"
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
    builder

    //=========================
    //AVAILABILITY
    //=========================
.addCase(fetchAvailability.pending, (state) => {
    state.loading = true;
})

.addCase(fetchAvailability.fulfilled, (state, action) => {
    state.loading = false;
    state.availabilityData = action.payload;
})

.addCase(fetchAvailability.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
})      

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
      })

        // ==================================
    // RESERVE BOOKING
    // ==================================

   
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
    )

    // ==================================
    // CONFIRM BOOKING
    // ==================================

    
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
      )

      // =========================
      // Cancel Booking
      // =========================

      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
      })

      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
      
        state.bookings = state.bookings.map((booking) =>
          booking.id === action.payload.id
            ? { ...booking, status: action.payload.status }
            : booking
        );
      })

      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

// ==================================
    // FETCH USER BOOKINGS
    // ==================================

   
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
      )

    // ==================================
    // FETCH BOOKING BY ID
    // ==================================

    
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


export default userBookingSlice.reducer;
