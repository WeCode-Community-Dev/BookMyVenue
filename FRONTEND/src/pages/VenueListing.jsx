import { 
  MapPin, 
  Users, 
  StarSolid, 
  Wifi, 
  Parking,
  Monitor, 
  Coffee,
  SpinnerOne
} from '@mynaui/icons-react';
import { VENUE_DATA } from '../data/VenueCardData';
import FormBooking from "../components/FormBooking"
import apiService from '../services/apiService';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';


export default function SpaceListing() {

    const [venue, setVenue] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const {id} = useParams()
    
    useEffect(() => {
        const FetchVenue =  async() => {
            try {
                const response = await apiService.getVenueByID(id)
                console.log(response.data)
                setVenue(response.data)
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        FetchVenue();
    }, [id])

    const venue_name = venue.venue_name
    const venue_details = venue.details
    const venue_price = venue.price
    const venue_rating = venue.rating
    const venue_capacity = venue.capacity

    if(isLoading){
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#2b5155]">
                <SpinnerOne className="w-10 h-10 animate-spin mb-4" />
                <p className="font-semibold text-lg">Loading, Please Wait!</p>
            </div>
        )
    }

    if (!venue) {
        return <div className="p-8 text-center text-xl">Venue not found!</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans text-gray-900">
        
        <div className=''>
            
        </div>

        {/* --- Image Gallery Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[400px] md:h-[500px] mb-10 rounded-2xl overflow-hidden">
            <div className="w-full h-full relative group cursor-pointer">
            <img 
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Main Loft Space" 
                className="w-full h-full object-cover hover:brightness-90 transition-all duration-300"
            />
            </div>
            
            {/* Right 4-Grid Images */}
            <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 h-full">
    
            {/* Top Left */}
            <div className="relative w-full h-full min-h-0">
                <img 
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                alt="Lounge Area" 
                className="absolute inset-0 w-full h-full object-cover hover:brightness-90 transition-all duration-300" 
                />
            </div>

            {/* Top Right */}
            <div className="relative w-full h-full min-h-0">
                <img 
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                alt="Kitchen" 
                className="absolute inset-0 w-full h-full object-cover hover:brightness-90 transition-all duration-300" 
                />
            </div>

            {/* Bottom Left */}
            <div className="relative w-full h-full min-h-0">
                <img 
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                alt="Seating Setup" 
                className="absolute inset-0 w-full h-full object-cover hover:brightness-90 transition-all duration-300" 
                />
            </div>

            {/* Bottom Right */}
            <div className="relative w-full h-full min-h-0">
                <img 
                src="https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                alt="Patio" 
                className="absolute inset-0 w-full h-full object-cover hover:brightness-90 transition-all duration-300" 
                />
            </div>

            </div>
        </div>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            
            {/* Left Column Details */}
            <div className="lg:col-span-2 space-y-8">
            
            {/* Header Info */}
            <div>
                <div className="flex gap-2 mb-3">
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">Ideal for Weddings</span>
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">Parties</span>
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">Workshops</span>
                </div>
                
                <h1 className="text-3xl font-bold mb-2">{venue_name}</h1>
                
                <div className="flex items-center text-gray-600 text-sm mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>Downtown Arts District, Portland</span>
                </div>

                <div className="flex items-center gap-4 text-sm font-medium text-gray-800">
                <div className="flex items-center gap-1.5">
                    <Users className="w-5 h-5 text-gray-600" />
                    <span>{venue_capacity}</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1">
                    <StarSolid className="w-4 h-4 text-red-500" />
                    <span>{venue_rating}</span>
                    <span className="text-gray-500 underline cursor-pointer hover:text-gray-800">(128 reviews)</span>
                </div>
                </div>
            </div>

            <hr className="border-gray-200" />

            {/* About Section */}
            <div>
                <h2 className="text-xl font-semibold mb-4">About this space</h2>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {venue_details}
                </p>
            </div>

            <hr className="border-gray-200" />

            {/* Amenities Section */}
            <div>
                <h2 className="text-xl font-semibold mb-6">What this place offers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div className="flex items-center gap-3 text-gray-700">
                    <Wifi className="w-6 h-6 text-gray-600" />
                    <span>High-speed Wi-Fi</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                    <Parking className="w-6 h-6 text-gray-600" />
                    <span>Free street parking</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                    <Monitor className="w-6 h-6 text-gray-600" />
                    <span>AV Equipment</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                    <Coffee className="w-6 h-6 text-gray-600" />
                    <span>Kitchen access</span>
                </div>
                </div>
            </div>
            </div>

            {/* Right Column: Sticky Booking Widget */}
            <div className="lg:col-span-1">
            <div className="sticky top-24 border border-gray-200 rounded-2xl p-6 shadow-[0_6px_16px_rgba(0,0,0,0.08)] bg-white">
                
                {/* Price */}
                <div className="flex items-baseline gap-1 mb-6">
                <span className="text-2xl font-bold">{venue_price}</span>
                <span className="text-gray-500 text-sm">/ session</span>
                </div>

                {/* Form Inputs */}
                <FormBooking venue={venue} />

                {/* Submit Button */}
                <button className="w-full cursor-pointer bg-[#f4645c] hover:bg-[#e05048] text-white py-3.5 rounded-lg font-semibold text-base transition-colors duration-200">
                Confirm Reservation
                </button>
                <p className="text-center text-xs text-gray-500 mt-3 mb-6">You won't be charged yet</p>

                {/* Price Breakdown */}
                <div className="space-y-3 text-sm text-gray-600 border-b border-gray-200 pb-4">
                <div className="flex justify-between">
                    <span className="underline cursor-pointer">₹30,000 x 1 session</span>
                    <span>₹30,000</span>
                </div>
                <div className="flex justify-between">
                    <span className="underline cursor-pointer">Cleaning fee</span>
                    <span>₹2,500</span>
                </div>
                <div className="flex justify-between">
                    <span className="underline cursor-pointer">Platform fee</span>
                    <span>₹1,500</span>
                </div>
                </div>
                
                {/* Total */}
                <div className="flex justify-between font-bold text-gray-800 mt-4 text-base">
                <span>Total before taxes</span>
                <span>₹34,000</span>
                </div>

            </div>
            </div>
        </div>
        </div>
    );
}