import { ROUTES } from "../../../shared/constants/routes";
import { useNavigate } from "react-router-dom";

const typeConfig = {
   AUDITORIUM: { color: "#EDE9FE" },
   BANQUET_HALL: { color: "#DBEAFE" },
   CAFE: { color: "#FEF3C7" },
   RESTAURANT: { color: "#FFE4E6" },
   CONFERENCE_ROOM: { color: "#DCFCE7" },
   STUDIO: { color: "#FCE7F3" },
   OUTDOOR_SPACE: { color: "#ECFCCB" },
   OTHER: { color: "#F1F5F9" },
};

const VenueCard = ({ venue }) => {
   const navigate = useNavigate();

   const { color } =
      typeConfig[venue.type] ?? {
         color: "#F3F4F6",
      };

   return (
      <div className="venue-card">
         <div
            className="
               h-[180px]
               sm:h-[200px]
               relative
            "
            style={{ background: color }}
         >
            {venue.images?.length > 0 ? (
               <img
                  src={venue.images[0]}
                  alt={venue.name}
                  className="
                     w-full
                     h-full
                     object-cover
                  "
               />
            ) : (
               <div className="w-full h-full bg-gray-100" />
            )}

            <div
               className="
                  absolute
                  top-3.5
                  left-3.5
                  bg-white
                  rounded-lg
                  px-2.5
                  py-1
                  text-xs
                  font-bold
               "
            >
               {venue.type}
            </div>
         </div>

         <div className="px-5 pt-5 pb-6">
            <h3 className="font-bold">
               {venue.name}
            </h3>

            <p className="text-gray-400">
               📍 {venue.city || venue.address}
            </p>

            <div className="flex justify-between items-center mt-4">
               <div>
                  <span className="font-bold">
                     {venue.price
                        ? `${venue.currency ?? "INR"} ${venue.price}`
                        : "Price TBD"}
                  </span>

                  <span className="text-gray-400 text-sm">
                     {" "}
                     / day
                  </span>
               </div>

               <button
                  onClick={() =>
                     navigate(
                        `${ROUTES.VENUES}/${venue.id}`
                     )
                  }
                  className="btn-primary"
               >
                  View Details
               </button>
            </div>
         </div>
      </div>
   );
};

export default VenueCard;