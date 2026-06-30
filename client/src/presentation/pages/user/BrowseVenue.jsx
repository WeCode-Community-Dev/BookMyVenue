import Header from "@/presentation/components/common/Header"
import Footer from "@/presentation/components/common/Footer";
import VenueCard from "@/presentation/components/common/VenueCard"
import {Search} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVenues } from "@/redux/slices/UserVenueSlice";

const Amenities = [
    "Wifi",
    "Parking",
    "Air Conditioning",
    "Catering Kitchen",
    "Sound System",
    "Projector",
    "Stage",
    "Dance Floor",
    "Outdoor Area",
    "Valet Parking",
    "Generator Backup",
    "CCTV Security",
    "Green Room",
    "Bridal Suite",
    "Swimming Pool",
    "Elevator",
    "Bar Counter",
    "Photo Booth"
]


const VenueCategory = [
    "Beach Side",
    "Conference Hall",
    "Auditorium",
    "Banquet Hall",
    "Party Hall",
    "Rooftop",
    "Cafe",
    "Farm House",
    "Palace",
    "Studio",
    "Outdoor Garden",
    "Resort",
    "Hotel"
]

export default function BrowseVenues(){

    const dispatch = useDispatch()
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [selectedAmenities, setSelectedAmenities] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedRating, setSelectedRating] = useState(0)
    const [appliedFilters, setAppliedFilters] = useState({
        amenities: [],
        category: '',
        rating: 0
    })

    const { venues, pagination } = useSelector((state) => state.userVenue)
   

    useEffect(() => {
       dispatch(getVenues({search, amenities: appliedFilters.amenities, category: appliedFilters.category, rating: appliedFilters.rating, page, limit: 12}))
    }, [dispatch, search, appliedFilters, page])

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
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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
                                value={item}
                                type="radio"
                                name="category"
                                checked={selectedCategory === item}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            />
                            {item}
                        </label>
                    ))}
                    <h3 className="font-semibold mt-8 mb-3">Amenities</h3>
                    {Amenities.map(item=>(
                        <label className="flex gap-3 mt-3">
                            <input
                                value={item}
                                type="checkbox"
                                checked={selectedAmenities.includes(item)}
                                onChange={(e) => {
                                    if(e.target.checked){
                                        setSelectedAmenities([...selectedAmenities, item])
                                    }else{
                                        setSelectedAmenities(selectedAmenities.filter((amenity) => amenity !== item ))
                                    }
                                }}
                            />
                            {item}
                        </label>
                    ))}
                    <h3 className="font-semibold mt-8 mb-3">Minimum Rating</h3>
                    {[
                        "4+ ⭐",
                        "4+ ⭐",
                        "3+ ⭐"
                    ].map(item=>(
                        <label className="flex gap-3 mt-3">
                            <input
                                value={item}
                                checked={selectedRating === item}
                                onChange={(e) => setSelectedRating(e.target.value)}
                                type="radio"
                                name="rating"
                            />
                            {item}
                        </label>
                    ))}
                    <div className="flex gap-3 mt-10">
                        <button 
                            className="border px-6 py-3 rounded-xl"
                            onClick={() => {
                                setSelectedCategory('')
                                setSelectedAmenities([])
                                setAppliedFilters({
                                    category: '',
                                    amenities: '',
                                    rating: 0
                                })
                                setPage(1)
                            }}
                        >
                            Clear All
                        </button>
                        <button 
                            className="bg-amber-500 px-8 py-3 rounded-xl font-semibold"
                            onClick={() => {
                                setPage(1)
                                setAppliedFilters({
                                    category: selectedCategory,
                                    amenities: selectedAmenities,
                                    rating: selectedRating
                                })
                            }}
                        >
                            Apply
                        </button>
                    </div>
                </div>
                <div className="md:col-span-3 grid md:grid-cols-3 gap-8">
                    {venues.map((venue)=>(
                        <VenueCard 
                        key={venue._id}
                        venue={venue}
                        />
                    ))}
                </div>
                <div className="md:col-span-3 flex justify-center gap-3 mt-10">
                    {Array.from({length: pagination.venues.totalPages},(_,index)=>index+1).map((number)=>(
                        <button
                            key={number}
                            onClick={()=>setPage(number)}
                            className={`px-4 py-2 rounded-lg border ${
                                page === number
                                ? "bg-slate-900 text-white"
                                : ""
                            }`}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    <Footer/>
</>
)}