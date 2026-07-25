import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";

// ==============================
// INITIAL STATE
// ==============================

const initialState = {
loading: false,
profile: null,
error: null,
};

// ==============================
// FETCH VENDOR PROFILE
// ==============================

export const fetchVendorProfile = createAsyncThunk(
"vendorProfile/fetchVendorProfile",
async (_, { rejectWithValue }) => {
try {
const response = await api.get(API_ROUTES.VENDOR.PROFILE);


  return response.data.data;
} catch (error) {
  return rejectWithValue(
    error.response?.data?.message || "Failed to fetch profile"
  );
}


}
);

// ==============================
// UPDATE VENDOR PROFILE
// ==============================

export const updateVendorProfile = createAsyncThunk(
"vendorProfile/updateVendorProfile",
async (profileData, { rejectWithValue }) => {
try {
const response = await api.patch(
API_ROUTES.VENDOR.PROFILE,
profileData
);


  return response.data.data;
} catch (error) {
  return rejectWithValue(
    error.response?.data?.message || "Failed to update profile"
  );
}


}
);

// ==============================
// SLICE
// ==============================

const vendorProfileSlice = createSlice({
name: "vendorProfile",
initialState,
reducers: {},

extraReducers: (builder) => {
builder


  // ==========================
  // FETCH PROFILE
  // ==========================

  .addCase(fetchVendorProfile.pending, (state) => {
    state.loading = true;
    state.error = null;
  })

  .addCase(fetchVendorProfile.fulfilled, (state, action) => {
    state.loading = false;
    state.profile = action.payload;
  })

  .addCase(fetchVendorProfile.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })

  // ==========================
  // UPDATE PROFILE
  // ==========================

  .addCase(updateVendorProfile.pending, (state) => {
    state.loading = true;
    state.error = null;
  })

  .addCase(updateVendorProfile.fulfilled, (state, action) => {
    state.loading = false;
    state.profile = action.payload;
  })

  .addCase(updateVendorProfile.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });


},
});

export default vendorProfileSlice.reducer;
