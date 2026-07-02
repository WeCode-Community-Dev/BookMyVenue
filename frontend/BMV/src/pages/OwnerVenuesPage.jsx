import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";

import OwnerLayout from "../components/VenueOwnerDashboard/OwnerLayout";
import VenuesGrid from "../components/VenueOwnerDashboard/VenuesGrid";
import AddVenueModal from "../components/VenueOwnerDashboard/AddVenueModal";
import {
  fetchMyVenuesAsync,
  fetchVenueTypesAsync,
  createVenueAsync,
  clearVenueOwnerError,
} from "../modules/venueOwner/venueOwnerSlice";

function OwnerVenuesPage() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { venues, venueTypes, loading, error } = useSelector((state) => state.venueOwner);

  useEffect(() => {
    dispatch(fetchMyVenuesAsync());
    dispatch(fetchVenueTypesAsync());
  }, [dispatch]);

  const handleAddVenue = async (payload) => {
    const result = await dispatch(createVenueAsync(payload));
    if (createVenueAsync.fulfilled.match(result)) {
      setIsModalOpen(false);
    }
    // On rejection, the modal stays open and `error` (from state.venueOwner)
    // is passed back in so the person can see what went wrong and retry.
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(clearVenueOwnerError());
  };

  return (
    <OwnerLayout>
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-gray-900">My Venues</h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage and monitor all your registered venues from one place.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-rose-900 hover:bg-rose-950 text-white text-sm font-semibold px-4 py-2.5 rounded-full shrink-0 transition-colors"
        >
          <Plus size={16} />
          Add New Venue
        </button>
      </div>

      <VenuesGrid venues={venues} loading={loading.venues} />

      <AddVenueModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddVenue}
        venueTypes={venueTypes}
        submitting={loading.creatingVenue}
        error={error}
      />
    </OwnerLayout>
  );
}

export default OwnerVenuesPage;