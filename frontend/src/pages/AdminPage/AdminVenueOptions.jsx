import OptionManagerCard from "../../components/admin/OptionManagerCard.jsx";
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

export function AdminVenueOptions() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Venue Options</h1>
        <p className="mt-2 text-gray-500">
          Manage the amenities and categories venue owners can pick from.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OptionManagerCard
          title="Amenities"
          itemLabel="Amenity"
          list={getAdminAmenities}
          create={createAmenity}
          update={updateAmenity}
          remove={deleteAmenity}
        />

        <OptionManagerCard
          title="Categories"
          itemLabel="Category"
          list={getAdminCategories}
          create={createCategory}
          update={updateCategory}
          remove={deleteCategory}
        />
      </div>
    </div>
  );
}
