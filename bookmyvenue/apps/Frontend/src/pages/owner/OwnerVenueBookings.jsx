import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


import { useAuth } from "../../context/AuthContext";


import {
    getVenueById
} from "../../api/venues";


import {
    getOwnerBookings,
    updateBookingStatus
} from "../../api/bookings";


import OwnerHeader from "../../pages/owner/OwnerHeader";





function OwnerVenueBookings() {


    const { id } = useParams();


    const { token } = useAuth();




    const [venue, setVenue] = useState(null);

    const [bookings, setBookings] = useState([]);



    const [loading, setLoading] = useState(true);


    const [updatingId, setUpdatingId] = useState(null);



    const [error, setError] = useState("");






    async function loadPage(){


        try{


            setLoading(true);



            const venueData =
                await getVenueById(id);



            setVenue(venueData);





            const bookingData =
                await getOwnerBookings(token);



            const venueBookings =
                bookingData.filter(
                    booking =>
                    booking.venue_id === Number(id)
                );



            setBookings(
                venueBookings
            );



        }
        catch(err){


            setError(
                err.response?.data?.detail ||
                "Failed to load bookings"
            );


        }
        finally{


            setLoading(false);


        }


    }








    useEffect(()=>{


        loadPage();


    }, []);








    async function handleStatusUpdate(
        bookingId,
        status
    ){


        try{


            setUpdatingId(bookingId);



            await updateBookingStatus(
                bookingId,
                status,
                token
            );



            await loadPage();



        }
        catch(err){


            setError(
                err.response?.data?.detail ||
                "Failed to update booking"
            );


        }
        finally{


            setUpdatingId(null);


        }


    }








    function getStatusStyle(status){


        if(status==="confirmed"){

            return `
                bg-green-50
                text-green-700
                border-green-200
            `;

        }



        if(status==="rejected"){

            return `
                bg-red-50
                text-red-700
                border-red-200
            `;

        }



        return `
            bg-yellow-50
            text-yellow-700
            border-yellow-200
        `;


    }








    if(loading){


        return (

            <div className="min-h-screen bg-gray-50">

                <OwnerHeader />


                <div className="
                    flex
                    h-[60vh]
                    items-center
                    justify-center
                ">

                    Loading bookings...

                </div>


            </div>

        );

    }









    return (

        <div className="min-h-screen bg-gray-50">


            <OwnerHeader />



            <main className="
                mx-auto
                max-w-6xl
                px-6
                py-10
            ">




                {/* Header */}


                <div className="mb-8">


                    <h1 className="
                        text-3xl
                        font-bold
                    ">

                        Booking Requests

                    </h1>



                    <p className="
                        mt-2
                        text-gray-600
                    ">

                        {venue?.name}

                    </p>


                </div>







                {
                    error && (

                    <div className="
                        mb-6
                        rounded-xl
                        bg-red-50
                        p-4
                        text-red-700
                    ">

                        {error}

                    </div>

                )}









                {
                    bookings.length === 0 ?


                    (

                    <div className="
                        rounded-2xl
                        bg-white
                        p-10
                        text-center
                        shadow-sm
                    ">


                        <h2 className="
                            text-xl
                            font-bold
                        ">

                            No bookings yet

                        </h2>



                        <p className="
                            mt-2
                            text-gray-500
                        ">

                            Booking requests for this venue will appear here.

                        </p>


                    </div>


                    )

                    :



                    (

                    <div className="space-y-6">


                    {
                        bookings.map(
                            booking => (

                            <div
                                key={booking.id}
                                className="
                                    rounded-2xl
                                    bg-white
                                    p-6
                                    shadow-sm
                                "
                            >





                                <div className="
                                    flex
                                    flex-wrap
                                    justify-between
                                    gap-4
                                ">



                                    <div>


                                        <h3 className="
                                            text-lg
                                            font-bold
                                        ">

                                            Booking #{booking.id}

                                        </h3>




                                        <p className="
                                            mt-2
                                            text-sm
                                            text-gray-600
                                        ">

                                            Booker ID:
                                            {" "}
                                            {booking.booker_id}

                                        </p>



                                    </div>







                                    <span
                                        className={`
                                            rounded-full
                                            border
                                            px-4
                                            py-2
                                            text-sm
                                            font-semibold
                                            capitalize
                                            ${getStatusStyle(
                                                booking.status
                                            )}
                                        `}
                                    >

                                        {booking.status}

                                    </span>



                                </div>









                                <div className="
                                    mt-6
                                    grid
                                    gap-4
                                    sm:grid-cols-2
                                    lg:grid-cols-4
                                ">



                                    <InfoBox
                                        title="Type"
                                        value={
                                            booking.booking_type
                                        }
                                    />



                                    <InfoBox
                                        title="Total Amount"
                                        value={
                                            `₹${booking.total_amount}`
                                        }
                                    />



                                    <InfoBox
                                        title="Payment"
                                        value={
                                            booking.payment_status ||
                                            "Pending"
                                        }
                                    />



                                    <InfoBox
                                        title="Created"
                                        value={
                                            new Date(
                                                booking.created_at
                                            )
                                            .toLocaleDateString()
                                        }
                                    />


                                </div>








                                {
                                    booking.status==="pending" && (

                                    <div className="
                                        mt-6
                                        flex
                                        gap-3
                                    ">



                                        <button

                                            disabled={
                                                updatingId===booking.id
                                            }

                                            onClick={() =>
                                                handleStatusUpdate(
                                                    booking.id,
                                                    "confirmed"
                                                )
                                            }

                                            className="
                                                rounded-full
                                                bg-green-600
                                                px-5
                                                py-2
                                                text-white
                                                disabled:opacity-50
                                            "

                                        >

                                            Confirm

                                        </button>







                                        <button

                                            disabled={
                                                updatingId===booking.id
                                            }

                                            onClick={() =>
                                                handleStatusUpdate(
                                                    booking.id,
                                                    "rejected"
                                                )
                                            }

                                            className="
                                                rounded-full
                                                bg-red-600
                                                px-5
                                                py-2
                                                text-white
                                                disabled:opacity-50
                                            "

                                        >

                                            Reject

                                        </button>


                                    </div>

                                )}





                            </div>

                        )

                    )}


                    </div>

                    )

                }



            </main>


        </div>

    );


}








function InfoBox({
    title,
    value
}){


    return (

        <div className="
            rounded-xl
            bg-gray-50
            p-4
        ">

            <p className="
                text-xs
                text-gray-500
            ">

                {title}

            </p>


            <p className="
                mt-1
                font-semibold
                capitalize
            ">

                {value}

            </p>


        </div>

    );

}



export default OwnerVenueBookings;