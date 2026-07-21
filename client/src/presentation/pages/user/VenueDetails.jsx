import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Header from "@/presentation/components/common/Header";
import Footer from "@/presentation/components/common/Footer";

import { getVenueById } from "@/redux/slices/UserVenueSlice";

export default function VenueDetails() {
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
              <h1 className="text-3xl font-bold">
                {selectedVenue.name}
              </h1>

              <p className="text-gray-500 mt-2">
                📍 {selectedVenue.address?.city},{" "}
                {selectedVenue.address?.state}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-6">
                {selectedVenue.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={selectedVenue.name}
                    className="w-full h-72 object-cover rounded-2xl"
                  />
                ))}
              </div>

              <div className="bg-white rounded-2xl p-6 mt-8">
                <h2 className="text-2xl font-bold mb-4">
                  About this venue
                </h2>

                <p className="text-gray-600">
                  {selectedVenue.description}
                </p>
              </div>
            </>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}