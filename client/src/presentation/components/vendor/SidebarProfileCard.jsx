import React from "react";

const SidebarProfileCard = () => {
  return (
    <div className="bg-slate-800 rounded-xl p-4 flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
          AK
        </div>

        <div>
          <h3 className="font-semibold text-white">
            Arjun Kapoor
          </h3>

          <p className="text-sm text-gray-400">
            Venue Owner
          </p>
        </div>
      </div>

      <div className="w-3 h-3 rounded-full bg-green-500"></div>
    </div>
  );
};

export default SidebarProfileCard;