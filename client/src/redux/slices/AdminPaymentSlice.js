import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";

const initialState = {
  loading: false,
  error: null,

  payments: [],
  selectedPayment: null,

  statistics: {
    totalPayments: 0,
    successfulPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
    refundedPayments: 0,
    totalRevenue: 0,
  },

  pagination: {
    totalPages: 0,
    totalCount: 0,
  },
};

// ==============================
// GET ALL PAYMENTS
// ==============================

export const getPayments = createAsyncThunk(
  "adminPayment/getPayments",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.ADMIN.PAYMENT.PAYMENTS,
        {
          params: {
            search: params.search || "",
            paymentStatus: params.paymentStatus || undefined,
            paymentMethod: params.paymentMethod || undefined,
            paymentType: params.paymentType || undefined,
            sortBy: params.sortBy || "desc",
            page: params.page || 1,
            limit: params.limit || 10,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch payments."
      );
    }
  }
);

// ==============================
// GET PAYMENT DETAILS
// ==============================

export const getPaymentById = createAsyncThunk(
  "adminPayment/getPaymentById",
  async (paymentId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.ADMIN.PAYMENT.GET_BY_ID(paymentId)
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch payment."
      );
    }
  }
);

// ==============================
// GET PAYMENT STATISTICS
// ==============================

export const getPaymentStats = createAsyncThunk(
  "adminPayment/getPaymentStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.ADMIN.PAYMENT.STATISTICS
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch payment statistics."
      );
    }
  }
);

const adminPaymentSlice = createSlice({
  name: "adminPayment",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ==========================
      // GET PAYMENTS
      // ==========================

      .addCase(getPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getPayments.fulfilled, (state, action) => {
        state.loading = false;

        state.payments = action.payload.data;

        state.pagination.totalPages =
          action.payload.totalPages;

        state.pagination.totalCount =
          action.payload.totalCount;
      })

      .addCase(getPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================
      // GET PAYMENT DETAILS
      // ==========================

      .addCase(getPaymentById.pending, (state) => {
        state.loading = true;
      })

      .addCase(getPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPayment = action.payload;
      })

      .addCase(getPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================
      // GET PAYMENT STATS
      // ==========================

      .addCase(getPaymentStats.pending, (state) => {
        state.loading = true;
      })

      .addCase(getPaymentStats.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })

      .addCase(getPaymentStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminPaymentSlice.reducer;