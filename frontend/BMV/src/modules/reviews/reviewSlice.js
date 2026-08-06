import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchOwnerReviews, submitReply } from "./services/reviewService";


export const fetchOwnerReviewsAsync = createAsyncThunk(
  "reviews/fetchOwnerReviews",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchOwnerReviews();
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.detail || "Failed to load reviews."
      );
    }
  }
);

export const submitReplyAsync = createAsyncThunk(
  "reviews/submitReply",
  async ({ reviewId, replyText }, { rejectWithValue }) => {
    try {
      return await submitReply(reviewId, replyText);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.detail || "Failed to save reply."
      );
    }
  }
);


const initialState = {
  reviews: [],
  ratingDistribution: {},
  totalReviews: 0,
  averageRating: 0,
  reviewOfMonth: null,

  isLoading: false,
  error: null,

  replyLoading: false,
  replyError: null,
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    clearReplyError(state) {
      state.replyError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnerReviewsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOwnerReviewsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.reviews;
        state.ratingDistribution = action.payload.rating_distribution;
        state.totalReviews = action.payload.total_reviews;
        state.averageRating = action.payload.average_rating;
        state.reviewOfMonth = action.payload.review_of_month;
      })
      .addCase(fetchOwnerReviewsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });


    builder
      .addCase(submitReplyAsync.pending, (state) => {
        state.replyLoading = true;
        state.replyError = null;
      })
      .addCase(submitReplyAsync.fulfilled, (state, action) => {
        state.replyLoading = false;
        const updated = action.payload;
        const idx = state.reviews.findIndex((r) => r.id === updated.id);
        if (idx !== -1) {
          state.reviews[idx] = updated;
        }
        if (state.reviewOfMonth?.id === updated.id) {
          state.reviewOfMonth = updated;
        }
      })
      .addCase(submitReplyAsync.rejected, (state, action) => {
        state.replyLoading = false;
        state.replyError = action.payload;
      });
  },
});

export const { clearReplyError } = reviewSlice.actions;
export default reviewSlice.reducer;