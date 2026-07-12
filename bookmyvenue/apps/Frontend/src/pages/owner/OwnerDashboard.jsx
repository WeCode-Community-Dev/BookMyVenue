// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { useAuth } from "../../context/AuthContext";
// import { getMyVenues } from "../../api/venues";
// import { getOwnerBookings, updateBookingStatus } from "../../api/bookings";

// function OwnerDashboard() {
//   const navigate = useNavigate();
//   const { token } = useAuth();

//   const [venues, setVenues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [bookings, setBookings] = useState([]);
//   const [bookingLoading, setBookingLoading] = useState(true);
//   const [bookingError, setBookingError] = useState("");

//   useEffect(() => {
//     async function loadMyVenues() {
//       try {
//         const data = await getMyVenues(token);
//         if (Array.isArray(data)) setVenues(data);
//         else if (Array.isArray(data?.venues)) setVenues(data.venues);
//         else setVenues([]);
//       } catch (err) {
//         setError(err.response?.data?.detail || "Failed to load your venues");
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (token) {
//       loadMyVenues();
//       loadBookings();
//     }
//   }, [token]);

//   async function loadBookings() {
//     try {
//       setBookingLoading(true);
//       setBookingError("");
//       const data = await getOwnerBookings(token);
//       setBookings(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setBookingError(err.response?.data?.detail || "Failed to load bookings");
//     } finally {
//       setBookingLoading(false);
//     }
//   }

//   async function handleBookingStatus(id, status) {
//     try {
//       await updateBookingStatus(id, status, token);
//       loadBookings();
//     } catch (err) {
//       alert(err.response?.data?.detail || "Failed to update booking");
//     }
//   }

//   function getStatusStyle(status) {
//     if (status === "confirmed")
//       return "bg-green-50 text-green-700 border border-green-200";
//     if (status === "rejected")
//       return "bg-red-50 text-red-700 border border-red-200";
//     return "bg-amber-50 text-amber-700 border border-amber-200";
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="h-10 w-10 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
//         <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
//           <h1
//             className="text-2xl font-extrabold text-red-600 cursor-pointer tracking-tight"
//             onClick={() => navigate("/")}
//           >
//             BookMyVenue
//           </h1>
//           <button
//             onClick={() => navigate("/owner/create-venue")}
//             className="rounded-full bg-red-600 hover:bg-red-700 transition text-white font-semibold px-5 py-2.5 text-sm shadow-sm"
//           >
//             + List a Venue
//           </button>
//         </div>
//       </header>

//       <div className="max-w-6xl mx-auto px-6 py-10">
//         {/* Title */}
//         <div className="mb-8">
//           <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
//             Owner Dashboard
//           </h2>
//           <p className="mt-2 text-gray-600">
//             Manage your venues and respond to booking requests.
//           </p>
//         </div>

//         {error && (
//           <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
//             {error}
//           </div>
//         )}

//         {/* My Venues */}
//         <section>
//           <div className="flex items-center justify-between mb-5">
//             <h3 className="text-xl font-bold text-gray-900">My Venues</h3>
//             {venues.length > 0 && (
//               <span className="text-sm text-gray-500">
//                 {venues.length} listed
//               </span>
//             )}
//           </div>

//           {!error && venues.length === 0 ? (
//             <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
//               <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">
//                 <svg className="h-7 w-7 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//                 </svg>
//               </div>
//               <p className="text-gray-700 font-medium">
//                 You have no venues listed yet
//               </p>
//               <p className="text-gray-500 text-sm mt-1">
//                 Start earning by listing your first venue.
//               </p>
//               <button
//                 onClick={() => navigate("/owner/create-venue")}
//                 className="mt-5 rounded-full bg-red-600 hover:bg-red-700 transition text-white font-semibold px-6 py-2.5 text-sm shadow-sm"
//               >
//                 List a Venue
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               {venues.map((venue) => (
//                 <div
//                   key={venue.id}
//                   className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
//                 >
//                   <div className="flex items-start justify-between gap-3">
//                     <h4 className="text-lg font-bold text-gray-900">
//                       {venue.name}
//                     </h4>
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         venue.status === "approved"
//                           ? "bg-green-50 text-green-700 border border-green-200"
//                           : venue.status === "rejected"
//                           ? "bg-red-50 text-red-700 border border-red-200"
//                           : "bg-amber-50 text-amber-700 border border-amber-200"
//                       }`}
//                     >
//                       {venue.status || "pending"}
//                     </span>
//                   </div>

//                   <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
//                     <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                     {venue.city}
//                   </p>

//                   <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
//                     {venue.supports_hourly && (
//                       <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
//                         <p className="text-gray-500 text-xs">Hourly</p>
//                         <p className="font-bold text-red-600 text-base">
//                           ₹{venue.hourly_price}
//                         </p>
//                       </div>
//                     )}
//                     {venue.supports_daily && (
//                       <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
//                         <p className="text-gray-500 text-xs">Daily</p>
//                         <p className="font-bold text-red-600 text-base">
//                           ₹{venue.daily_price}
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   <button
//                     onClick={() => navigate(`/venues/${venue.id}`)}
//                     className="mt-5 w-full rounded-full border border-gray-300 hover:border-red-600 hover:text-red-600 transition text-gray-800 font-semibold px-4 py-2 text-sm"
//                   >
//                     View Details
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Booking Requests */}
//         <section className="mt-12">
//           <div className="flex items-center justify-between mb-5">
//             <h3 className="text-xl font-bold text-gray-900">Booking Requests</h3>
//             {bookings.length > 0 && (
//               <span className="text-sm text-gray-500">
//                 {bookings.length} total
//               </span>
//             )}
//           </div>

//           {bookingLoading && (
//             <div className="flex items-center gap-3 text-gray-600">
//               <div className="h-5 w-5 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
//               Loading bookings...
//             </div>
//           )}

//           {bookingError && (
//             <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
//               {bookingError}
//             </div>
//           )}

//           {!bookingLoading && !bookingError && bookings.length === 0 && (
//             <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
//               No booking requests yet
//             </div>
//           )}

//           <div className="mt-4 space-y-4">
//             {bookings.map((booking) => (
//               <div
//                 key={booking.id}
//                 className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
//               >
//                 <div className="flex flex-wrap items-start justify-between gap-5">
//                   <div className="flex-1 min-w-[240px]">
//                     <div className="flex items-center gap-3 flex-wrap">
//                       <h4 className="text-lg font-bold text-gray-900">
//                         Booking #{booking.id}
//                       </h4>
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
//                           booking.status
//                         )}`}
//                       >
//                         {booking.status}
//                       </span>
//                     </div>

//                     <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
//                       <div>
//                         <p className="text-gray-500 text-xs">Venue ID</p>
//                         <p className="font-semibold text-gray-900">
//                           {booking.venue_id}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-gray-500 text-xs">Booker ID</p>
//                         <p className="font-semibold text-gray-900">
//                           {booking.booker_id}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-gray-500 text-xs">Type</p>
//                         <p className="font-semibold text-gray-900 capitalize">
//                           {booking.booking_type}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-gray-500 text-xs">Total</p>
//                         <p className="font-bold text-red-600">
//                           ₹{booking.total_amount}
//                         </p>
//                       </div>
//                     </div>

//                     <p className="mt-4 text-xs text-gray-500">
//                       Created:{" "}
//                       {new Date(booking.created_at).toLocaleDateString()}
//                     </p>
//                   </div>

//                   <div>
//                     {booking.status === "pending" && (
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() =>
//                             handleBookingStatus(booking.id, "confirmed")
//                           }
//                           className="rounded-full bg-green-600 hover:bg-green-700 transition px-5 py-2 text-sm font-semibold text-white shadow-sm"
//                         >
//                           Confirm
//                         </button>
//                         <button
//                           onClick={() =>
//                             handleBookingStatus(booking.id, "rejected")
//                           }
//                           className="rounded-full bg-red-600 hover:bg-red-700 transition px-5 py-2 text-sm font-semibold text-white shadow-sm"
//                         >
//                           Reject
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

// export default OwnerDashboard;

import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";

import {
  getMyVenues,
} from "../../api/venues";

import {
  getOwnerBookings,
  updateBookingStatus,
} from "../../api/bookings";


import OwnerHeader from "../../pages/owner/OwnerHeader";
import OwnerVenueCard from "../../pages/owner/OwnerVenueCard";
import BookingRequestCard from "../../pages/owner/BookingRequestCard";
import DashboardStats from "../../pages/owner/DashboardStats";



function OwnerDashboard() {


  const { token } = useAuth();


  const [venues, setVenues] = useState([]);

  const [bookings, setBookings] = useState([]);


  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");



  const [bookingError, setBookingError] = useState("");

  const [updatingBookingId, setUpdatingBookingId] = useState(null);




  async function loadVenues() {

    try {

      const data = await getMyVenues(token);


      if (Array.isArray(data)) {

        setVenues(data);

      } else if (Array.isArray(data?.venues)) {

        setVenues(data.venues);

      } else {

        setVenues([]);

      }


    } catch (err) {


      setError(
        err.response?.data?.detail ||
        "Failed to load venues"
      );


    }

  }





  async function loadBookings() {


    try {


      const data = await getOwnerBookings(token);


      if (Array.isArray(data)) {

        setBookings(data);

      } else {

        setBookings([]);

      }



    } catch (err) {


      setBookingError(
        err.response?.data?.detail ||
        "Failed to load bookings"
      );


    }


  }





  async function handleBookingStatus(
    id,
    status
  ) {


    try {


      setUpdatingBookingId(id);


      await updateBookingStatus(
        id,
        status,
        token
      );


      await loadBookings();



    } catch (err) {


      setBookingError(
        err.response?.data?.detail ||
        "Failed to update booking"
      );


    } finally {


      setUpdatingBookingId(null);


    }


  }





  useEffect(() => {


    async function loadDashboard() {


      if (!token) {
        return;
      }


      try {


        setLoading(true);


        await Promise.all([
          loadVenues(),
          loadBookings(),
        ]);



      } finally {


        setLoading(false);


      }


    }


    loadDashboard();


  }, [token]);







  if (loading) {


    return (

      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-gray-50
        "
      >

        <div
          className="
            h-10
            w-10
            animate-spin
            rounded-full
            border-4
            border-red-600
            border-t-transparent
          "
        />

      </div>

    );


  }







  return (


    <div className="min-h-screen bg-gray-50">


      <OwnerHeader />



      <main
        className="
          mx-auto
          max-w-7xl
          px-6
          py-10
        "
      >




        {/* Page Title */}

        <div className="mb-8">


          <h1
            className="
              text-3xl
              font-extrabold
              text-gray-900
            "
          >

            Owner Dashboard

          </h1>



          <p
            className="
              mt-2
              text-gray-600
            "
          >

            Manage your venues, availability and booking requests.

          </p>


        </div>






        {error && (

          <div
            className="
              mb-6
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-700
            "
          >

            {error}

          </div>

        )}






        {/* Stats */}

        <section>


          <DashboardStats
            venues={venues}
            bookings={bookings}
          />


        </section>








        {/* Venues */}

        <section className="mt-12">


          <div
            className="
              mb-5
              flex
              items-center
              justify-between
            "
          >

            <h2
              className="
                text-2xl
                font-bold
                text-gray-900
              "
            >

              My Venues

            </h2>


            <p
              className="
                text-sm
                text-gray-500
              "
            >

              {venues.length} listed

            </p>


          </div>





          {venues.length === 0 ? (


            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-gray-300
                bg-white
                p-10
                text-center
              "
            >


              <h3
                className="
                  font-bold
                  text-gray-900
                "
              >

                You have no venues listed yet

              </h3>



              <p className="mt-2 text-gray-500">

                Create your first venue and start receiving bookings.

              </p>



            </div>


          ) : (


            <div
              className="
                grid
                grid-cols-1
                gap-6
                md:grid-cols-2
              "
            >

              {venues.map((venue) => (

                <OwnerVenueCard
                  key={venue.id}
                  venue={venue}
                />

              ))}


            </div>


          )}



        </section>









        {/* Booking Requests */}

        <section className="mt-12">


          <div
            className="
              mb-5
              flex
              items-center
              justify-between
            "
          >


            <h2
              className="
                text-2xl
                font-bold
                text-gray-900
              "
            >

              Booking Requests

            </h2>



            <p
              className="
                text-sm
                text-gray-500
              "
            >

              {bookings.length} requests

            </p>


          </div>





          {bookingError && (

            <div
              className="
                mb-5
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-700
              "
            >

              {bookingError}

            </div>

          )}







          {bookings.length === 0 ? (


            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-gray-300
                bg-white
                p-10
                text-center
                text-gray-500
              "
            >

              No booking requests yet

            </div>


          ) : (


            <div className="space-y-5">


              {bookings.map((booking) => (


                <BookingRequestCard

                  key={booking.id}

                  booking={booking}

                  onStatusUpdate={
                    handleBookingStatus
                  }

                  updatingBookingId={
                    updatingBookingId
                  }

                />


              ))}


            </div>


          )}



        </section>





      </main>


    </div>


  );


}


export default OwnerDashboard;
