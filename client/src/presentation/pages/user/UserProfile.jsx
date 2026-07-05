import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Header from "@/presentation/components/common/Header";
import UserSidebar from "@/presentation/components/user/UserSidebar";
import UserProfileImage from "@/presentation/components/user/UserProfileImage";
import UserProfileInformation from "@/presentation/components/user/UserProfileInformation";
import UserEditProfileForm from "@/presentation/components/user/UserEditProfileForm";

import {
  getProfile,
  requestEmailChangeOtp,
  resendEmailOtp,
  updateProfile,
  updateProfileImage,
  verifyEmailOtp,
} from "@/redux/slices/UserProfileSlice";

const UserProfile = () => {
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector((state) => state.userProfile);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const handleSave = async (formData) => {
    const payload = {
      fullName: formData.name,
      phone: formData.phone,
    };

    const resultAction = await dispatch(updateProfile(payload));

    if (updateProfile.fulfilled.match(resultAction)) {
      setIsEditing(false);
    }
  };

  const handleImageChange = async (file) => {
    const resultAction = await dispatch(updateProfileImage(file));

    if (updateProfileImage.fulfilled.match(resultAction)) {
      console.log("Profile image updated");
    }
  };

  const { otpLoading, otpSent } = useSelector((state) => state.userProfile);

  const handleRequestEmailOtp = async (newEmail) => {
    const resultAction = await dispatch(requestEmailChangeOtp(newEmail));

    if (requestEmailChangeOtp.fulfilled.match(resultAction)) {
      console.log("OTP Sent");
    }
  };

  const handleVerifyOtp = async (otp) => {
    const result = await dispatch(verifyEmailOtp(otp));

    if (verifyEmailOtp.fulfilled.match(result)) {
      await dispatch(getProfile());

      setIsEditing(false);

      return {
        success: true,
      };
    }

    return {
      success: false,
      message: result.payload,
    };
  };

  const handleResendOtp = async () => {
    await dispatch(resendEmailOtp());
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex">
          <UserSidebar />

          <main className="flex-1 flex items-center justify-center">
            <h2 className="text-lg font-medium text-gray-600">
              Loading Profile...
            </h2>
          </main>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="flex">
          <UserSidebar />

          <main className="flex-1 flex items-center justify-center">
            <h2 className="text-lg font-medium text-red-500">{error}</h2>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="flex">
        <UserSidebar />

        <main className="flex-1 bg-gray-50 p-10">
          <div className="flex gap-10 items-start">
            {/* Left Section */}
            <div className="w-80">
              <UserProfileImage
                image={user?.profileImage?.url}
                name={user?.fullName}
                email={user?.email}
                memberSince={new Date(user?.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    year: "numeric",
                  }
                )}
                onImageChange={handleImageChange}
              />
            </div>

            {/* Right Section */}
            <div className="flex-1">
              {isEditing ? (
                <UserEditProfileForm
                  user={user}
                  onSave={handleSave}
                  onCancel={() => setIsEditing(false)}
                  onRequestEmailOtp={handleRequestEmailOtp}
                  otpLoading={otpLoading}
                  otpSent={otpSent}
                  onVerifyOtp={handleVerifyOtp}
                  onResendOtp={handleResendOtp}
                />
              ) : (
                <UserProfileInformation
                  user={user}
                  onEditProfile={() => setIsEditing(true)}
                  onAccountSettings={() => console.log("Account Settings")}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UserProfile;
