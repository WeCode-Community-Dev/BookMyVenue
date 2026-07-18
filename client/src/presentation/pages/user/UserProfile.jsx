import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

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
    try {
      const payload = {
        fullName: formData.name,
        phone: formData.phone,
      };
  
      await dispatch(updateProfile(payload)).unwrap();
  
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleImageChange = async (file) => {
    try {
      await dispatch(updateProfileImage(file)).unwrap();
  
      toast.success("Profile picture updated successfully");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleRequestEmailOtp = async (newEmail) => {
    try {
      await dispatch(requestEmailChangeOtp(newEmail)).unwrap();
  
      toast.success("OTP sent to your email");
  
    } catch (error) {
      toast.error(error);
      throw error;
    }
  };

  const handleVerifyOtp = async (otp) => {
    try {
      await dispatch(verifyEmailOtp(otp)).unwrap();
  
      toast.success("Email updated successfully");
  
      await dispatch(getProfile());
  
      setIsEditing(false);
  
    } catch (error) {
      toast.error(typeof error === 'string' ? error : "Failed to update email")
    }
  };

  const handleResendOtp = async () => {
    try {
      await dispatch(resendEmailOtp()).unwrap();
  
      toast.success("OTP resent successfully");
    } catch (error) {
      toast.error(error);
      throw error;
    }
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
