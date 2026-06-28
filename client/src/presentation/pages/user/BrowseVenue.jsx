import Header from "@/presentation/components/common/Header"
import Footer from "@/presentation/components/common/Footer";
import VenueCard from "@/presentation/components/common/VenueCard"

import {Search} from "lucide-react";


const venues=[

{
name:"Grand Ballroom Palace",
type:"Wedding Hall",
location:"Mumbai, Maharashtra",
rating:"4.9",
reviews:"324",
price:"₹80,000",
capacity:"500-800 guests",
image:"https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
amenities:["AC","Parking","Catering"]
},


{
name:"Sky Terrace Lounge",
type:"Rooftop Venue",
location:"Bangalore, Karnataka",
rating:"4.8",
reviews:"198",
price:"₹45,000",
capacity:"100-200 guests",
image:"https://images.unsplash.com/photo-1519671482749-fd09be7ccebf",
amenities:["Open Air","Parking","Bar"]
},


{
name:"Modern Conference Hub",
type:"Conference Room",
location:"Gurgaon, Delhi NCR",
rating:"4.7",
reviews:"156",
price:"₹25,000",
capacity:"50-150 guests",
image:"https://images.unsplash.com/photo-1497366754035-f200968a6e72",
amenities:["AC","Projector","Wifi"]
},


{
name:"Elegant Banquet Hall",
type:"Banquet Hall",
location:"Pune, Maharashtra",
rating:"4.9",
reviews:"267",
price:"₹65,000",
capacity:"300-500 guests",
image:"https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
amenities:["AC","Parking","Catering"]
}


]

const Amenities = [
    'WIFI',
    'PARKING',
    'AIR_CONDITIONING',
    'CATERING_KITCHEN',
    'SOUND_SYSTEM',
    'PROJECTOR',
    'STAGE',
    'DANCE_FLOOR',
    'OUTDOOR_AREA',
    'VALET_PARKING',
    'GENERATOR_BACKUP',
    'CCTV_sECURITY',
    'GREEN_ROOM',
    'BRIDAL_SUIT',
    'SWIMMING_POOL',
    'ELEVATOR',
    'BAR_COUNTER',
    'PHOTO_BOOTH'
]

const VenueCategory = [
    'BEACH_SIDE',
    'CONFERENCE_HALL',
    'AUDITORIAM',
    'BANQUET_HALL',
    'PARTY_HALL',
    'ROOFTOP',
    'CAFE',
    'FARM_HOUSE',
    'PALACE',
    'STUDIO',
    'OUTDOOR_GARDEN',
    'AUDITORIUM',
    'RESORT',
    'HOTEL'
]

export default function BrowseVenues(){
return (
    <>
        <Header/>
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-6 py-6 flex gap-5">
                    <div className="bg-white border rounded-xl flex-1 p-4 flex gap-3">
                        <Search/>
                        <input
                            placeholder="Search venues by name, location, or type..."
                            className="outline-none w-full"
                        />
                    </div>
                    <button className="bg-slate-900 text-white px-8 rounded-xl">
                        ☷ Filters
                    </button>
                </div>
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
                <div className=" bg-white rounded-2xl p-6 h-fit border" >
                    <h2 className="text-xl font-bold mb-6">
                        Filter Venues
                    </h2>
                    <h3 className="font-semibold mb-3">
                        Price Range
                    </h3>
                    <div className="flex gap-3">
                        <input
                            placeholder="Min"
                            className="border bg-gray-50 p-3 rounded-xl w-full"
                        />
                        <input
                            placeholder="Max"
                            className="border bg-gray-50 p-3 rounded-xl w-full"
                        />
                    </div>
                    <h3 className="font-semibold mt-8 mb-3 ">
                        Guest Capacity
                    </h3>
                    <select className="border bg-gray-50 p-3 rounded-xl w-full">
                        <option>
                            Any Capacity
                        </option>
                        <option>
                            50 - 100 Guests
                        </option>
                        <option>
                            100 - 300 Guests
                        </option>
                        <option>
                            300 - 500 Guests
                        </option>
                        <option>
                            500+ Guests
                        </option>
                    </select>
                    <h3 className="font-semibold mt-8 mb-3">
                        Venue Type
                    </h3>
                    {VenueCategory.map((item)=>(
                        <label className="flex gap-3 mt-3 text-gray-700">
                            <input
                                type="checkbox"
                            />
                            {item}
                        </label>
                    ))}
                    <h3 className="font-semibold mt-8 mb-3">Amenities</h3>
                    {Amenities.map(item=>(
                        <label className="flex gap-3 mt-3">
                            <input
                                type="checkbox"
                            />
                            {item}
                        </label>
                    ))}
                    <h3 className="font-semibold mt-8 mb-3">Minimum Rating</h3>
                    {[
                        "4.5+ ⭐",
                        "4+ ⭐",
                        "3.5+ ⭐"
                    ].map(item=>(
                        <label className="flex gap-3 mt-3">
                            <input
                                type="radio"
                                name="rating"
                            />
                            {item}
                        </label>
                    ))}
                    <div className="flex gap-3 mt-10">
                        <button className="border px-6 py-3 rounded-xl">
                            Clear All
                        </button>
                        <button className="bg-amber-500 px-8 py-3 rounded-xl font-semibold">
                            Apply
                        </button>
                    </div>
                </div>
                <div className="md:col-span-3 grid md:grid-cols-3 gap-8">
                    {venues.map((venue,index)=>(
                        <VenueCard 
                        key={index}
                        venue={venue}
                        />
                    ))}
                </div>
            </div>
        </div>
    <Footer/>
</>
)}