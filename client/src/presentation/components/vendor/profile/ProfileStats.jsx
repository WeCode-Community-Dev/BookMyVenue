import React from "react";
import ProfileStatCard from "./ProfileStatCard";

const ProfileStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <ProfileStatCard
        title="Total Venues"
        value="12"
      />

      <ProfileStatCard
        title="Bookings"
        value="248"
      />

      <ProfileStatCard
        title="Revenue"
        value="₹42L"
      />

      <ProfileStatCard
        title="Rating"
        value="4.7★"
      />
    </div>
  );
};

export default ProfileStats;