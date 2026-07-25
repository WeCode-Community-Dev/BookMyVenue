import { useSelector } from "react-redux";

const SidebarProfileCard = () => {
  const { profile } = useSelector((state) => state.vendorProfile);
  const { user } = useSelector((state) => state.auth)

  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "--";

  return (
    <div className="bg-slate-800 rounded-xl p-4 flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        {profile?.profileImage?.url ? (
          <img
            src={profile.profileImage.url}
            alt={user?.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
            {initials}
          </div>
        )}

        <div>
          <h3 className="font-semibold text-white">
            {user?.name || "Vendor"}
          </h3>

          <p className="text-sm text-gray-400">
            Venue Owner
          </p>
        </div>
      </div>

      <div
        className={`w-3 h-3 rounded-full ${
          profile?.approvalStatus === "APPROVED"
            ? "bg-green-500"
            : profile?.approvalStatus === "PENDING"
            ? "bg-yellow-500"
            : "bg-red-500"
        }`}
      />
    </div>
  );
};

export default SidebarProfileCard;