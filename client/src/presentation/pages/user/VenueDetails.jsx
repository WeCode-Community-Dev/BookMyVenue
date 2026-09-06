import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Header from "@/presentation/components/common/Header";
import Footer from "@/presentation/components/common/Footer";

import VenueHeader from "@/presentation/components/user/venueDetails/VenueHeader";
import VenueGallery from "@/presentation/components/user/venueDetails/VenueGallery";
import VenueAbout from "@/presentation/components/user/venueDetails/VenueAbout";
import VenueAmenities from "@/presentation/components/user/venueDetails/VenueAmenities";
import VenueAvailability from "@/presentation/components/user/venueDetails/VenueAvailability";
import VenueReviews from "@/presentation/components/user/venueDetails/VenueReviews";
import BookingCard from "@/presentation/components/user/venueDetails/BookingCard";
import HostedBy from "@/presentation/components/user/venueDetails/HostedBy";
import CancellationPolicy from "@/presentation/components/user/venueDetails/CancellationPolicy";
import SimilarVenues from "@/presentation/components/user/venueDetails/SimilarVenues";

import { getVenueById } from "@/redux/slices/UserVenueSlice";

import { similarVenues } from "@/constants/mockVenues";

export default function VenueDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [availability, setAvailability] = useState({
    eventDate: "",
    startTime: "",
    endTime: "",
    guestCount: "",
  });

  const { selectedVenue, loading, error } = useSelector(
    (state) => state.userVenue
  );

  // ======================================
  // FETCH VENUE DETAILS
  // ======================================
  useEffect(() => {
    if (id) {
      dispatch(getVenueById(id));
    }
  }, [dispatch, id]);

  return (
    <>
      {/* ======================================
          HEADER
      ====================================== */}
      <Header />

      <main className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-6">

          {/* ======================================
              LOADING STATE
          ====================================== */}
          {loading && (
            <div className="p-10 text-center">
              Loading venue...
            </div>
          )}

          {/* ======================================
              ERROR STATE
          ====================================== */}
          {error && (
            <div className="p-10 text-center text-red-500">
              {error}
            </div>
          )}

          {/* ======================================
              VENUE NOT FOUND
          ====================================== */}
          {!loading && !error && !selectedVenue && (
            <div className="p-10 text-center">
              Venue not found
            </div>
          )}

          {/* ======================================
              VENUE DETAILS
          ====================================== */}
          {!loading && !error && selectedVenue && (
            <>
            <div className="mb-6">
              <button
              onClick={() => navigate("/user/venues")}
              className="flex items-center gap-2 text-sm font-large text-gray-600 hover:text-gray-900"
              >
                   ← Back to Venues
              </button>
            </div>
              {/* ======================================
                  VENUE HEADER
              ====================================== */}
              <VenueHeader venue={selectedVenue} />

              {/* ======================================
                  VENUE GALLERY
              ====================================== */}
              <VenueGallery venue={selectedVenue} />

              {/* ======================================
                  VENUE INFORMATION
              ====================================== */}
              <div className="mt-10 space-y-10">

                {/* ======================================
                    ABOUT
                ====================================== */}
                <VenueAbout
                  description={selectedVenue.description}
                />

                {/* ======================================
                    AMENITIES
                ====================================== */}
                <VenueAmenities
                  amenities={selectedVenue.amenities}
                />

                {/* ======================================
                    AVAILABILITY + BOOKING SECTION
                ====================================== */}
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">

                  {/* ======================================
                      LEFT COLUMN
                  ====================================== */}
                  <div className="space-y-10 lg:col-span-2">

                    {/* Availability */}
                    <VenueAvailability
                      venue={selectedVenue}
                      onAvailabilityChange={setAvailability}
                    />

                    {/* Reviews */}
                    <VenueReviews
                      venue={selectedVenue}
                    />

                  </div>

                  {/* ======================================
                      RIGHT COLUMN
                  ====================================== */}
                  <div className="space-y-6 lg:col-span-1">

                    {/* Booking Card */}
                    <BookingCard
                      venue={selectedVenue}
                      selectedPackage={selectedPackage}
                      setSelectedPackage={setSelectedPackage}
                      availability={availability}
                    />

                    {/* Hosted By */}
                    <HostedBy
                      vendor={selectedVenue.vendorId}
                    />

                    {/* Cancellation Policy */}
                    <CancellationPolicy />

                  </div>
                </div>

                {/* ======================================
                    SIMILAR VENUES
                ====================================== */}
                <SimilarVenues
                  venues={similarVenues}
                  currentVenueId={selectedVenue._id}
                />

              </div>
            </>
          )}
        </div>
      </main>

      {/* ======================================
          FOOTER
      ====================================== */}
      <Footer />
    </>
  );
}