import { useParams, useNavigate } from "react-router-dom";
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

import venues from "../data/venues";

function VenueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const venue = venues.find((v) => v.id === Number(id));

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Venue Not Found</h1>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Image */}
      <div className="relative">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-[420px] object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-6 pb-10 text-white">
            <h1 className="text-5xl font-bold">{venue.name}</h1>

            <div className="flex flex-wrap gap-6 mt-4 text-lg">
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                {venue.location}
              </div>

              <div className="flex items-center gap-2">
                <Star size={18} fill="#FFD700" color="#FFD700" />
                {venue.rating} ({venue.reviews} Reviews)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-8">

        {/* Left */}
        <div className="lg:col-span-2 space-y-8">

          {/* About */}
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-bold mb-4">About Venue</h2>

            <p className="text-gray-600 leading-8">
              {venue.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-bold mb-6">
              Amenities
            </h2>

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
              {venue.amenities.map((item) => (
                <div
                  key={item}
                  className="bg-gray-100 rounded-lg px-4 py-3"
                >
                  ✓ {item}
                </div>
              ))}
            </div>

          </div>

          {/* Gallery */}
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-bold mb-6">
              Gallery
            </h2>

            <div className="grid grid-cols-2 gap-4">

              {venue.gallery.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  className="rounded-xl h-56 w-full object-cover hover:scale-105 transition"
                />
              ))}

            </div>

          </div>

        </div>

        {/* Right */}
        <div>

          <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">

            <h2 className="text-4xl font-bold text-red-700">
              ₹{venue.price}
              <span className="text-lg text-gray-500">
                /hour
              </span>
            </h2>

            <div className="mt-8 space-y-5">

              <div className="flex items-center gap-3">
                <Users className="text-red-700" />
                Capacity: {venue.capacity} Guests
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-red-700" />
                {venue.phone}
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-red-700" />
                {venue.email}
              </div>

            </div>

            <button
              onClick={() => navigate(`/booking/${venue.id}`)}
              className="mt-8 w-full bg-red-700 text-white py-4 rounded-xl hover:bg-red-800 transition"
            >
              Book Now
            </button>

            <button
              className="mt-4 w-full border border-red-700 text-red-700 py-4 rounded-xl hover:bg-red-50 transition"
            >
              Contact Owner
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default VenueDetails;