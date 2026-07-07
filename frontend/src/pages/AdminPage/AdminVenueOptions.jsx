import { useState } from "react";
import OptionManagerTable from "../../components/admin/OptionManagerTable.jsx";

import {
  getAdminAmenities,
  createAmenity,
  updateAmenity,
  deleteAmenity,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/venueOptions.service.js";

const TABS = [
  { key: "amenities", label: "Amenities" },
  { key: "categories", label: "Categories" },
];

export function AdminVenueOptions() {
  const [activeTab, setActiveTab] = useState("amenities");

  const config =
    activeTab === "amenities"
      ? {
          title: "Amenities",
          itemLabel: "Amenity",
          list: getAdminAmenities,
          create: createAmenity,
          update: updateAmenity,
          remove: deleteAmenity,
        }
      : {
          title: "Categories",
          itemLabel: "Category",
          list: getAdminCategories,
          create: createCategory,
          update: updateCategory,
          remove: deleteCategory,
        };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Venue Options
        </h1>

        <p className="mt-2 text-gray-500">
          Manage the amenities and categories venue owners can select.
        </p>
      </div>

      <div className="mb-6 flex border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 border-b-2 text-sm font-medium transition
              ${
                activeTab === tab.key
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <OptionManagerTable {...config} />
    </div>
  );
}