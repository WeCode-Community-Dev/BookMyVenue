import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";

const initialState = {
  wishlist: [],
  loading: false,
  error: null,
};

// Get Wishlist
export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ROUTES.USER.WISHLIST.GET);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);

// Add Wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (venueId, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ROUTES.USER.WISHLIST.ADD(venueId)
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add wishlist"
      );
    }
  }
);

// Remove Wishlist
export const removeWishlist = createAsyncThunk(
  "wishlist/removeWishlist",
  async (venueId, { rejectWithValue }) => {
    try {
      await api.delete(
        API_ROUTES.USER.WISHLIST.REMOVE(venueId)
      );

      return venueId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove wishlist"
      );
    }
  }
);

const UserWishlistSlice = createSlice({
  name: "userWishlist",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // Get Wishlist
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })

      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Wishlist
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
      })

      // Remove Wishlist
      .addCase(removeWishlist.fulfilled, (state, action) => {
        state.wishlist = state.wishlist.filter(
          (venue) => venue.id !== action.payload
        );
      });
  },
});

export default UserWishlistSlice.reducer;