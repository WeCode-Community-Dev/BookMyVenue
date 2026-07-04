import { MapPin, Star, Users, Wifi, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";

const venues = [
  {
    id: 1,
    name: "The Roastery Loft",
    category: "Cafe",
    location: "Koramangala, Bangalore",
    price: 450,
    rating: 4.9,
    capacity: 40,
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Spotlight Auditorium",
    category: "Auditorium",
    location: "Andheri West, Mumbai",
    price: 2400,
    rating: 4.8,
    capacity: 320,
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Skyline Boardroom",
    category: "Conference",
    location: "Cyber Hub, Gurgaon",
    price: 800,
    rating: 4.7,
    capacity: 18,
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Garden Bliss",
    category: "Outdoor",
    location: "Kochi",
    price: 1500,
    rating: 4.9,
    capacity: 120,
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Urban Workspace",
    category: "Coworking",
    location: "Bangalore",
    price: 650,
    rating: 4.6,
    capacity: 25,
    image:
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Royal Banquet",
    category: "Hall",
    location: "Thrissur",
    price: 3500,
    rating: 4.8,
    capacity: 300,
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80",
  },
];

export default function VenuePage() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#faf8f5] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        <p className="uppercase tracking-[4px] text-[#8b1e2d] text-sm font-semibold">
          Featured Venues
        </p>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2 mb-10">
          <h1 className="text-5xl font-serif font-semibold text-gray-900">
            Loved by the <span className="text-[#8b1e2d]">community</span>
          </h1>

          <div className="flex flex-wrap gap-3 mt-6 md:mt-0">
            {["All", "Cafes", "Auditoriums", "Outdoor", "Coworking"].map(
              (item, index) => (
                <button
                  key={index}
                  className={`px-5 py-2 rounded-full border transition ${
                    index === 0
                      ? "bg-gray-900 text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-2 duration-300"
            >
              <div className="relative">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-64 object-cover"
                />

                <span className="absolute top-4 left-4 bg-white px-4 py-1 rounded-full text-xs font-semibold">
                  {venue.category}
                </span>

                <span className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold">
                  <Star size={14} fill="red" className="text-red-500" />
                  {venue.rating}
                </span>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-xl">{venue.name}</h2>

                  <span className="font-semibold text-[#8b1e2d]">
                    ₹{venue.price}/hr
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-500 mt-3">
                  <MapPin size={16} />
                  {venue.location}
                </div>

                <div className="flex justify-between items-center mt-6">
                  <div className="flex gap-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      {venue.capacity}
                    </div>

                    <Wifi size={16} />
                    <Coffee size={16} />
                  </div>

                  <button
                    onClick={() => navigate(`/venue/${venue.id}`)}
                    className="bg-red-700 text-white px-5 py-2 rounded-lg hover:bg-red-800 transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}