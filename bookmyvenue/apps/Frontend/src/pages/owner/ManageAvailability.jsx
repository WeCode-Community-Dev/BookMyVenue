import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
    createAvailability,
    getAvailability,
} from "../../api/availability";

import {
    getVenueById,
} from "../../api/venues";

import OwnerHeader from "../../pages/owner/OwnerHeader";



function ManageAvailability() {


    const { id } = useParams();

    const { token } = useAuth();



    const [venue, setVenue] = useState(null);



    const [date, setDate] = useState("");

    const [bookingType, setBookingType] = useState("");



    const [startTime, setStartTime] = useState("");

    const [endTime, setEndTime] = useState("");



    const [slots, setSlots] = useState([]);



    const [existingAvailability, setExistingAvailability] = useState([]);



    const [pageLoading, setPageLoading] = useState(true);

    const [loading, setLoading] = useState(false);



    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");





    function getToday() {

        return new Date()
            .toISOString()
            .split("T")[0];

    }






    function formatTime(time) {

        if (!time) {

            return "";

        }


        return time.slice(0, 5);

    }







    async function loadAvailability() {

        try {

            const data = await getAvailability(id);

            setExistingAvailability(data);


        } catch (err) {

            console.log(err);

        }

    }








    async function loadPage() {

        try {

            setPageLoading(true);



            const venueData =
                await getVenueById(id);



            setVenue(venueData);




            if (venueData.supports_hourly) {

                setBookingType("hourly");

            }
            else if (venueData.supports_daily) {

                setBookingType("daily");

            }




            await loadAvailability();



        }
        catch (err) {

            setError(
                err.response?.data?.detail ||
                "Failed to load venue"
            );

        }
        finally {

            setPageLoading(false);

        }

    }






    useEffect(() => {

        loadPage();

    }, []);









    function generateSlots() {


        if (!startTime || !endTime) {

            return;

        }



        const generated = [];



        let current = new Date(
            `2026-01-01T${startTime}`
        );



        const end = new Date(
            `2026-01-01T${endTime}`
        );




        while (current < end) {


            const next = new Date(current);



            next.setHours(
                next.getHours() + 1
            );



            if (next > end) {

                break;

            }




            generated.push({

                start_time:
                    current
                    .toTimeString()
                    .slice(0,5),


                end_time:
                    next
                    .toTimeString()
                    .slice(0,5)

            });




            current = next;


        }




        setSlots(generated);


    }









    async function handleSubmit() {


        try {


            setLoading(true);

            setError("");

            setSuccess("");




            const payload = {

                venue_id: Number(id),

                date,

                booking_type: bookingType,

            };





            if (bookingType === "hourly") {

                payload.slots = slots;

            }





            await createAvailability(
                payload,
                token
            );





            setSuccess(
                "Availability created successfully"
            );



            setDate("");

            setStartTime("");

            setEndTime("");

            setSlots([]);



            await loadAvailability();



        }
        catch(err) {


            setError(
                err.response?.data?.detail ||
                "Failed to create availability"
            );


        }
        finally {


            setLoading(false);


        }


    }







    const hourlyAvailability =
        existingAvailability.filter(
            item =>
                item.booking_type === "hourly"
        );



    const dailyAvailability =
        existingAvailability.filter(
            item =>
                item.booking_type === "daily"
        );









    if (pageLoading) {


        return (

            <div className="min-h-screen bg-gray-50">

                <OwnerHeader />

                <div className="
                    flex
                    h-[60vh]
                    items-center
                    justify-center
                    text-gray-600
                ">

                    Loading availability...

                </div>


            </div>

        );


    }









    return (

        <div className="min-h-screen bg-gray-50">


            <OwnerHeader />



            <main className="
                mx-auto
                max-w-7xl
                px-6
                py-10
            ">



                <div className="mb-8">


                    <h1 className="
                        text-3xl
                        font-bold
                        text-gray-900
                    ">

                        Manage Availability

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









                {/* CREATE CARD */}


                <section className="
                    rounded-2xl
                    bg-white
                    p-6
                    shadow-sm
                ">



                    <h2 className="
                        text-xl
                        font-bold
                    ">

                        Create Availability

                    </h2>





                    <div className="mt-6">


                        <label className="font-semibold">

                            Date

                        </label>



                        <input

                            type="date"

                            min={getToday()}

                            value={date}

                            onChange={(e)=>
                                setDate(e.target.value)
                            }

                            className="
                                mt-2
                                w-full
                                rounded-xl
                                border
                                p-3
                            "

                        />


                    </div>









                    <div className="mt-6">


                        <label className="font-semibold">

                            Booking Type

                        </label>



                        <div className="
                            mt-3
                            flex
                            gap-3
                        ">



                            {
                                venue.supports_hourly && (

                                <button

                                    onClick={()=>{
                                        setBookingType("hourly");
                                        setSlots([]);
                                    }}

                                    className={`
                                        rounded-full
                                        px-5
                                        py-2
                                        ${
                                            bookingType==="hourly"
                                            ?
                                            "bg-red-600 text-white"
                                            :
                                            "bg-gray-100"
                                        }
                                    `}

                                >

                                    Hourly

                                </button>

                            )}






                            {
                                venue.supports_daily && (

                                <button

                                    onClick={()=>{
                                        setBookingType("daily");
                                        setSlots([]);
                                    }}

                                    className={`
                                        rounded-full
                                        px-5
                                        py-2
                                        ${
                                            bookingType==="daily"
                                            ?
                                            "bg-red-600 text-white"
                                            :
                                            "bg-gray-100"
                                        }
                                    `}

                                >

                                    Daily

                                </button>

                            )}


                        </div>


                    </div>









                    {
                        bookingType==="hourly" && (

                        <div className="mt-6">


                            <div className="
                                grid
                                grid-cols-2
                                gap-4
                            ">


                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e)=>
                                        setStartTime(e.target.value)
                                    }
                                    className="
                                        rounded-xl
                                        border
                                        p-3
                                    "
                                />



                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e)=>
                                        setEndTime(e.target.value)
                                    }
                                    className="
                                        rounded-xl
                                        border
                                        p-3
                                    "
                                />


                            </div>




                            <button

                                onClick={generateSlots}

                                className="
                                    mt-4
                                    rounded-full
                                    bg-gray-900
                                    px-5
                                    py-2
                                    text-white
                                "

                            >

                                Generate Slots

                            </button>



                        </div>

                    )}









                    {
                        slots.length > 0 && (

                        <div className="mt-6">


                            <h3 className="font-bold">

                                Generated Slots

                            </h3>


                            <div className="
                                mt-3
                                grid
                                gap-3
                                sm:grid-cols-3
                            ">


                                {
                                    slots.map(
                                        (slot,index)=>(

                                        <div

                                            key={index}

                                            className="
                                                rounded-xl
                                                bg-gray-100
                                                p-3
                                                text-center
                                            "

                                        >

                                            {slot.start_time}
                                            {" - "}
                                            {slot.end_time}


                                        </div>

                                    ))

                                }


                            </div>


                        </div>

                    )}








                    <button

                        disabled={
                            loading ||
                            !date ||
                            !bookingType ||
                            (
                                bookingType==="hourly" &&
                                slots.length===0
                            )
                        }

                        onClick={handleSubmit}

                        className="
                            mt-8
                            w-full
                            rounded-full
                            bg-red-600
                            py-3
                            font-semibold
                            text-white
                            disabled:opacity-50
                        "

                    >

                        {
                            loading
                            ?
                            "Creating..."
                            :
                            "Create Availability"
                        }


                    </button>





                    {
                        success && (

                        <p className="
                            mt-4
                            text-green-600
                        ">

                            {success}

                        </p>

                    )}



                </section>









                {/* EXISTING AVAILABILITY */}


                <section className="mt-12">


                    <h2 className="
                        text-2xl
                        font-bold
                    ">

                        Existing Availability

                    </h2>




                    <div className="
                        mt-6
                        grid
                        gap-6
                        lg:grid-cols-3
                    ">






                        {/* Hourly */}

                        <AvailabilityBox

                            title="Hourly Slots"

                            data={hourlyAvailability}

                            formatTime={formatTime}

                        />





                        {/* Daily */}

                        <AvailabilityBox

                            title="Daily Slots"

                            data={dailyAvailability}

                            daily

                        />







                        {/* Summary */}

                        <div className="
                            rounded-2xl
                            bg-white
                            p-6
                            shadow-sm
                        ">


                            <h3 className="
                                text-lg
                                font-bold
                            ">

                                Summary

                            </h3>



                            <div className="
                                mt-5
                                space-y-3
                            ">


                                <p>
                                    Total Dates:
                                    {" "}
                                    <b>
                                        {existingAvailability.length}
                                    </b>
                                </p>


                                <p>
                                    Hourly:
                                    {" "}
                                    <b>
                                        {hourlyAvailability.length}
                                    </b>
                                </p>


                                <p>
                                    Daily:
                                    {" "}
                                    <b>
                                        {dailyAvailability.length}
                                    </b>
                                </p>


                            </div>


                        </div>




                    </div>



                </section>





            </main>


        </div>

    );


}






