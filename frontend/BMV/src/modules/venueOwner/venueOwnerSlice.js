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

export const fetchOwnerBookingsAsync = createAsyncThunk(
  "venueOwner/fetchOwnerBookings",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await venueOwnerService.getOwnerBookings(params);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchVenueBookingsAsync = createAsyncThunk(
  "venueOwner/fetchVenueBookings",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await venueOwnerService.getOwnerBookings(params);
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

// ← CHANGED: now accepts { id, reason } so the rejection reason flows through
export const rejectBookingRequestAsync = createAsyncThunk(
  "venueOwner/rejectBookingRequest",
  async ({ id, reason = null }, { rejectWithValue }) => {
    try {
      return await venueOwnerService.rejectBookingRequest(id, reason);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchAvailabilityCalendarAsync = createAsyncThunk(
  "venueOwner/fetchAvailabilityCalendar",
  async (params, { rejectWithValue }) => {
    try {
      return await venueOwnerService.getAvailabilityCalendar(params);
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

export const fetchVenueByIdAsync = createAsyncThunk(
  "venueOwner/fetchVenueById",
  async (id, { rejectWithValue }) => {
    try {
      return await venueOwnerService.getVenueById(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateVenueAsync = createAsyncThunk(
  "venueOwner/updateVenue",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await venueOwnerService.updateVenue(id, payload);
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

export const deleteVenueAsync = createAsyncThunk(
  "venueOwner/deleteVenue",
  async (id, { rejectWithValue }) => {
    try {
      await venueOwnerService.deleteVenue(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const deactivateVenueAsync = createAsyncThunk(
  "venueOwner/deactivateVenue",
  async (id, { rejectWithValue }) => {
    try {
      await venueOwnerService.deactivateVenue(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const initialState = {
  summary: null,
  bookingRequests: [],

  ownerBookings: {
    items: [],
    total: 0,
    page: 1,
    limit: 10,
  },

  venueBookings: { items: [], total: 0, page: 1, limit: 10 },

  calendar: { month: null, days: {} },
  venues: [],
  activeVenue: null,
  venueTypes: [],
  amenities: [],
  revenue: null,
  reviews: [],
  notifications: [],

  loading: {
    summary: false,
    bookingRequests: false,
    ownerBookings: false,
    venueBookings: false,
    actionBooking: null,
    calendar: false,
    venues: false,
    activeVenue: false,
    creatingVenue: false,
    updatingVenue: false,
    venueTypes: false,
    amenities: false,
    revenue: false,
    reviews: false,
    notifications: false,
    deletingVenue: false,
    deactivatingVenue: false,
  },
  error: null,
};

const asListPayload = (payload) =>
  Array.isArray(payload) ? payload : payload?.data || payload?.items || [];

function patchOwnerBooking(state, updatedBooking) {
  const idx = state.ownerBookings.items.findIndex((b) => b.id === updatedBooking.id);
  if (idx !== -1) state.ownerBookings.items[idx] = updatedBooking;

  const rIdx = state.bookingRequests.findIndex((b) => b.id === updatedBooking.id);
  if (rIdx !== -1) state.bookingRequests.splice(rIdx, 1);
}

const venueOwnerSlice = createSlice({
  name: "venueOwner",
  initialState,
  reducers: {
    clearVenueOwnerError: (state) => {
      state.error = null;
    },
    clearActiveVenue: (state) => {
      state.activeVenue = null;
    },
    clearVenueBookings: (state) => {
      state.venueBookings = { items: [], total: 0, page: 1, limit: 10 };
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

      .addCase(fetchOwnerBookingsAsync.pending, (state) => {
        state.loading.ownerBookings = true;
        state.error = null;
      })
      .addCase(fetchOwnerBookingsAsync.fulfilled, (state, action) => {
        state.loading.ownerBookings = false;
        state.ownerBookings = action.payload;
      })
      .addCase(fetchOwnerBookingsAsync.rejected, (state, action) => {
        state.loading.ownerBookings = false;
        state.error = action.payload;
      })

      .addCase(fetchVenueBookingsAsync.pending, (state) => {
        state.loading.venueBookings = true;
        state.error = null;
      })
      .addCase(fetchVenueBookingsAsync.fulfilled, (state, action) => {
        state.loading.venueBookings = false;
        state.venueBookings = action.payload;
      })
      .addCase(fetchVenueBookingsAsync.rejected, (state, action) => {
        state.loading.venueBookings = false;
        state.error = action.payload;
      })

      // ── Accept / Reject
      .addCase(acceptBookingRequestAsync.pending, (state, action) => {
        state.loading.actionBooking = action.meta.arg;
      })
      .addCase(acceptBookingRequestAsync.fulfilled, (state, action) => {
        state.loading.actionBooking = null;
        patchOwnerBooking(state, action.payload);
      })
      .addCase(acceptBookingRequestAsync.rejected, (state, action) => {
        state.loading.actionBooking = null;
        state.error = action.payload;
      })

      // ← CHANGED: meta.arg is now { id, reason }, so we track by id
      .addCase(rejectBookingRequestAsync.pending, (state, action) => {
        state.loading.actionBooking = action.meta.arg.id;
      })
      .addCase(rejectBookingRequestAsync.fulfilled, (state, action) => {
        state.loading.actionBooking = null;
        patchOwnerBooking(state, action.payload);
      })
      .addCase(rejectBookingRequestAsync.rejected, (state, action) => {
        state.loading.actionBooking = null;
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

      .addCase(fetchVenueByIdAsync.pending, (state) => {
        state.loading.activeVenue = true;
        state.error = null;
      })
      .addCase(fetchVenueByIdAsync.fulfilled, (state, action) => {
        state.loading.activeVenue = false;
        state.activeVenue = action.payload;
      })
      .addCase(fetchVenueByIdAsync.rejected, (state, action) => {
        state.loading.activeVenue = false;
        state.error = action.payload;
      })

      .addCase(updateVenueAsync.pending, (state) => {
        state.loading.updatingVenue = true;
        state.error = null;
      })
      .addCase(updateVenueAsync.fulfilled, (state, action) => {
        state.loading.updatingVenue = false;
        state.activeVenue = action.payload;
        const idx = state.venues.findIndex((v) => v.id === action.payload.id);
        if (idx !== -1) state.venues[idx] = action.payload;
      })
      .addCase(updateVenueAsync.rejected, (state, action) => {
        state.loading.updatingVenue = false;
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

      .addCase(deleteVenueAsync.pending, (state) => {
        state.loading.deletingVenue = true;
        state.error = null;
      })
      .addCase(deleteVenueAsync.fulfilled, (state, action) => {
        state.loading.deletingVenue = false;
        state.venues = state.venues.filter((v) => v.id !== action.payload);
      })
      .addCase(deleteVenueAsync.rejected, (state, action) => {
        state.loading.deletingVenue = false;
        state.error = action.payload;
      })

      .addCase(deactivateVenueAsync.pending, (state) => {
        state.loading.deactivatingVenue = true;
        state.error = null;
      })
      .addCase(deactivateVenueAsync.fulfilled, (state, action) => {
        state.loading.deactivatingVenue = false;
        state.venues = state.venues.filter((v) => v.id !== action.payload);
      })
      .addCase(deactivateVenueAsync.rejected, (state, action) => {
        state.loading.deactivatingVenue = false;
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

export const { clearVenueOwnerError, clearActiveVenue, clearVenueBookings } =
  venueOwnerSlice.actions;
export default venueOwnerSlice.reducer;