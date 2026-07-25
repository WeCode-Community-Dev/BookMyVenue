import Header from "@/presentation/components/common/Header";
import Footer from "@/presentation/components/common/Footer";
import VenueCard from "@/presentation/components/common/VenueCard";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVenues } from "@/redux/slices/UserVenueSlice";
import { Amenities, Ratings, VenueCategory } from "@/constants/Venue";
import {
  getWishlist,
  addToWishlist,
  removeWishlist,
} from "@/redux/slices/UserWishlistSlice";
import { toast } from "react-hot-toast";

export default function BrowseVenues() {
    const dispatch = useDispatch()
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [selectedAmenities, setSelectedAmenities] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedRating, setSelectedRating] = useState(0)
    const [capacityType, setCapacityType] = useState("")
    const [capacity, setCapacity] = useState("")
    const [priceType, setPriceType] = useState("")
    const [minPrice, setMinPrice] = useState("")
    const [maxPrice, setMaxPrice] = useState("")
    const [appliedFilters, setAppliedFilters] = useState({
        amenities: [],
        capacityType: "",
        capacity: "",
        priceType: "",
        minPrice: "",
        maxPrice: ""
    })

  const { venues, pagination } = useSelector((state) => state.userVenue);
  const { wishlist } = useSelector((state) => state.userWishlist);

    useEffect(() => {
        dispatch(getVenues({
            search, 
            amenities: appliedFilters.amenities, 
            category: selectedCategory, 
            rating: selectedRating, 
            capacityType: appliedFilters.capacityType,
            capacity: appliedFilters.capacity,
            priceType: appliedFilters.priceType,
            minPrice: appliedFilters.minPrice,
            maxPrice: appliedFilters.maxPrice,
            page, 
            limit: 12
        }))
    }, [dispatch, search, appliedFilters, selectedCategory, selectedRating, page])
    
    useEffect(() => {
        dispatch(getWishlist());
    }, [dispatch]);

  const handleAddWishlist = async (venueId) => {
    try {
      await dispatch(addToWishlist(venueId)).unwrap();
      dispatch(getWishlist());
      toast.success("Added to wishlist");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleRemoveWishlist = async (venueId) => {
    try {
      await dispatch(removeWishlist(venueId)).unwrap();
      dispatch(getWishlist());
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error(error);
    }
  };

  const isWishlisted = (venueId) => {
    return wishlist?.some((item) => item.id === venueId);
  };

  return (
    <>
        <Header/>
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-5">
                    <div className="bg-white border border-slate-300 rounded-xl flex items-center gap-3 flex-1 max-w-3xl px-4 py-3">
                        <Search className="text-slate-500" size={20} />
                        <input
                        placeholder="Search venues by name, location, or type..."
                        className="outline-none w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4 ml-auto">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-52 border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none"
                        >
                            <option value="">All Categories</option>
                            {VenueCategory.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedRating}
                            onChange={(e) => setSelectedRating(Number(e.target.value))}
                            className="w-48 border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none"
                        >
                            <option value={0}>All Ratings</option>
                            {Ratings.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
                <div className=" bg-white rounded-2xl p-6 h-fit border" >
                    <h2 className="text-xl font-bold mb-6">
                        Filter Venues
                    </h2>
                    <h3 className="font-semibold mt-8 mb-3">
                        Price Type
                    </h3>
                    <div className="flex gap-4">
                        <label>
                            <input
                                type="radio"
                                name="price"
                                checked={priceType === "day"}
                                onChange={()=>setPriceType("day")}
                            />
                            {" "}per day
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="price"
                                checked={priceType === "hour"}
                                onChange={()=>setPriceType("hour")}
                            />
                        {" "} per hour
                        </label>
                    </div>
                    {priceType &&( 
                    <div className="flex gap-3 mt-3">
                        <input
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="Min"
                            className="border bg-gray-50 p-3 rounded-xl w-full"
                        />
                        <input
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="Max"
                            className="border bg-gray-50 p-3 rounded-xl w-full"
                        />
                    </div>
                    )}

                    <h3 className="font-semibold mt-8 mb-3">
                        Capacity Type
                    </h3>
                    <div className="flex gap-4">
                        <label>
                            <input
                                type="radio"
                                name="capacity"
                                checked={capacityType==="seating"}
                                onChange={()=>setCapacityType("seating")}
                            />
                            {" "}Seating
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="capacity"
                                checked={capacityType==="standing"}
                                onChange={()=>setCapacityType("standing")}
                            />
                        {" "}Standing
                        </label>
                    </div>
                    {capacityType && (
                    <select
                        value={capacity}
                        onChange={(e)=>setCapacity(e.target.value)}
                        className="border bg-gray-50 p-3 rounded-xl w-full mt-4"
                    >
                        <option value="">
                            Any Capacity
                        </option>
                        <option value="50">
                            50+ Guests
                        </option>
                        <option value="100">
                            100+ Guests
                        </option>
                        <option value="300">
                            300+ Guests
                        </option>
                        <option value="500">
                            500+ Guests
                        </option>
                    </select>
                    )}
                    <h3 className="font-semibold mt-8 mb-3">Amenities</h3>
                    {Amenities.map(item=>(
                        <label key={item} className="flex gap-3 mt-3">
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
                    <div className="flex gap-3 mt-10">
                        <button 
                            className="border px-6 py-3 rounded-xl"
                            onClick={() => {
                                setSelectedAmenities([])
                                setCapacityType("")
                                setCapacity("")
                                setPriceType("")
                                setMaxPrice("")
                                setMinPrice("")
                                setAppliedFilters({
                                    amenities: [],
                                    capacityType: "",
                                    capacity: "",
                                    priceType: "",
                                    minPrice: "",
                                    maxPrice: ""
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
                                    amenities: selectedAmenities,
                                    capacityType: capacityType,
                                    capacity: capacity,
                                    priceType: priceType,
                                    minPrice: minPrice,
                                    maxPrice: maxPrice
                                })
                            }}
                        >
                            Apply
                        </button>
                    </div>
                </div>
                <div className="md:col-span-3 grid md:grid-cols-3 gap-x-8 gap-y-5">
                    {venues.map((venue) => (
                    <VenueCard
                        key={venue.id}
                        venue={venue}
                        isWishlisted={isWishlisted(venue.id)}
                        onWishlistToggle={() => {
                        if (isWishlisted(venue.id)) {
                            handleRemoveWishlist(venue.id);
                        } else {
                            handleAddWishlist(venue.id);
                        }
                        }}
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
        <Footer />
    </>
)}