function AvailabilityBox({
    title,
    data,
    daily=false,
    formatTime
}) {


    return (

        <div className="
            rounded-2xl
            bg-white
            p-6
            shadow-sm
        ">


            <h3 className="
                text-lg
                font-bold
            ">

                {title}

            </h3>



            <div className="
                mt-5
                space-y-4
            ">



                {
                    data.length===0 && (

                    <p className="text-gray-500">

                        No availability created

                    </p>

                )}






                {
                    data.map((item,index)=>(

                    <div
                        key={index}
                        className="
                            rounded-xl
                            bg-gray-50
                            p-4
                        "
                    >

                        <p className="font-semibold">

                            {item.date}

                        </p>





                        {
                            daily
                            ?

                            <p className="
                                mt-2
                                text-sm
                                text-gray-600
                            ">

                                Full Day

                            </p>


                            :

                            item.slots.map(slot=>(

                                <p
                                    key={slot.id}
                                    className="
                                        mt-2
                                        rounded-lg
                                        bg-white
                                        p-2
                                        text-sm
                                    "
                                >

                                    {formatTime(slot.start_time)}
                                    {" - "}
                                    {formatTime(slot.end_time)}

                                </p>

                            ))

                        }



                    </div>

                ))}



            </div>


        </div>

    );

}


export default ManageAvailability;