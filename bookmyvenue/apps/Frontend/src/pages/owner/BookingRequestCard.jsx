function BookingRequestCard({
  booking,
  onStatusUpdate,
  updatingBookingId,
}) {


  function getStatusStyle(status) {

    if (status === "confirmed") {

      return "bg-green-50 text-green-700 border-green-200";

    }


    if (status === "rejected") {

      return "bg-red-50 text-red-700 border-red-200";

    }


    return "bg-yellow-50 text-yellow-700 border-yellow-200";

  }



  const isUpdating =
    updatingBookingId === booking.id;



  return (

    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-6
        shadow-sm
        transition
        hover:shadow-md
      "
    >


      <div className="flex flex-wrap justify-between gap-5">


        {/* Booking Details */}

        <div className="flex-1">


          <div className="flex items-center gap-3 flex-wrap">


            <h3 className="text-lg font-bold text-gray-900">

              Booking #{booking.id}

            </h3>



            <span
              className={`
                rounded-full
                border
                px-3
                py-1
                text-xs
                font-semibold
                capitalize
                ${getStatusStyle(booking.status)}
              `}
            >

              {booking.status}

            </span>


          </div>





          <div
            className="
              mt-5
              grid
              grid-cols-2
              gap-4
              sm:grid-cols-4
            "
          >


            <div>

              <p className="text-xs text-gray-500">
                Venue ID
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {booking.venue_id}
              </p>

            </div>





            <div>

              <p className="text-xs text-gray-500">
                Booker ID
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {booking.booker_id}
              </p>

            </div>





            <div>

              <p className="text-xs text-gray-500">
                Booking Type
              </p>

              <p className="mt-1 font-semibold capitalize text-gray-900">
                {booking.booking_type}
              </p>

            </div>





            <div>

              <p className="text-xs text-gray-500">
                Total Amount
              </p>

              <p className="mt-1 font-bold text-red-600">
                ₹{booking.total_amount}
              </p>

            </div>



          </div>





          <p className="mt-5 text-sm text-gray-500">

            Created At:{" "}

            {booking.created_at
              ? new Date(
                  booking.created_at
                ).toLocaleDateString()
              : "N/A"
            }

          </p>



        </div>






        {/* Actions */}

        <div className="flex items-start">


          {booking.status === "pending" && (

            <div className="flex gap-3">


              <button

                disabled={isUpdating}

                onClick={() =>
                  onStatusUpdate(
                    booking.id,
                    "confirmed"
                  )
                }

                className="
                  rounded-full
                  bg-green-600
                  px-5
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-green-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "

              >

                {isUpdating
                  ? "Updating..."
                  : "Confirm"
                }

              </button>





              <button

                disabled={isUpdating}

                onClick={() =>
                  onStatusUpdate(
                    booking.id,
                    "rejected"
                  )
                }

                className="
                  rounded-full
                  bg-red-600
                  px-5
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "

              >

                Reject

              </button>


            </div>

          )}


        </div>


      </div>





      {/* Additional Information */}

      <div
        className="
          mt-5
          border-t
          border-gray-100
          pt-4
        "
      >


        <p className="text-sm text-gray-600">

          Payment Status:{" "}

          <span className="font-semibold text-gray-900">

            {booking.payment_status || "Pending"}

          </span>

        </p>



      </div>


    </div>

  );

}


export default BookingRequestCard;