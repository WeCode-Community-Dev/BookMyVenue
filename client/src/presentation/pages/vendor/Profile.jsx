import { useEffect, useState } from "react";
import VendorSidebar from "@/presentation/components/vendor/VendorSidebar";
import VendorNavbar from "@/presentation/components/vendor/VendorNavbar";
import ProfileHeader from "@/presentation/components/vendor/profile/ProfileHeader";
import ProfileStats from "@/presentation/components/vendor/profile/ProfileStats";
import PersonalInformation from "@/presentation/components/vendor/profile/PersonalInformation";
import BusinessInformation from "@/presentation/components/vendor/profile/BusinessInformation";
import ChangePassword from "@/presentation/components/vendor/profile/ChangePassword";
import NotificationSettings from "@/presentation/components/vendor/profile/NotificationSettings";
import ProfileActions from "@/presentation/components/vendor/profile/ProfileActions";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constatnts/apiRoutes";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const response = await api.get(API_ROUTES.VENDOR.PROFILE);
      setProfile(response?.data?.data || {});
    } catch (err) {
      console.error(err);
      setError("Unable to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await api.patch(API_ROUTES.VENDOR.PROFILE, profile);
      setIsEditing(false);
      await fetchProfile();
    } catch (err) {
      console.error(err);
      setError("Unable to update profile.");
    }
  };

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <VendorSidebar />

      <div className="flex-1">
        <VendorNavbar />

        <main className="p-6">
          <ProfileHeader isEditing={isEditing} setIsEditing={setIsEditing} />

          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          {loading && <p className="mb-4 text-sm text-gray-500">Loading profile...</p>}

          <ProfileStats />

          <PersonalInformation
            isEditing={isEditing}
            profile={profile}
            setProfile={setProfile}
          />

          <BusinessInformation
            isEditing={isEditing}
            profile={profile}
            setProfile={setProfile}
          />

          <ChangePassword isEditing={isEditing} />
          <NotificationSettings isEditing={isEditing} />

          {isEditing && <ProfileActions setIsEditing={setIsEditing} onSave={handleSave} />}
        </main>
      </div>
    </div>
  );
};

export default Profile;