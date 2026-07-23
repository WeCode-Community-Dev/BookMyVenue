import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";

const initialState = {
  vendorId: "",

  loading: false,

  venue: null,
  venues: [],

  totalPages: 1,
  totalCount: 0,

  error: null,
};

// ==============================
// FETCH VENDOR PROFILE
// ==============================

export const fetchVendorProfile = createAsyncThunk(
  "vendorVenue/fetchVendorProfile",

  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.VENDOR.PROFILE
      );

      return response.data.data.id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to load vendor profile"
      );
    }
  }
);

// ==============================
// CREATE VENUE
// ==============================

export const createVenue = createAsyncThunk(
  "vendorVenue/createVenue",

  async (formData, { rejectWithValue }) => {
    try {
      console.log("from slice,", formData)
      const response = await api.post(
        API_ROUTES.VENDOR.CREATE_VENUE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create venue"
      );
    }
  }
);

// ==============================
// FETCH ALL VENDOR VENUES
// ==============================

export const fetchVenues = createAsyncThunk(
  "vendorVenue/fetchVenues",

  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.VENDOR.VENUES,
        {
          params,
        }
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch venues"
      );
    }
  }
);

// ==============================
// GET VENUE BY ID
// ==============================

export const getVenueById = createAsyncThunk(
  "vendorVenue/getVenueById",

  async (venueId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.VENDOR.VENUE_BY_ID(venueId)
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch venue"
      );
    }
  }
);

// ==============================
// UPDATE VENUE
// ==============================

export const updateVenue = createAsyncThunk(
  "vendorVenue/updateVenue",

  async (
    { venueId, formData },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(
        API_ROUTES.VENDOR.VENUE_BY_ID(venueId),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update venue"
      );
    }
  }
);

// ==============================
// DELETE VENUE
// ==============================

export const deleteVenue = createAsyncThunk(
  "vendorVenue/deleteVenue",

  async (venueId, { rejectWithValue }) => {
    try {
      await api.delete(
        API_ROUTES.VENDOR.VENUE_BY_ID(venueId)
      );

      return venueId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete venue"
      );
    }
  }
);

// ==============================
// UPDATE VENUE STATUS
// ==============================

export const updateVenueStatus = createAsyncThunk(
  "vendorVenue/updateVenueStatus",

  async (
    { venueId, status },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(
        `${API_ROUTES.VENDOR.VENUE_BY_ID(venueId)}/status`,
        { status }
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update venue status"
      );
    }
  }
);

// ==============================
// SLICE
// ==============================

const VendorVenueSlice = createSlice({
  name: "vendorVenue",

  initialState,

  reducers: {
    clearVenueState: (state) => {
      state.loading = false;
      state.error = null;
      state.venue = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==========================
      // FETCH VENDOR PROFILE
      // ==========================

      .addCase(fetchVendorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchVendorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorId = action.payload;
      })

      .addCase(fetchVendorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================
      // CREATE VENUE
      // ==========================

      .addCase(createVenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createVenue.fulfilled, (state, action) => {
        state.loading = false;
        state.venue = action.payload;
      })

      .addCase(createVenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================
      // FETCH VENUES
      // ==========================

      .addCase(fetchVenues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchVenues.fulfilled, (state, action) => {
        state.loading = false;

        state.venues =
          action.payload.data || [];

        state.totalPages =
          action.payload.totalPages || 1;

        state.totalCount =
          action.payload.totalCount || 0;
      })

      .addCase(fetchVenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================
      // GET VENUE BY ID
      // ==========================

      .addCase(getVenueById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getVenueById.fulfilled, (state, action) => {
        state.loading = false;
        state.venue = action.payload;
      })

      .addCase(getVenueById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================
      // UPDATE VENUE
      // ==========================

      .addCase(updateVenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateVenue.fulfilled, (state, action) => {
        state.loading = false;
        state.venue = action.payload;
      })

      .addCase(updateVenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================
      // DELETE VENUE
      // ==========================

      .addCase(deleteVenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteVenue.fulfilled, (state, action) => {
        state.loading = false;

        state.venues = state.venues.filter(
          (venue) => venue.id !== action.payload
        );
      })

      .addCase(deleteVenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================
      // UPDATE VENUE STATUS
      // ==========================

      .addCase(updateVenueStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateVenueStatus.fulfilled, (state, action) => {
        state.loading = false;

        const updatedVenue = action.payload;

        state.venues = state.venues.map((venue) =>
          venue.id === updatedVenue.id
            ? updatedVenue
            : venue
        );
      })

      .addCase(updateVenueStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearVenueState,
} = VendorVenueSlice.actions;

export default VendorVenueSlice.reducer;
