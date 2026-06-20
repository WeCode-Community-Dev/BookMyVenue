import { useEffect, useState } from "react";

import { fetchOwnerBookingsApi } from "../../bookings/api/bookings.api";

import BookingDetailsModal from "../components/BookingDetailsModal";

const OwnerBookingsPage = () => {
   const [bookings, setBookings] = useState([]);
   const [selectedBooking, setSelectedBooking] = useState(null);

   useEffect(() => {
      loadBookings();
   }, []);

   const loadBookings = async () => {
      try {
         const response = await fetchOwnerBookingsApi();

         setBookings(response.data || []);
      } catch (error) {
         console.error(error);
      }
   };

   return (
      <div>

         <h2 className="text-2xl font-bold mb-6">
            Bookings
         </h2>

         {bookings.length === 0 ? (

            <div className="border rounded-2xl p-8 text-center">

               <p className="text-gray-500">
                  No bookings yet.
               </p>

            </div>

         ) : (

            <div className="space-y-4">

               {bookings.map((booking) => (

                  <div
                     key={booking.id}
                     className="
                        border
                        rounded-xl
                        p-5
                        cursor-pointer
                        hover:shadow-md
                        transition
                     "
                     onClick={() =>
                        setSelectedBooking(booking)
                     }
                  >

                     <div className="flex justify-between">

                        <div>

                           <h3 className="font-semibold text-lg">
                              {booking.venue?.name}
                           </h3>

                           <p className="text-gray-500">
                              {booking.user?.name}
                           </p>

                        </div>

                        <span
                           className={`
                              px-3
                              py-1
                              rounded-full
                              text-sm
                              font-medium
                              ${
                                 booking.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : booking.status === "CONFIRMED"
                                    ? "bg-green-100 text-green-700"
                                    : booking.status === "REJECTED"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                              }
                           `}
                        >
                           {booking.status}
                        </span>

                     </div>

                  </div>

               ))}

            </div>

         )}

         {selectedBooking && (
            <BookingDetailsModal
               booking={selectedBooking}
               onClose={() =>
                  setSelectedBooking(null)
               }
               reloadBookings={loadBookings}
            />
         )}

      </div>
   );
};

export default OwnerBookingsPage;