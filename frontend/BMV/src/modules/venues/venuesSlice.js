import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { venueService } from "./services/venueService";

// ─── Thunks ────────────────────────────────────────────────────────────────

export const fetchPublicVenuesAsync = createAsyncThunk(
  "venues/fetchPublic",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await venueService.fetchPublicVenues(params);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchVenueByIdAsync = createAsyncThunk(
  "venues/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await venueService.fetchVenueById(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────

const venuesSlice = createSlice({
  name: "venues",
  initialState: {
    // List (VenuesPage + LandingPage featured)
    list: [],
    isLoadingList: false,
    listError: null,

    // Single venue (VenueDetailPage)
    selected: null,
    isLoadingSelected: false,
    selectedError: null,
  },
  reducers: {
    clearSelectedVenue(state) {
      state.selected = null;
      state.selectedError = null;
    },
  },
  extraReducers: (builder) => {
    // fetchPublicVenuesAsync
    builder
      .addCase(fetchPublicVenuesAsync.pending, (state) => {
        state.isLoadingList = true;
        state.listError = null;
      })
      .addCase(fetchPublicVenuesAsync.fulfilled, (state, action) => {
        state.isLoadingList = false;
        state.list = action.payload;
      })
      .addCase(fetchPublicVenuesAsync.rejected, (state, action) => {
        state.isLoadingList = false;
        state.listError = action.payload;
      });

    // fetchVenueByIdAsync
    builder
      .addCase(fetchVenueByIdAsync.pending, (state) => {
        state.isLoadingSelected = true;
        state.selectedError = null;
        state.selected = null;
      })
      .addCase(fetchVenueByIdAsync.fulfilled, (state, action) => {
        state.isLoadingSelected = false;
        state.selected = action.payload;
      })
      .addCase(fetchVenueByIdAsync.rejected, (state, action) => {
        state.isLoadingSelected = false;
        state.selectedError = action.payload;
      });
  },
});

export const { clearSelectedVenue } = venuesSlice.actions;
export default venuesSlice.reducer;