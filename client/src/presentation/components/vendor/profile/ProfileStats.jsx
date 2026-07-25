import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileStatCard from "./ProfileStatCard";
import { fetchVendorProfile } from "@/redux/slices/vendorProfileSlice";

const ProfileStats = () => {
  const dispatch = useDispatch();

  const { profile, loading, error } = useSelector(
    (state) => state.vendorProfile
  );

  useEffect(() => {
    dispatch(fetchVendorProfile());
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 col-span-4">{error}</p>
      )}

      {/* Loading */}
      {loading && (
        <p className="text-sm text-gray-500 col-span-4">
          Loading profile stats...
        </p>
      )}

      {/* Stats */}
      <ProfileStatCard
        title="Total Venues"
        value={profile?.totalVenues ?? 0}
      />

      <ProfileStatCard
        title="Bookings"
        value={profile?.totalBookings ?? 0}
      />

      <ProfileStatCard
        title="Revenue"
        value={`₹${profile?.totalRevenue ?? 0}`}
      />

      <ProfileStatCard
        title="Rating"
        value={`${profile?.rating ?? 0}★`}
      />
    </div>
  );
};

export default ProfileStats;
