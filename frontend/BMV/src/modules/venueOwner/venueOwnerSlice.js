import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { venueOwnerService } from "./services/venueOwnerService";

export const fetchDashboardSummaryAsync = createAsyncThunk(
  "venueOwner/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      return await venueOwnerService.getSummary();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchBookingRequestsAsync = createAsyncThunk(
  "venueOwner/fetchBookingRequests",
  async (_, { rejectWithValue }) => {
    try {
      return await venueOwnerService.getBookingRequests();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const acceptBookingRequestAsync = createAsyncThunk(
  "venueOwner/acceptBookingRequest",
  async (id, { rejectWithValue }) => {
    try {
      return await venueOwnerService.acceptBookingRequest(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const rejectBookingRequestAsync = createAsyncThunk(
  "venueOwner/rejectBookingRequest",
  async (id, { rejectWithValue }) => {
    try {
      return await venueOwnerService.rejectBookingRequest(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchAvailabilityCalendarAsync = createAsyncThunk(
  "venueOwner/fetchAvailabilityCalendar",
  async (month, { rejectWithValue }) => {
    try {
      return await venueOwnerService.getAvailabilityCalendar(month);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchMyVenuesAsync = createAsyncThunk(
  "venueOwner/fetchMyVenues",
  async (_, { rejectWithValue }) => {
    try {
      return await venueOwnerService.getMyVenues();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchRevenueOverviewAsync = createAsyncThunk(
  "venueOwner/fetchRevenueOverview",
  async (range, { rejectWithValue }) => {
    try {
      return await venueOwnerService.getRevenueOverview(range);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchRecentReviewsAsync = createAsyncThunk(
  "venueOwner/fetchRecentReviews",
  async (_, { rejectWithValue }) => {
    try {
      return await venueOwnerService.getRecentReviews();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchNotificationsAsync = createAsyncThunk(
  "venueOwner/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      return await venueOwnerService.getNotifications();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const createVenueAsync = createAsyncThunk(
  "venueOwner/createVenue",
  async (payload, { rejectWithValue }) => {
    try {
      return await venueOwnerService.createVenue(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
 

export const fetchVenueTypesAsync = createAsyncThunk(
  "venueOwner/fetchVenueTypes",
  async (_, { rejectWithValue }) => {
    try {
      return await venueOwnerService.getVenueTypes();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchAmenitiesAsync = createAsyncThunk(
  "venueOwner/fetchAmenities",
  async (_, { rejectWithValue }) => {
    try {
      return await venueOwnerService.getAmenities();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
 
// NEW — links an amenity to a venue. Thunk arg: { venueId, amenityId }.
// Backend returns the venue's full updated amenity list, so we pair it
// with venueId here to know which venue in state to update.
export const linkVenueAmenityAsync = createAsyncThunk(
  "venueOwner/linkVenueAmenity",
  async ({ venueId, amenityId }, { rejectWithValue }) => {
    try {
      const amenities = await venueOwnerService.linkAmenity(venueId, amenityId);
      return { venueId, amenities };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
 
// NEW — unlinks an amenity from a venue. Thunk arg: { venueId, amenityId }.
export const unlinkVenueAmenityAsync = createAsyncThunk(
  "venueOwner/unlinkVenueAmenity",
  async ({ venueId, amenityId }, { rejectWithValue }) => {
    try {
      const amenities = await venueOwnerService.unlinkAmenity(venueId, amenityId);
      return { venueId, amenities };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);



const initialState = {
  summary: null,
  bookingRequests: [],
  calendar: { month: null, days: {} },
  venues: [],
  venueTypes: [],
  amenities: [],
  revenue: null,
  reviews: [],
  notifications: [],

  loading: {
    summary: false,
    bookingRequests: false,
    calendar: false,
    venues: false,
    creatingVenue: false,
    venueTypes: false,
    amenities: false,
    revenue: false,
    reviews: false,
    notifications: false,
  },
  error: null,
};

const asListPayload = (payload) =>
  Array.isArray(payload) ? payload : payload?.data || payload?.items || [];

const venueOwnerSlice = createSlice({
  name: "venueOwner",
  initialState,
  reducers: {
    clearVenueOwnerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummaryAsync.pending, (state) => {
        state.loading.summary = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummaryAsync.fulfilled, (state, action) => {
        state.loading.summary = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummaryAsync.rejected, (state, action) => {
        state.loading.summary = false;
        state.error = action.payload;
      })

      .addCase(fetchBookingRequestsAsync.pending, (state) => {
        state.loading.bookingRequests = true;
        state.error = null;
      })
      .addCase(fetchBookingRequestsAsync.fulfilled, (state, action) => {
        state.loading.bookingRequests = false;
        state.bookingRequests = asListPayload(action.payload);
      })
      .addCase(fetchBookingRequestsAsync.rejected, (state, action) => {
        state.loading.bookingRequests = false;
        state.error = action.payload;
      })


      .addCase(acceptBookingRequestAsync.fulfilled, (state, action) => {
        state.bookingRequests = state.bookingRequests.filter(
          (b) => b.id !== action.payload.id,
        );
      })
      .addCase(rejectBookingRequestAsync.fulfilled, (state, action) => {
        state.bookingRequests = state.bookingRequests.filter(
          (b) => b.id !== action.payload.id,
        );
      })
      .addCase(acceptBookingRequestAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(rejectBookingRequestAsync.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(fetchAvailabilityCalendarAsync.pending, (state) => {
        state.loading.calendar = true;
        state.error = null;
      })
      .addCase(fetchAvailabilityCalendarAsync.fulfilled, (state, action) => {
        state.loading.calendar = false;
        state.calendar = action.payload;
      })
      .addCase(fetchAvailabilityCalendarAsync.rejected, (state, action) => {
        state.loading.calendar = false;
        state.error = action.payload;
      })

      .addCase(fetchMyVenuesAsync.pending, (state) => {
        state.loading.venues = true;
        state.error = null;
      })
      .addCase(fetchMyVenuesAsync.fulfilled, (state, action) => {
        state.loading.venues = false;
        state.venues = asListPayload(action.payload);
      })
      .addCase(fetchMyVenuesAsync.rejected, (state, action) => {
        state.loading.venues = false;
        state.error = action.payload;
      })

      .addCase(createVenueAsync.pending, (state) => {
        state.loading.creatingVenue = true;
        state.error = null;
      })
      .addCase(createVenueAsync.fulfilled, (state, action) => {
        state.loading.creatingVenue = false;
        state.venues = [action.payload, ...state.venues];
      })
      .addCase(createVenueAsync.rejected, (state, action) => {
        state.loading.creatingVenue = false;
        state.error = action.payload;
      })
 
      .addCase(fetchVenueTypesAsync.pending, (state) => {
        state.loading.venueTypes = true;
        state.error = null;
      })
      .addCase(fetchVenueTypesAsync.fulfilled, (state, action) => {
        state.loading.venueTypes = false;
        state.venueTypes = asListPayload(action.payload);
      })
      .addCase(fetchVenueTypesAsync.rejected, (state, action) => {
        state.loading.venueTypes = false;
        state.error = action.payload;
      })
      .addCase(fetchAmenitiesAsync.pending, (state) => {
        state.loading.amenities = true;
        state.error = null;
      })
      .addCase(fetchAmenitiesAsync.fulfilled, (state, action) => {
        state.loading.amenities = false;
        state.amenities = asListPayload(action.payload);
      })
      .addCase(fetchAmenitiesAsync.rejected, (state, action) => {
        state.loading.amenities = false;
        state.error = action.payload;
      })
      .addCase(linkVenueAmenityAsync.fulfilled, (state, action) => {
        const { venueId, amenities } = action.payload;
        const venue = state.venues.find((v) => v.id === venueId);
        if (venue) venue.amenities = amenities;
      })
      .addCase(linkVenueAmenityAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(unlinkVenueAmenityAsync.fulfilled, (state, action) => {
        const { venueId, amenities } = action.payload;
        const venue = state.venues.find((v) => v.id === venueId);
        if (venue) venue.amenities = amenities;
      })
      .addCase(unlinkVenueAmenityAsync.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(fetchRevenueOverviewAsync.pending, (state) => {
        state.loading.revenue = true;
        state.error = null;
      })
      .addCase(fetchRevenueOverviewAsync.fulfilled, (state, action) => {
        state.loading.revenue = false;
        state.revenue = action.payload;
      })
      .addCase(fetchRevenueOverviewAsync.rejected, (state, action) => {
        state.loading.revenue = false;
        state.error = action.payload;
      })

      .addCase(fetchRecentReviewsAsync.pending, (state) => {
        state.loading.reviews = true;
        state.error = null;
      })
      .addCase(fetchRecentReviewsAsync.fulfilled, (state, action) => {
        state.loading.reviews = false;
        state.reviews = asListPayload(action.payload);
      })
      .addCase(fetchRecentReviewsAsync.rejected, (state, action) => {
        state.loading.reviews = false;
        state.error = action.payload;
      })

      .addCase(fetchNotificationsAsync.pending, (state) => {
        state.loading.notifications = true;
        state.error = null;
      })
      .addCase(fetchNotificationsAsync.fulfilled, (state, action) => {
        state.loading.notifications = false;
        state.notifications = asListPayload(action.payload);
      })
      .addCase(fetchNotificationsAsync.rejected, (state, action) => {
        state.loading.notifications = false;
        state.error = action.payload;
      });
  },
});

export const { clearVenueOwnerError } = venueOwnerSlice.actions;
export default venueOwnerSlice.reducer;
