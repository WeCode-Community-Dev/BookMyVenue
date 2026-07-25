import { useSelector } from "react-redux";
import ProfileStatCard from "./ProfileStatCard";

const ProfileStats = ({ profile }) => {
  const {
    loading,
    error,
  } = useSelector(
    (state) => state.vendorProfile
  );

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

      {/* ERROR */}
      {error && (
        <p className="col-span-4 text-sm text-red-500">
          {error}
        </p>
      )}

      {/* LOADING */}
      {loading && (
        <p className="col-span-4 text-sm text-gray-500">
          Loading profile stats...
        </p>
      )}

      {/* TOTAL VENUES */}
      <ProfileStatCard
        title="Total Venues"
        value={profile?.totalVenues ?? 0}
      />

      {/* BOOKINGS */}
      <ProfileStatCard
        title="Bookings"
        value={profile?.totalBookings ?? 0}
      />

      {/* REVENUE */}
      <ProfileStatCard
        title="Revenue"
        value={`₹${Number(
          profile?.totalRevenue ?? 0
        ).toLocaleString("en-IN")}`}
      />

      {/* RATING */}
      <ProfileStatCard
        title="Rating"
        value={`${profile?.rating ?? 0}★`}
      />

    </div>
  );
};

export default ProfileStats;