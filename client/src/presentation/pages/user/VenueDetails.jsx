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
import BookingCard from "@/presentation/components/user/venueDetails/BookingCard";
import SimilarVenues from "@/presentation/components/user/venueDetails/SimilarVenues";
import VenuePricingPackages from "@/presentation/components/user/venueDetails/VenuePricingPackages";
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
                  <VenuePricingPackages selectedPackage={selectedPackage?.id} onPackageSelect={setSelectedPackage} />
                  <VenueAvailability venue={selectedVenue} onAvailabilityChange={setAvailability} />
                  <VenueReviews rating={selectedVenue.rating} 
                    reviews={selectedVenue.reviews} />
                  <HostedBy
                    vendor={selectedVenue.vendorId}
                  />
                  <CancellationPolicy />

 
                </div>

                <BookingCard venue={selectedVenue} selectedPackage={selectedPackage} />

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