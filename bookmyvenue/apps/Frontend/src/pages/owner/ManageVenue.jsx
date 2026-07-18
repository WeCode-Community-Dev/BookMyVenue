import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Loading from "../../components/common/Loading";

import { useAuth } from "../../context/AuthContext";

import {
  getMyVenues,
  deleteVenue,
} from "../../api/venues";

function ManageVenue() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVenues();
  }, []);

  async function loadVenues() {
    try {
      setLoading(true);

      const data = await getMyVenues(token);

      setVenues(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
      alert("Deletion is not available yet.");
    }

  if (loading) {
    return <Loading message="Loading venues..." />;
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-10">

          <div className="mb-8 flex items-center justify-between">

            <h1 className="text-3xl font-bold">
              My Venues
            </h1>

            <button
              onClick={() =>
                navigate("/owner/create-venue")
              }
              className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
            >
              Create Venue
            </button>

          </div>

          {venues.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center shadow">
              <p className="text-gray-500">
                No venues found.
              </p>
            </div>
          ) : (
            <div className="space-y-5">

              {venues.map((venue) => (
                <div
                  key={venue.id}
                  className="rounded-xl bg-white p-5 shadow"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>
                      <h2 className="text-xl font-semibold">
                        {venue.name}
                      </h2>

                      <p className="text-gray-500">
                        {venue.city}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">

                      <button
                        onClick={() =>
                          navigate(`/owner/edit-venue/${venue.id}`)
                        }
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/owner/availability/${venue.id}`)
                        }
                        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                      >
                        Availability
                      </button>

                      <button
                        onClick={() =>
                          navigate("/owner/bookings")
                        }
                        className="rounded bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
                      >
                        Bookings
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(venue.id)
                        }
                        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default ManageVenue;