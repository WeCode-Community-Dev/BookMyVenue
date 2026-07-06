import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bookingService } from "./services/bookingService";

export const createBookingAsync = createAsyncThunk(
  "bookings/create",
  async (data, { rejectWithValue }) => {
    try {
      return await bookingService.create(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchMyBookingsAsync = createAsyncThunk(
  "bookings/my",
  async (filters = {}, { rejectWithValue }) => {
    try {
      return await bookingService.myBookings(filters);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchBookingDetailAsync = createAsyncThunk(
  "bookings/detail",
  async (id, { rejectWithValue }) => {
    try {
      return await bookingService.detail(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const cancelBookingAsync = createAsyncThunk(
  "bookings/cancel",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      return await bookingService.cancel(id, reason);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    list: [],
    pagination: null,
    current: null,
    created: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBookingAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.created = action.payload;
      })
      .addCase(createBookingAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMyBookingsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookingsAsync.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.list = payload?.data || [];
        state.pagination = payload?.pagination || null;
      })
      .addCase(fetchMyBookingsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchBookingDetailAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingDetailAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchBookingDetailAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(cancelBookingAsync.fulfilled, (state, action) => {
        if (state.current) {
          state.current.status = action.payload.status;
          state.current.cancellation_reason =
            action.payload.cancellation_reason;
          state.current.cancelled_at = action.payload.cancelled_at;
        }
      })
      .addCase(cancelBookingAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCurrent, clearError } = bookingSlice.actions;
export default bookingSlice.reducer;
