import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";

const initialState = {
  loading: false,
  error: null,
  user: null,
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

export const removeProfileImage = createAsyncThunk(
  "userProfile/removeProfileImage",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete(API_ROUTES.USER.PROFILE.PROFILE_IMAGE);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove profile image"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        API_ROUTES.USER.PROFILE.CHANGE_PASSWORD,
        passwordData
      );

      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change password"
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

      //REMOVE PROFILE IMAGE
      .addCase(removeProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(removeProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      .addCase(removeProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //CHANGE PASSWORD
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify OTP
      .addCase(verifyEmailOtp.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export default UserProfileSlice.reducer;
