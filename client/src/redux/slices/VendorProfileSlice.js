import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getVendorProfileService,
  updateVendorProfileService,
} from "@/services/vendor/profileService";

const initialState = {
  loading: false,
  updating: false,
  profile: null,
  error: null,
};

export const fetchVendorProfile = createAsyncThunk(
  "vendorProfile/fetchVendorProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await getVendorProfileService();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const updateVendorProfile = createAsyncThunk(
  "vendorProfile/updateVendorProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      return await updateVendorProfileService(profileData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

const vendorProfileSlice = createSlice({
  name: "vendorProfile",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Fetch Profile
      .addCase(fetchVendorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchVendorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data;
      })

      .addCase(fetchVendorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateVendorProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
      })

      .addCase(updateVendorProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.profile = action.payload.data;
      })

      .addCase(updateVendorProfile.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export default vendorProfileSlice.reducer;