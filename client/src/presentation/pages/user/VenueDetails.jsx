import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import VenueReviews from "@/presentation/components/user/venueDetails/VenueReviews";
import Header from "@/presentation/components/common/Header";
import Footer from "@/presentation/components/common/Footer";
import VenueAmenities from "@/presentation/components/user/venueDetails/VenueAmenities";
import VenueGallery from "@/presentation/components/user/venueDetails/VenueGallery";
import VenueHeader from "@/presentation/components/user/venueDetails/VenueHeader";
import VenueAbout from "@/presentation/components/user/venueDetails/VenueAbout";
import { getVenueById } from "@/redux/slices/UserVenueSlice";
import { fetchAvailability } from "@/redux/slices/UserBookingSlice";
import BookingCard from "@/presentation/components/user/venueDetails/BookingCard";
import SimilarVenues from "@/presentation/components/user/venueDetails/SimilarVenues";
import VenueAvailability from "@/presentation/components/user/venueDetails/VenueAvailability";
import HostedBy from "@/presentation/components/user/venueDetails/HostedBy";
import { similarVenues } from "@/constants/mockVenues";
import CancellationPolicy from "@/presentation/components/user/venueDetails/CancellationPolicy";

export default function VenueDetails() {
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [availability, setAvailability] = useState({
    eventDate: "",
    startTime: "",
    endTime: "",
    guestCount: "",
  });
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    selectedVenue,
    loading,
    error,
  } = useSelector((state) => state.userVenue);

  useEffect(() => {
    if (id) {
      dispatch(getVenueById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
  if (id) {
    dispatch(
      fetchAvailability({
        venueId: id,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      })
    );
  }
}, [dispatch, id]);

const {
  availabilityData,
} = useSelector(
  (state) => state.userBooking
);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6">

          {loading && (
            <div className="p-10 text-center">
              Loading venue...
            </div>
          )}

          {error && (
            <div className="p-10 text-center text-red-500">
              {error}
            </div>
          )}

          {!loading && !error && !selectedVenue && (
            <div className="p-10 text-center">
              Venue not found
            </div>
          )}

          {!loading && !error && selectedVenue && (
          <>
            <VenueHeader venue={selectedVenue} />

            <VenueGallery venue={selectedVenue} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

                <div className="lg:col-span-2">
                  <VenueAbout description={selectedVenue.description} />
                  <VenueAmenities amenities={selectedVenue.amenities} />
                  <VenueAvailability venue={selectedVenue}
                  availability={availabilityData} 
                  onAvailabilityChange={setAvailability} />
                  <VenueReviews rating={selectedVenue.rating} 
                    reviews={selectedVenue.reviews} />
                  <HostedBy
                    vendor={selectedVenue.vendorId}
                  />
                  <CancellationPolicy />

 
                </div>

                <BookingCard venue={selectedVenue} selectedPackage={selectedPackage}
                availability={availability} />

              </div>
              <SimilarVenues venues={similarVenues} />
          </>
        )}       

      </div>
    </main>

    <Footer />
  </>
  );
}