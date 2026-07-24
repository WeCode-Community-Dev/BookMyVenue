import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { paymentService } from "./services/paymentService";

export const initiatePaymentAsync = createAsyncThunk(
  "payments/initiate",
  async ({ bookingId, paymentOption }, { rejectWithValue }) => {
    try {
      return await paymentService.initiate(bookingId, paymentOption);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const confirmPaymentAsync = createAsyncThunk(
  "payments/confirm",
  async (payload, { rejectWithValue }) => {
    try {
      return await paymentService.confirm(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const paymentSlice = createSlice({
  name: "payments",
  initialState: {
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetPayment: (state) => {
      state.current = null;
      state.loading = false;
      state.error = null;
    },
    clearPaymentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiatePaymentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiatePaymentAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(initiatePaymentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(confirmPaymentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmPaymentAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(confirmPaymentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPayment, clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;
