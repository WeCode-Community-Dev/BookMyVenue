import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constatnts/apiRoutes";

const initialState = {
  loading: false,
  error: null,
  user: null,
  otpLoading: false,
  otpSent: false,
  otpVerified: false,
};

// Get Profile
export const getProfile = createAsyncThunk(
  "user/profile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ROUTES.USER.PROFILE.PROFILE);

      console.log("Profile API Response:", response.data);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// Update Profile
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        API_ROUTES.USER.PROFILE.PROFILE,
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

export const updateProfileImage = createAsyncThunk(
  "user/updateProfileImage",
  async (imageFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("profileImage", imageFile);

      const response = await api.patch(
        API_ROUTES.USER.PROFILE.PROFILE_IMAGE,
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
        error.response?.data?.message || "Failed to upload image"
      );
    }
  }
);

export const requestEmailChangeOtp = createAsyncThunk(
  "user/requestEmailChangeOtp",
  async (newEmail, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ROUTES.USER.PROFILE.REQUEST_EMAIL_CHANGE_OTP,
        {
          newEmail,
        }
      );

      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

export const verifyEmailOtp = createAsyncThunk(
  "user/verifyEmailOtp",
  async (otp, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ROUTES.USER.PROFILE.VERIFY_EMAIL_CHANGE_OTP,
        {
          otp,
        }
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

export const resendEmailOtp = createAsyncThunk(
  "user/resendEmailOtp",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ROUTES.USER.PROFILE.RESEND_EMAIL_CHANGE_OTP
      );

      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to resend OTP"
      );
    }
  }
);

const UserProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // GET PROFILE
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //UPDATE PROFILE IMAGE
      .addCase(updateProfileImage.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      .addCase(updateProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Request OTP
      .addCase(requestEmailChangeOtp.pending, (state) => {
        state.otpLoading = true;
      })

      .addCase(requestEmailChangeOtp.fulfilled, (state) => {
        state.otpLoading = false;
        state.otpSent = true;
      })

      .addCase(requestEmailChangeOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload;
      })

      // Verify OTP
      .addCase(verifyEmailOtp.pending, (state) => {
        state.otpLoading = true;
      })

      .addCase(verifyEmailOtp.fulfilled, (state, action) => {
        state.otpLoading = false;
        state.otpVerified = true;
        state.user = action.payload;
      })

      .addCase(verifyEmailOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload;
      })

      // Resend OTP
      .addCase(resendEmailOtp.pending, (state) => {
        state.otpLoading = true;
      })

      .addCase(resendEmailOtp.fulfilled, (state) => {
        state.otpLoading = false;
      })

      .addCase(resendEmailOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload;
      });
  },
});

export default UserProfileSlice.reducer;
