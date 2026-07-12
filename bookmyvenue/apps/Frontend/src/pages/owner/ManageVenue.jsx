import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


import OwnerHeader from "../../pages/owner/OwnerHeader";

import {
    getVenueById
} from "../../api/venues";



function ManageVenue() {


    const { id } = useParams();

    const navigate = useNavigate();



    const [venue, setVenue] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");





    async function loadVenue() {


        try {


            const data =
                await getVenueById(id);


            setVenue(data);



        } catch(err) {


            setError(
                err.response?.data?.detail ||
                "Failed to load venue"
            );


        }
        finally {

            setLoading(false);

        }


    }





    useEffect(()=>{

        loadVenue();

    }, []);






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

                    Loading...

                </div>

            </div>

        );

    }





    if(error || !venue){

        return (

            <div className="min-h-screen bg-gray-50">

                <OwnerHeader />

                <div className="p-10 text-red-600">

                    {error || "Venue not found"}

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

                <div className="flex justify-between items-center">


                    <div>

                        <h1 className="
                            text-3xl
                            font-bold
                        ">

                            Manage Venue

                        </h1>


                        <p className="
                            mt-2
                            text-gray-600
                        ">

                            {venue.name}

                        </p>


                    </div>



                    <span className="
                        rounded-full
                        bg-green-100
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        text-green-700
                    ">

                        {venue.status}

                    </span>


                </div>









                <section className="
                    mt-8
                    grid
                    gap-8
                    lg:grid-cols-3
                ">



                    {/* Images */}


                    <div className="
                        rounded-2xl
                        bg-white
                        p-5
                        shadow-sm
                        lg:col-span-1
                    ">



                        <h2 className="
                            font-bold
                        ">

                            Images

                        </h2>




                        {
                            venue.images?.length > 0

                            ?

                            <div className="
                                mt-4
                                space-y-3
                            ">


                                {
                                    venue.images.map(
                                        image=>(

                                        <img

                                            key={image.id}

                                            src={
                                                image.image_url
                                            }

                                            alt={venue.name}

                                            className="
                                                h-40
                                                w-full
                                                rounded-xl
                                                object-cover
                                            "

                                        />

                                    ))

                                }


                            </div>


                            :

                            <div className="
                                mt-4
                                flex
                                h-40
                                items-center
                                justify-center
                                rounded-xl
                                bg-gray-100
                                text-gray-400
                            ">

                                No images

                            </div>

                        }


                    </div>







                    {/* Details */}

                    <div className="
                        rounded-2xl
                        bg-white
                        p-6
                        shadow-sm
                        lg:col-span-2
                    ">


                        <h2 className="
                            text-xl
                            font-bold
                        ">

                            Venue Information

                        </h2>




                        <div className="
                            mt-5
                            space-y-4
                        ">



                            <p>
                                <b>Name:</b>{" "}
                                {venue.name}
                            </p>




                            <p>
                                <b>Description:</b>{" "}
                                {venue.description}
                            </p>




                            <p>
                                <b>Location:</b>{" "}
                                {venue.address_line},
                                {" "}
                                {venue.city}
                                -
                                {" "}
                                {venue.pincode}
                            </p>




                            <p>
                                <b>Capacity:</b>{" "}
                                {venue.capacity} people
                            </p>



                        </div>





                        <div className="
                            mt-6
                            grid
                            gap-4
                            sm:grid-cols-2
                        ">



                            {
                                venue.supports_hourly && (

                                <div className="
                                    rounded-xl
                                    bg-red-50
                                    p-4
                                ">

                                    <p className="text-sm">
                                        Hourly Booking
                                    </p>


                                    <p className="
                                        mt-1
                                        font-bold
                                        text-red-600
                                    ">

                                        ₹{venue.hourly_price}/hr

                                    </p>


                                </div>

                            )}




                            {
                                venue.supports_daily && (

                                <div className="
                                    rounded-xl
                                    bg-red-50
                                    p-4
                                ">

                                    <p className="text-sm">
                                        Daily Booking
                                    </p>


                                    <p className="
                                        mt-1
                                        font-bold
                                        text-red-600
                                    ">

                                        ₹{venue.daily_price}/day

                                    </p>


                                </div>

                            )}



                        </div>








                        {/* Actions */}

                        <div className="
                            mt-8
                            flex
                            flex-wrap
                            gap-3
                        ">



                            <button

                                onClick={() =>
                                    navigate(
                                      `/owner/venues/${id}/availability`
                                    )
                                }

                                className="
                                    rounded-full
                                    bg-red-600
                                    px-5
                                    py-2
                                    text-white
                                "

                            >

                                Manage Availability

                            </button>





                            <button

                                onClick={() =>
                                    navigate(
                                      `/owner/venues/${id}/bookings`
                                    )
                                }

                                className="
                                    rounded-full
                                    border
                                    px-5
                                    py-2
                                "

                            >

                                View Bookings

                            </button>



                        </div>




                    </div>



                </section>




            </main>


        </div>

    );


}


export default ManageVenue;