import { API_ROUTES } from "@/constants/apiRoutes"
import api from "@/lib/axios"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState = {
    loading: false,
    error: null,

    vendors: [],

    pagination: {
        totalPages: 0,
        totalCount: 0,
    },
};

export const getVendors = createAsyncThunk(
    "admin/getVendors",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get(
                API_ROUTES.ADMIN.VENDOR.VENDORS,
                {
                    params: {
                        search: params.search || "",
                        status: params.approvalStatus || undefined,
                        isBlocked: params.isBlocked,
                        page: params.page || 1,
                        limit: params.limit || 10,
                    },
                }
            );
  console.log("success")
            console.log(response)
            return response.data.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch vendors."
            );

        }
    }
);

export const approveVendor = createAsyncThunk(
    "admin/approveVendor",
    async (vendorId, { rejectWithValue }) => {

        try {

            const response = await api.patch(
                API_ROUTES.ADMIN.VENDOR.APPROVE(vendorId)
            );


            return response.data.data;

        } catch (error) {
            console.log("approve error:",error.response?.data)

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to approve vendor."
            );

        }
    }
);
export const rejectVendor = createAsyncThunk(
    "admin/rejectVendor",
    async (
        { vendorId, rejectionReason },
        { rejectWithValue }
    ) => {

        try {

            const response = await api.patch(
                API_ROUTES.ADMIN.VENDOR.REJECT(vendorId),
                {
                    reason:rejectionReason,
                }
            );

            return response.data.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to reject vendor."
            );

        }
    }
);
export const updateVendorStatus = createAsyncThunk(
    "admin/updateVendorStatus",
    async (
        { vendorId, isBlocked },
        { rejectWithValue }
    ) => {

        try {
console.log("venId",vendorId)
            const response = await api.patch(
                API_ROUTES.ADMIN.VENDOR.UPDATE_STATUS(vendorId),
                {
                    isBlocked,
                }
            );
            console.log("update vendor ",response.data)

            return response.data.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update vendor status."
            );

        }
    }
);

const adminVendorSlice = createSlice({
    name: "adminVendor",
    initialState,
    reducers: {},
   extraReducers: (builder) => {

    builder

    // =========================
    // GET VENDORS
    // =========================

    .addCase(getVendors.pending, (state) => {

        state.loading = true;
        state.error = null;

    })

    .addCase(getVendors.fulfilled, (state, action) => {

        state.loading = false;

        state.vendors = action.payload.data;

        state.pagination.totalPages =
            action.payload.totalPages;

        state.pagination.totalCount =
            action.payload.totalCount;

    })

    .addCase(getVendors.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload;

    })

    // =========================
    // APPROVE VENDOR
    // =========================

    .addCase(approveVendor.pending, (state) => {

        state.loading = true;

    })

    .addCase(approveVendor.fulfilled, (state, action) => {

        state.loading = false;

        const updatedVendor = action.payload;

        const index = state.vendors.findIndex(

            (vendor) => vendor._id === updatedVendor._id

        );

        if (index !== -1) {

            state.vendors[index] = updatedVendor;

        }

    })

    .addCase(approveVendor.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload;

    })

    // =========================
    // REJECT VENDOR
    // =========================

    .addCase(rejectVendor.pending, (state) => {

        state.loading = true;

    })

    .addCase(rejectVendor.fulfilled, (state, action) => {

        state.loading = false;

        const updatedVendor = action.payload;

        const index = state.vendors.findIndex(

            (vendor) => vendor._id === updatedVendor._id

        );

        if (index !== -1) {

            state.vendors[index] = updatedVendor;

        }

    })

    .addCase(rejectVendor.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload;

    })

    // =========================
    // BLOCK / UNBLOCK
    // =========================

    .addCase(updateVendorStatus.pending, (state) => {

        state.loading = true;

    })

    .addCase(updateVendorStatus.fulfilled, (state, action) => {

        state.loading = false;

        const updatedVendor = action.payload;

        const index = state.vendors.findIndex(

            (vendor) => vendor._id === updatedVendor._id

        );

        if (index !== -1) {

            state.vendors[index] = updatedVendor;

        }

    })

    .addCase(updateVendorStatus.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload;

    });

}
});
export default adminVendorSlice.reducer;