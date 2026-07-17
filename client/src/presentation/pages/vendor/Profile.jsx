import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import VendorSidebar from "@/presentation/components/vendor/VendorSidebar";
import VendorNavbar from "@/presentation/components/vendor/VendorNavbar";

import ProfileHeader from "@/presentation/components/vendor/profile/ProfileHeader";
import ProfileStats from "@/presentation/components/vendor/profile/ProfileStats";
import PersonalInformation from "@/presentation/components/vendor/profile/PersonalInformation";
import BusinessInformation from "@/presentation/components/vendor/profile/BusinessInformation";
import ChangePassword from "@/presentation/components/vendor/profile/ChangePassword";
import NotificationSettings from "@/presentation/components/vendor/profile/NotificationSettings";
import ProfileActions from "@/presentation/components/vendor/profile/ProfileActions";

import {
  fetchVendorProfile,
  updateVendorProfile,
} from "@/redux/slices/VendorProfileSlice";

const Profile = () => {
  const dispatch = useDispatch();

  const {
    profile,
    loading,
    updating,
    error,
  } = useSelector((state) => state.vendorProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    dispatch(fetchVendorProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleSave = async () => {
    const result = await dispatch(updateVendorProfile(formData));

    if (updateVendorProfile.fulfilled.match(result)) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <VendorSidebar />

      <div className="flex-1">
        <VendorNavbar />

        <main className="p-6">
          <ProfileHeader
            profile={profile}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />

          {error && (
            <p className="mb-4 text-sm text-red-500">
              {error}
            </p>
          )}

          {loading && (
            <p className="mb-4 text-sm text-gray-500">
              Loading profile...
            </p>
          )}

          <ProfileStats profile={profile} />

          <PersonalInformation
            isEditing={isEditing}
            profile={formData}
            setProfile={setFormData}
          />

          <BusinessInformation
            isEditing={isEditing}
            profile={formData}
            setProfile={setFormData}
          />

          <ChangePassword isEditing={isEditing} />

          <NotificationSettings isEditing={isEditing} />

          {isEditing && (
            <ProfileActions
              onSave={handleSave}
              onCancel={handleCancel}
              updating={updating}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;