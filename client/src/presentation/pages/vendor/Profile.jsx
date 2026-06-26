import { useState } from "react";

import VendorSidebar from "@/presentation/components/vendor/VendorSidebar";
import VendorNavbar from "@/presentation/components/vendor/VendorNavbar";

import ProfileHeader from "@/presentation/components/vendor/profile/ProfileHeader";
import ProfileStats from "@/presentation/components/vendor/profile/ProfileStats";
import PersonalInformation from "@/presentation/components/vendor/profile/PersonalInformation";
import BusinessInformation from "@/presentation/components/vendor/profile/BusinessInformation";
import ChangePassword from "@/presentation/components/vendor/profile/ChangePassword";
import NotificationSettings from "@/presentation/components/vendor/profile/NotificationSettings";
import ProfileActions from "@/presentation/components/vendor/profile/ProfileActions";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex bg-slate-100 min-h-screen">

      <VendorSidebar />

      <div className="flex-1">

        <VendorNavbar />

        <main className="p-6">

          <ProfileHeader
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />

          <ProfileStats />

          <PersonalInformation
            isEditing={isEditing}
          />

          <BusinessInformation
            isEditing={isEditing}
          />

          <ChangePassword
            isEditing={isEditing}
          />

          <NotificationSettings
            isEditing={isEditing}
          />

          {isEditing && (
            <ProfileActions
              setIsEditing={setIsEditing}
            />
          )}

        </main>

      </div>

    </div>
  );
};

export default Profile;