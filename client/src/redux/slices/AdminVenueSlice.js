import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";

const initialState = {
    loading: false,
    error: null,
    venues: [],
    selectedVenue: null,
    pagination: {
        totalPages: 0,
        totalCount: 0,
    },
};

export const getVenues = createAsyncThunk(
    "admin/getVenues",
    async (params = {}, { rejectWithValue }) => {
        console.log("Thunk called wih");
        try {

            const response = await api.get(
                API_ROUTES.ADMIN.VENUE.VENUES,
                {
                    params: {
                        search: params.search || "",
                        category: params.category || undefined,
                        approvalStatus: params.approvalStatus || undefined,
                        isBlocked: params.isBlocked,
                        page: params.page || 1,
                        limit: params.limit || 10,
                    },
                }
            );
    console.log(response.data);
            return response.data.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch venues."
            );

        }
    }
);

export const getVenueById = createAsyncThunk(
    "admin/getVenueById",
    async (venueId, { rejectWithValue }) => {
console.log("Thunk getVenueById", venueId);
        try {

            const response = await api.get(
                API_ROUTES.ADMIN.VENUE.GET_BY_ID(venueId)
            );

            return response.data.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch venue."
            );

        }
    }
);

export const approveVenue = createAsyncThunk(
    "admin/approveVenue",
    async (venueId, { rejectWithValue }) => {

        try {

            const response = await api.patch(
                API_ROUTES.ADMIN.VENUE.APPROVE(venueId)
            );

            return response.data.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to approve venue."
            );

        }
    }
);

export const rejectVenue = createAsyncThunk(
    "admin/rejectVenue",
    async (
        { venueId, rejectionReason },
        { rejectWithValue }
    ) => {

        try {

            const response = await api.patch(
                API_ROUTES.ADMIN.VENUE.REJECT(venueId),
                {
                    reason: rejectionReason,
                }
            );

            return response.data.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to reject venue."
            );

        }
    }
);

export const updateVenueStatus = createAsyncThunk(
    "admin/updateVenueStatus",
    async (
        { venueId, isBlocked },
        { rejectWithValue }
    ) => {

        try {

            const response = await api.patch(
                API_ROUTES.ADMIN.VENUE.UPDATE_STATUS(venueId),
                {
                    isBlocked,
                }
            );

            return response.data.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update venue status."
            );

        }
    }
);

const adminVenueSlice = createSlice({

    name: "adminVenue",

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder

        // ==========================
        // GET VENUES
        // ==========================

        .addCase(getVenues.pending, (state) => {

            state.loading = true;
            state.error = null;

        })

        .addCase(getVenues.fulfilled, (state, action) => {

            state.loading = false;

            state.venues = action.payload.data;

            state.pagination.totalPages =
                action.payload.totalPages;

            state.pagination.totalCount =
                action.payload.totalCount;

        })

        .addCase(getVenues.rejected, (state, action) => {

            state.loading = false;
            state.error = action.payload;

        })

        // ==========================
        // GET VENUE BY ID
        // ==========================

        .addCase(getVenueById.pending, (state) => {

            state.loading = true;

        })

        .addCase(getVenueById.fulfilled, (state, action) => {

            state.loading = false;

            state.selectedVenue = action.payload;

        })

        .addCase(getVenueById.rejected, (state, action) => {

            state.loading = false;

            state.error = action.payload;

        })

        // ==========================
        // APPROVE
        // ==========================

        .addCase(approveVenue.fulfilled, (state, action) => {

            const updatedVenue = action.payload;

            const index =
                state.venues.findIndex(
                    venue => venue.id === updatedVenue.id
                );

            if (index !== -1) {

                state.venues[index] = updatedVenue;

            }

        })

        // ==========================
        // REJECT
        // ==========================

        .addCase(rejectVenue.fulfilled, (state, action) => {

            const updatedVenue = action.payload;

            const index =
                state.venues.findIndex(
                    venue => venue.id === updatedVenue.id
                );

            if (index !== -1) {

                state.venues[index] = updatedVenue;

            }

        })

        // ==========================
        // BLOCK / UNBLOCK
        // ==========================

        .addCase(updateVenueStatus.fulfilled, (state, action) => {

            const updatedVenue = action.payload;

            const index =
                state.venues.findIndex(
                    venue => venue.id === updatedVenue.id
                );

            if (index !== -1) {

                state.venues[index] = updatedVenue;

            }

        })

        .addMatcher(

            (action) =>
                action.type.endsWith("/pending"),

            (state) => {

                state.loading = true;

            }

        )

        .addMatcher(

            (action) =>
                action.type.endsWith("/rejected"),

            (state, action) => {

                state.loading = false;
                state.error = action.payload;

            }

        )

        .addMatcher(

            (action) =>
                action.type.endsWith("/fulfilled"),

            (state) => {

                state.loading = false;

            }

        );

    },

});

export default adminVenueSlice.reducer;