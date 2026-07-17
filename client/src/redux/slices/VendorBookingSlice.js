import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getVendorBookingsService,
    getBookingByIdService

 } from "@/services/vendor/bookingService";

const initialState = {
  loading: false,
  bookings: [],
  pagination: null,
  bookingDetails:null,
  detailsLoading:false,
  error: null,
};

export const fetchBookings = createAsyncThunk(
  "vendorBooking/fetchBookings",
  async (params = { page: 1, limit: 20 }, { rejectWithValue }) => {
    try {
        const response = await getVendorBookingsService(params);
        return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  "vendorBooking/fetchBookingById",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await getBookingByIdService(bookingId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch booking"
      );
    }
  }
);

const VendorBookingSlice = createSlice({
  name: "vendorBooking",

  initialState,

reducers: {
  clearBookingDetails: (state) => {
    state.bookingDetails = null;
  },
},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;

        state.bookings = action.payload.bookings || [];
        state.pagination = action.payload.pagination || null;
      })

      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBookingById.pending, (state) => {
  state.detailsLoading = true;
})

.addCase(fetchBookingById.fulfilled, (state, action) => {
  state.detailsLoading = false;
  state.bookingDetails = action.payload;
})

.addCase(fetchBookingById.rejected, (state, action) => {
  state.detailsLoading = false;
  state.error = action.payload;
});

  },
});
export const { clearBookingDetails } = VendorBookingSlice.actions;


export default VendorBookingSlice.reducer;