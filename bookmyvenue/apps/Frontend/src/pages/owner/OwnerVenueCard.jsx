import { useNavigate } from "react-router-dom";


function OwnerVenueCard({ venue }) {

  const navigate = useNavigate();


  function getStatusStyle(status) {

    if (status === "active") {
      return "bg-green-50 text-green-700 border-green-200";
    }


    if (status === "rejected") {
      return "bg-red-50 text-red-700 border-red-200";
    }


    return "bg-yellow-50 text-yellow-700 border-yellow-200";

  }



  const image =
    venue.images && venue.images.length > 0
      ? venue.images[0].image_url || venue.images[0].url
      : null;



  return (

    <div
      className="
        overflow-hidden 
        rounded-2xl 
        border 
        border-gray-200 
        bg-white 
        shadow-sm 
        transition 
        hover:shadow-md
      "
    >


      {/* Image */}

      <div className="h-48 w-full bg-gray-100">

        {image ? (

          <img
            src={image}
            alt={venue.name}
            className="h-full w-full object-cover"
          />

        ) : (

          <div className="flex h-full items-center justify-center text-gray-400">

            No Image

          </div>

        )}

      </div>




      <div className="p-5">


        {/* Header */}

        <div className="flex items-start justify-between gap-3">


          <div>

            <h3 className="text-lg font-bold text-gray-900">

              {venue.name}

            </h3>


            <p className="mt-1 text-sm text-gray-500">

              {venue.city}

            </p>


          </div>



          <span
            className={`
              rounded-full 
              border 
              px-3 
              py-1 
              text-xs 
              font-semibold 
              capitalize
              ${getStatusStyle(venue.status)}
            `}
          >

            {venue.status || "pending"}

          </span>


        </div>





        {/* Details */}

        <div className="mt-5 grid grid-cols-2 gap-3">


          <div className="rounded-xl bg-gray-50 p-3">

            <p className="text-xs text-gray-500">
              Capacity
            </p>

            <p className="mt-1 font-bold text-gray-900">
              {venue.capacity}
            </p>

          </div>




          <div className="rounded-xl bg-gray-50 p-3">

            <p className="text-xs text-gray-500">
              Category
            </p>

            <p className="mt-1 font-bold text-gray-900">
              #{venue.category_id}
            </p>

          </div>


        </div>





        {/* Pricing */}

        <div className="mt-4 space-y-2">


          {venue.supports_hourly && (

            <div
              className="
                flex 
                justify-between 
                rounded-xl 
                bg-red-50 
                px-4 
                py-2
              "
            >

              <span className="text-sm text-gray-600">
                Hourly
              </span>


              <span className="font-bold text-red-600">

                ₹{venue.hourly_price}/hr

              </span>


            </div>

          )}





          {venue.supports_daily && (

            <div
              className="
                flex 
                justify-between 
                rounded-xl 
                bg-red-50 
                px-4 
                py-2
              "
            >

              <span className="text-sm text-gray-600">
                Daily
              </span>


              <span className="font-bold text-red-600">

                ₹{venue.daily_price}/day

              </span>


            </div>

          )}


        </div>






        {/* Actions */}

        <div className="mt-5 grid grid-cols-2 gap-3">


          <button

            onClick={() =>
              navigate(`/owner/venues/${venue.id}/manage`)
            }

            className="
              rounded-full 
              bg-red-600 
              px-4 
              py-2 
              text-sm 
              font-semibold 
              text-white
              transition
              hover:bg-red-700
            "

          >

            Manage Venue

          </button>





          <button

            onClick={() =>
              navigate(`/owner/venues/${venue.id}/availability`)
            }

            className="
              rounded-full 
              border 
              border-gray-300
              px-4
              py-2
              text-sm
              font-semibold
              text-gray-700
              transition
              hover:border-red-600
              hover:text-red-600
            "

          >

            Availability

          </button>





          <button

            onClick={() =>
              navigate(`/owner/venues/${venue.id}/bookings`)
            }

            className="
              rounded-full 
              border 
              border-gray-300
              px-4
              py-2
              text-sm
              font-semibold
              text-gray-700
              transition
              hover:border-red-600
              hover:text-red-600
            "

          >

            Bookings

          </button>





          <button

            onClick={() =>
              navigate(`/owner/venues/${venue.id}/edit`)
            }

            className="
              rounded-full 
              border 
              border-gray-300
              px-4
              py-2
              text-sm
              font-semibold
              text-gray-700
              transition
              hover:border-red-600
              hover:text-red-600
            "

          >

            Edit

          </button>



        </div>


      </div>


    </div>

  );

}


export default OwnerVenueCard;