import {
    updateVenueStatusApi,
 } from "../api/admin.api";
 
 const VenueReviewModal = ({
    venue,
    onClose,
    reloadVenues,
 }) => {
 
    const updateStatus =
       async (status) => {
 
          await updateVenueStatusApi(
             venue.id,
             status
          );
 
          await reloadVenues();
 
          onClose();
       };
 
    return (
 
       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
 
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
 
             <div className="flex justify-between mb-6">
 
                <h2 className="text-2xl font-bold">
                   Venue Details
                </h2>
 
                <button onClick={onClose}>
                   ✕
                </button>
 
             </div>
 
             <h3 className="text-xl font-bold mb-2">
                {venue.name}
             </h3>
 
             <p>{venue.type}</p>
             <p>{venue.city}</p>
             <p>{venue.address}</p>
 
             <div className="my-4">
                {venue.description}
             </div>
 
             <p>
                Capacity:
                {" "}
                {venue.capacity}
             </p>
 
             <p>
                Price:
                {" "}
                ₹{venue.price}
             </p>
 
             <div className="grid grid-cols-2 gap-4 mt-5">
 
                {venue.images?.map(
                   (image) => (
                      <img
                         key={image}
                         src={image}
                         alt=""
                         className="
                            h-40
                            w-full
                            object-cover
                            rounded-xl
                         "
                      />
                   )
                )}
 
             </div>
 
             {venue.status ===
                "PENDING" && (
 
                <div className="flex justify-end gap-3 mt-8">
 
                   <button
                      onClick={() =>
                         updateStatus(
                            "REJECTED"
                         )
                      }
                      className="
                         px-5
                         py-2
                         rounded-xl
                         bg-red-600
                         text-white
                      "
                   >
                      Reject
                   </button>
 
                   <button
                      onClick={() =>
                         updateStatus(
                            "APPROVED"
                         )
                      }
                      className="
                         px-5
                         py-2
                         rounded-xl
                         bg-green-600
                         text-white
                      "
                   >
                      Approve
                   </button>
 
                </div>
 
             )}
 
          </div>
 
       </div>
    );
 };
 
 export default VenueReviewModal;