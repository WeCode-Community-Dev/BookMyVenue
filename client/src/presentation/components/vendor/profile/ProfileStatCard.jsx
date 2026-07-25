import React from "react";

const ProfileStatCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
      <h2 className="text-3xl font-bold text-blue-600">
        {value}
      </h2>

      <p className="text-gray-500 mt-2">
        {title}
      </p>
    </div>
  );
};

export default ProfileStatCard;