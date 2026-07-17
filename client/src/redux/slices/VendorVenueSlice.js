import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchVendorProfileService,
  createVenueService,
  getVendorVenuesService,
  getVenueByIdService,
  updateVenueService,
  deleteVenueService,
  updateVenueStatusService,
} from "@/services/vendor/venueService";

const initialState = {
  ownerId: "",
  loading: false,
  success: false,
  venue: null,
  venues: [],
  totalPages: 1,
  totalCount: 0,
  error: null,
};

export const fetchVendorProfile = createAsyncThunk(
  "vendorVenue/fetchVendorProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchVendorProfileService();

      return response.data.id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load vendor profile"
      );
    }
  }
);

export const createVenue = createAsyncThunk(
  "vendorVenue/createVenue",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await createVenueService(formData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create venue"
      );
    }
  }
);

export const fetchVenues = createAsyncThunk(
  "vendorVenue/fetchVenues",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getVendorVenuesService(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch venues"
      );
    }
  }
);

export const getVenueById = createAsyncThunk(
  "vendorVenue/getVenueById",
  async (venueId, { rejectWithValue }) => {
    try {
      const response = await getVenueByIdService(venueId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch venue"
      );
    }
  }
);

export const updateVenue = createAsyncThunk(
  "vendorVenue/updateVenue",
  async ({ venueId, formData }, { rejectWithValue }) => {
    try {
      const response = await updateVenueService({
        venueId,
        formData,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update venue"
      );
    }
  }
);

export const deleteVenue = createAsyncThunk(
  "vendorVenue/deleteVenue",
  async (venueId, { rejectWithValue }) => {
    try {
      await deleteVenueService(venueId);

      return venueId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete venue"
      );
    }
  }
);

export const updateVenueStatus = createAsyncThunk(
  "vendorVenue/updateVenueStatus",
  async ({ venueId, status }, { rejectWithValue }) => {
    try {
      const response = await updateVenueStatusService({
        venueId,
        status,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update venue status"
      );
    }
  }
);

const VendorVenueSlice = createSlice({
  name: "vendorVenue",

  initialState,

  reducers: {
    clearVenueState(state) {
      state.loading = false;
      state.success = false;
      state.error=null;
      state.venue=null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch Vendor Profile

      .addCase(fetchVendorProfile.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchVendorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerId = action.payload;
      })

      .addCase(fetchVendorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Venue

      .addCase(createVenue.pending, (state) => {
        state.loading = true;

      })

      .addCase(createVenue.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.venue = action.payload.data;
      })

      .addCase(createVenue.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Fetch Venues
      .addCase(fetchVenues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVenues.fulfilled, (state, action) => {
        state.loading = false;
        state.venues = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchVenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Venue By Id
      .addCase(getVenueById.pending, (state) => {
        state.loading = true;
        state.error=null;
      })
      .addCase(getVenueById.fulfilled, (state, action) => {
        state.loading = false;
        state.venue = action.payload;
      })
      .addCase(getVenueById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Venue
      .addCase(updateVenue.pending, (state) => {
        state.loading = true;
        state.error=null;
      })
      .addCase(updateVenue.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.venue = action.payload;
      })
      .addCase(updateVenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Venue
      .addCase(deleteVenue.pending, (state) => {
        state.loading = true;
        state.error=null;
      })
      .addCase(deleteVenue.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.venues = state.venues.filter(
          (venue) => venue.id !== action.payload
        );
      })
      .addCase(deleteVenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Venue Status
      .addCase(updateVenueStatus.pending, (state) => {
        state.loading = true;
        state.error=null;
      })
      .addCase(updateVenueStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const updatedVenue = action.payload;

        state.venues = state.venues.map((venue) =>
          venue.id === updatedVenue.id ? updatedVenue : venue
        );
      })
      .addCase(updateVenueStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });      

  },
});

export const { clearVenueState } = VendorVenueSlice.actions;

export default VendorVenueSlice.reducer;