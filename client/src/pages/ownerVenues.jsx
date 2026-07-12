import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getOwnerVenues } from "../services/ownerVenueService";
import { usePageTitle } from "../hooks/usePageTitle";

function OwnerVenues() {
  usePageTitle("My Venues");
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadVenues = async () => {
      try {
        const result = await getOwnerVenues();

        if (isMounted) {
          setVenues(result.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to fetch your venues");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadVenues();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f5] flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading your venues...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#faf7f5] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#4a1625]">
              My Venues
            </h1>
            <p className="text-gray-500 mt-2">
              View the venues you submitted and track approval status.
            </p>
          </div>

          <Link
            to="/owner/venues/new"
            className="inline-flex justify-center px-6 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-[#8b1e2d] to-[#4a1625] hover:shadow-lg transition"
          >
            + Submit New Venue
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {venues.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-gray-500">You have not submitted any venues yet.</p>

            <Link
              to="/owner/venues/new"
              className="inline-flex mt-5 px-6 py-3 rounded-xl text-white font-medium bg-[#8b1e2d] hover:bg-[#6f1824] transition"
            >
              Submit Your First Venue
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <div
                key={venue._id}
                className="bg-white rounded-3xl shadow overflow-hidden"
              >
                <img
                  src={venue.images?.[0] || "/placeholder-venue.jpg"}
                  alt={venue.name}
                  className="w-full h-52 object-cover"
                />

                <div className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      {venue.name}
                    </h2>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${venue.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : venue.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {formatStatus(venue.status)}
                    </span>
                  </div>

                  <p className="text-gray-500 mt-3">
                    {venue.town}, {venue.district}
                  </p>

                  <p className="text-gray-500 mt-2">
                    Category: {venue.category}
                  </p>

                  <p className="text-[#8b1e2d] font-semibold mt-4">
                    ₹{venue.pricing?.basePrice}
                  </p>

                  <p className="text-gray-500 mt-2">
                    Capacity: Up to {venue.capacity} Guests
                  </p>

                  <div className="mt-5 flex gap-3">
                  <Link
                    to={`/owner/venues/${venue._id}/edit`}
                    className="flex-1 text-center px-4 py-2 rounded-xl bg-[#8b1e2d] text-white hover:bg-[#6f1824] transition"
                  >
                    Edit
                  </Link>

                  {venue.status === "approved" && (
                    <Link
                      to={`/venues/${venue._id}`}
                      className="flex-1 text-center px-4 py-2 rounded-xl border border-[#8b1e2d] text-[#8b1e2d] hover:bg-red-50 transition"
                    >
                      View Public
                    </Link>
                  )}
                </div>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default OwnerVenues;