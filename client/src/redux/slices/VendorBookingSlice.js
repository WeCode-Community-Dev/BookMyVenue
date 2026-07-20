import { API_ROUTES } from "@/constants/apiRoutes";
import api from "@/lib/axios";
import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

const initialState = {
  loading: false,

  bookings: [],

  totalPages: 0,
  totalCount: 0,

  bookingDetails: null,
  detailsLoading: false,

  error: null,
};

// ==============================
// GET ALL VENDOR BOOKINGS
// ==============================

export const fetchBookings = createAsyncThunk(
  "vendorBooking/fetchBookings",

  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.VENDOR.BOOKINGS,
        {
          params: {
            page: params.page || 1,
            limit: params.limit || 20,
            search: params.search || "",
            status: params.status || undefined,
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

// ==============================
// GET BOOKING BY ID
// ==============================

export const fetchBookingById = createAsyncThunk(
  "vendorBooking/fetchBookingById",

  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.VENDOR.BOOKING_BY_ID(bookingId)
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch booking"
      );
    }
  }
);

// ==============================
// SLICE
// ==============================

const VendorBookingSlice = createSlice({
  name: "vendorBooking",

  initialState,

  reducers: {
    clearBookingDetails: (state) => {
      state.bookingDetails = null;
      state.detailsLoading = false;
    },

    clearBookingError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==========================
      // GET ALL BOOKINGS
      // ==========================

      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;

        state.bookings =
          action.payload.bookings || [];

        state.totalCount =
          action.payload.totalCount || 0;

        state.totalPages =
          action.payload.totalPages || 0;
      })

      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================
      // GET BOOKING BY ID
      // ==========================

      .addCase(fetchBookingById.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
        state.bookingDetails = null;
      })

      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.detailsLoading = false;

        state.bookingDetails =
          action.payload;
      })

      .addCase(fetchBookingById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearBookingDetails,
  clearBookingError,
} = VendorBookingSlice.actions;

export default VendorBookingSlice.reducer;