import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Header from "@/presentation/components/common/Header";
import UserSidebar from "@/presentation/components/user/UserSidebar";
import VenueCard from "@/presentation/components/common/VenueCard";

import { getWishlist, removeWishlist } from "@/redux/slices/UserWishlistSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { wishlist, loading, error } = useSelector(
    (state) => state.userWishlist
  );

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const handleRemoveWishlist = async (venueId) => {
    try {
      await dispatch(removeWishlist(venueId)).unwrap();

      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error(error);
    }
  };

  if (loading) {
    return (
      <>
        <Header />

        <div className="flex">
          <UserSidebar />

          <main className="flex-1 flex items-center justify-center">
            <h2 className="text-lg font-medium text-gray-600">
              Loading Wishlist...
            </h2>
          </main>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />

        <div className="flex">
          <UserSidebar />

          <main className="flex-1 flex items-center justify-center">
            <h2 className="text-lg font-medium text-red-500">{error}</h2>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="flex">
        <UserSidebar />

        <main className="flex-1 bg-gray-50 p-10">
          <div className="bg-white rounded-3xl shadow-md p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">My Wishlist</h1>

                <p className="text-gray-500 mt-2">
                  Venues you love and want to book later
                </p>
              </div>

              <span className="bg-amber-100 text-amber-600 px-4 py-2 rounded-full font-medium">
                {wishlist.length} Venues
              </span>
            </div>

            {/* Empty Wishlist */}
            {wishlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="text-6xl mb-4">🤍</div>

                <h2 className="text-2xl font-semibold">
                  Your wishlist is empty
                </h2>

                <p className="text-gray-500 mt-2">
                  Save your favourite venues here.
                </p>

                <button
                  onClick={() => navigate("/user/venues")}
                  className="mt-8 rounded-xl bg-amber-500 px-8 py-3 font-semibold text-white transition hover:bg-amber-600"
                >
                  Browse Venues
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {wishlist.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    variant="wishlist"
                    isWishlisted={true}
                    showDescription={false}
                    onWishlistToggle={handleRemoveWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Wishlist;
