import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import VendorSidebar from "@/presentation/components/vendor/VendorSidebar";
import VendorNavbar from "@/presentation/components/vendor/VendorNavbar";
import DeleteVenueDialog from "@/presentation/components/vendor/DeleteVenueDialog";

import {
  getVenueById,
  deleteVenue,
} from "@/redux/slices/VendorVenueSlice";

import { ROUTES } from "@/constants/routes";

const VenueDetails = () => {
  const { venueId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    venue,
    loading,
    error,
  } = useSelector(
    (state) => state.vendorVenue
  );

  // ==============================
  // FETCH VENUE
  // ==============================

  useEffect(() => {
    dispatch(getVenueById(venueId));
  }, [dispatch, venueId]);

  // ==============================
  // EDIT
  // ==============================

  const handleEdit = () => {
    navigate(
      ROUTES.VENDOR.EDIT_VENUE.replace(
        ":venueId",
        venueId
      )
    );
  };

  // ==============================
  // DELETE
  // ==============================

  const handleDelete = async () => {
    try {
      await dispatch(
        deleteVenue(venueId)
      ).unwrap();

      toast.success(
        "Venue deleted successfully"
      );

      navigate(
        ROUTES.VENDOR.VENUES
      );
    } catch (error) {
      toast.error(error);
    }
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <VendorSidebar />

        <div className="flex-1">
          <VendorNavbar />

          <main className="p-6">
            <p>Loading venue...</p>
          </main>
        </div>
      </div>
    );
  }

  // ==============================
  // ERROR
  // ==============================

  if (error) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <VendorSidebar />

        <div className="flex-1">
          <VendorNavbar />

          <main className="p-6">
            <p className="text-red-500">
              {error}
            </p>
          </main>
        </div>
      </div>
    );
  }

  if (!venue) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <VendorSidebar />

      <div className="flex-1">
        <VendorNavbar />

        <main className="p-6">

          {/* HEADER */}

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h1 className="text-3xl font-bold">
                {venue.name}
              </h1>

              <p className="mt-2 text-gray-500">
                {venue.category}
              </p>
            </div>

            <div className="flex gap-3">

              <button
                onClick={handleEdit}
                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  setDeleteOpen(true)
                }
                className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
              >
                Delete
              </button>

            </div>
          </div>

          {/* IMAGES */}

          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">

            {venue.images?.map(
              (image, index) => (
                <img
                  key={image.publicId || index}
                  src={image.url}
                  alt={venue.name}
                  className="h-48 w-full rounded-xl object-cover"
                />
              )
            )}

          </div>

          {/* DESCRIPTION */}

          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-3 text-xl font-semibold">
              Description
            </h2>

            <p className="text-gray-600">
              {venue.description}
            </p>

          </div>

          {/* ADDRESS */}

          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-xl font-semibold">
              Location Details
            </h2>

            <div className="grid gap-4 md:grid-cols-2">

              <p>
                <strong>Address:</strong>{" "}
                {venue.address?.addressLine1}
              </p>

              <p>
                <strong>City:</strong>{" "}
                {venue.address?.city}
              </p>

              <p>
                <strong>State:</strong>{" "}
                {venue.address?.state}
              </p>

              <p>
                <strong>Country:</strong>{" "}
                {venue.address?.country}
              </p>

              <p>
                <strong>Pincode:</strong>{" "}
                {venue.address?.pincode}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {venue.address?.phone}
              </p>

            </div>

          </div>

          {/* CAPACITY & PRICING */}

          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-xl font-semibold">
              Capacity & Pricing
            </h2>

            <div className="grid gap-4 md:grid-cols-3">

              <p>
                <strong>Seating Capacity:</strong>{" "}
                {venue.seatingCapacity}
              </p>

              <p>
                <strong>Standing Capacity:</strong>{" "}
                {venue.standingCapacity}
              </p>

              <p>
                <strong>Price Per Hour:</strong>{" "}
                ₹{venue.pricePerHour}
              </p>

              <p>
                <strong>Price Per Day:</strong>{" "}
                ₹{venue.pricePerDay}
              </p>

              <p>
                <strong>Security Deposit:</strong>{" "}
                ₹{venue.securityDeposit}
              </p>

              <p>
                <strong>Weekend Surcharge:</strong>{" "}
                {venue.weekendSurcharge}%
              </p>

              <p>
                <strong>Minimum Booking Hours:</strong>{" "}
                {venue.minimumBookingHours}
              </p>

            </div>

          </div>

          {/* AMENITIES */}

          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-xl font-semibold">
              Amenities
            </h2>

            <div className="flex flex-wrap gap-3">

              {venue.amenities?.map(
                (amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700"
                  >
                    {amenity}
                  </span>
                )
              )}

            </div>

          </div>

          {/* DELETE DIALOG */}

          <DeleteVenueDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            onConfirm={handleDelete}
            loading={loading}
          />

        </main>
      </div>
    </div>
  );
};

export default VenueDetails;