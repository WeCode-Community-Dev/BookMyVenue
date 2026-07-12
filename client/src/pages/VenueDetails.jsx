import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  MapPin,
  Star,
  Users,
  Wifi,
  Car,
  Music,
  Camera,
  Phone,
  Mail,
} from "lucide-react";

import { getVenueById } from "../services/venueService.js";
import { usePageTitle } from "../hooks/usePageTitle.js";

function VenueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  usePageTitle(venue ? venue.name : "Venue Details");
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getVenueById(id);

        setVenue(result.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch venue");
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading venue...</p>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          {error || "Venue Not Found"}
        </h1>
      </div>
    );
  }

  const mainImage = venue.images?.[0] || "/placeholder-venue.jpg";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative">
        <img
          src={mainImage}
          alt={venue.name}
          className="w-full h-[420px] object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-6 pb-10 text-white">
            <h1 className="text-5xl font-bold">{venue.name}</h1>

            <div className="flex flex-wrap gap-6 mt-4 text-lg">
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                {venue.town}, {venue.district}
              </div>

              {venue.rating && (
                <div className="flex items-center gap-2">
                  <Star size={18} fill="#FFD700" color="#FFD700" />
                  {venue.rating}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-bold mb-4">About Venue</h2>

            <p className="text-gray-600 leading-8">
              {venue.description}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-bold mb-6">Amenities</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center">
                <Wifi className="text-red-700" />
                <p className="mt-2 text-sm">Wi-Fi</p>
              </div>

              <div className="flex flex-col items-center">
                <Car className="text-red-700" />
                <p className="mt-2 text-sm">Parking</p>
              </div>

              <div className="flex flex-col items-center">
                <Music className="text-red-700" />
                <p className="mt-2 text-sm">Music</p>
              </div>

              <div className="flex flex-col items-center">
                <Camera className="text-red-700" />
                <p className="mt-2 text-sm">Photography</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3 mt-8">
              {venue.amenities?.map((item) => (
                <div key={item} className="bg-gray-100 rounded-lg px-4 py-3">
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-bold mb-6">Gallery</h2>

            <div className="grid grid-cols-2 gap-4">
              {venue.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${venue.name} gallery ${index + 1}`}
                  className="rounded-xl h-56 w-full object-cover hover:scale-105 transition"
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
            <h2 className="text-4xl font-bold text-red-700">
              ₹{venue.pricing?.basePrice}
              <span className="text-lg text-gray-500">
                /{venue.pricing?.pricingModel?.replace("per_", "") || "event"}
              </span>
            </h2>

            <div className="mt-8 space-y-5">
              <div className="flex items-center gap-3">
                <Users className="text-red-700" />
                Capacity: Up to {venue.capacity} Guests
              </div>

              {venue.contactInfo?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="text-red-700" />
                  {venue.contactInfo.phone}
                </div>
              )}

              {venue.contactInfo?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="text-red-700" />
                  {venue.contactInfo.email}
                </div>
              )}
            </div>

            <button
              onClick={() => navigate(`/booking/${venue._id}`)}
              className="mt-8 w-full bg-red-700 text-white py-4 rounded-xl hover:bg-red-800 transition"
            >
              Send Booking Inquiry
            </button>

            <button className="mt-4 w-full border border-red-700 text-red-700 py-4 rounded-xl hover:bg-red-50 transition">
              Contact Owner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VenueDetails;