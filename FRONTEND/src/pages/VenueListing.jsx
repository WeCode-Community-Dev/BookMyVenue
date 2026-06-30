import { 
  MapPin, 
  Users, 
  StarSolid, 
  Wifi, 
  Parking,
  Monitor,
  Coffee,
  SpinnerOne,
  X,
  ArrowLeft,
} from '@mynaui/icons-react';
import { VENUE_DATA } from '../data/VenueCardData';
import FormBooking from "../components/FormBooking"
import apiService from '../services/apiService';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';


const ImageGalleryModal = ({ isOpen, onClose, images }) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-in fade-in duration-200">
            
            {/* Header (Sticky so it stays visible while scrolling) */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Image Gallery</h2>
                <button 
                    onClick={onClose}
                    className="p-2 bg-gray-100 hover:bg-gray-200 hover:text-black rounded-full text-gray-600 transition-colors cursor-pointer"
                >
                    <X size={24}  />
                </button>
            </div>

            {/* Gallery Grid */}
            <div className="max-w-6xl mx-auto p-4 md:p-8 pb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {images?.map((img, index) => (
                        <div 
                            key={img.id || index} 
                            className="relative aspect-square md:aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group"
                        >
                            <img 
                                src={img} 
                                alt={`Venue photo ${index + 1}`} 
                                className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-100"
                            />
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default function SpaceListing() {

    const navigate = useNavigate()

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSession, setSelectedSession] = useState("hourly");
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [isGalleryOpen, SetIsGalleryOpen] = useState(false);

    const [venue, setVenue] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const {id} = useParams()    

    useEffect(() => {
        const FetchVenue =  async() => {
            try {
                const response = await apiService.getVenueByID(id)
                setVenue(response)

            } catch (error) {
                console.error("Failed to Fetch data: ",error)
                const errorMessage = error.response?.data?.detail || error.response?.data?.message || "Failed to load venue details.";
                setError(errorMessage)

            } finally {
                setIsLoading(false)
            }
        }
            if(id){
                FetchVenue();
            }
    }, [id]);
    

    if(isLoading){
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#2b5155]">
                <SpinnerOne className="w-10 h-10 animate-spin mb-4" />
                <p className="font-semibold text-lg">Loading, Please Wait!</p>
            </div>
        )
    }

    if (error || !venue) {
        return <div className="p-8 text-center text-xl">Venue not found!</div>;
    }

    // get all images from venues object
    const imageLinks  = venue.images?.map(i => i.image_url) || [];

    // Variables
    const venue_name = venue.venue_name
    const venue_details = venue.venue_description
    const venue_price = venue.venue_price
    const venue_rating = venue.rating
    const venue_capacity = venue.capacity
    const venue_location= venue.location
    const venue_type = venue.availability.booking_types
    // const venue_min_hour = venue.availability.minimum_hours
    // console.log(venue_min_hour);

    const handleReservation = async () => {
        const totalAmount = venue_type === "hourly" ? selectedTimes.length * 2 * venue_price : venue_price ;

        if(totalAmount === 0 && venue_type === "hourly" ){
            alert("Please select at least one time slot before confirming.")
            return;
        } else {
            
        }

        try {
            const orderPayload = {
                user_id: Cookies.get('userId'),
                venue_id: venue.id,
                amount: totalAmount
            }

            const orderResponse = await apiService.createPaymentOrder(orderPayload);

            const options = {
                key: orderResponse.key,
                amount: orderResponse.amount,
                currency: orderResponse.currency,
                order_id: orderResponse.order_id,
                name: "BookMyVenue",
                description: `Booking for ${venue_name}`,

                handler: async function(response){
                    try {
                        const verifyPayload = {
                            "user_id": parseInt(Cookies.get('userId')),
                            "venue_id": venue.id,
                            "razorpay_order_id": response.razorpay_order_id,
                            "razorpay_payment_id": response.razorpay_payment_id,
                            "razorpay_signature": response.razorpay_signature
                        }

                        const verifyResponse = await apiService.verifyPayment(verifyPayload);

                        console.log(verifyResponse);
                        if(verifyResponse.success){
                            alert("Successfully Verified!")
                        }
                        
                    } catch (verifyError) {
                        alert("Payment done! but Failed to Verify, contact Support.")
                        console.error("Verification Failed!",verifyError)
                    }
                },
                theme: {
                    color: "#ff5c5d",
                }
            };

            const paymentWindow = new window.Razorpay(options)
            paymentWindow.open();

        } catch (error) {
            console.error("Failed to Book the Venue:", error)
            alert("Something went wrong while setting up the payment. Please try again.");
        }
    }

    return (
        <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans text-gray-900">

            {!isGalleryOpen && <div onClick={() => navigate("/")} className='fixed absolute left-8 z-99'>
                <ArrowLeft size={40} className="p-1 bg-gray-100 hover:bg-gray-200 hover:text-black rounded-full text-gray-600 transition-colors cursor-pointer" />
            </div>}

            {/* Image Gallery Modal */}
            <ImageGalleryModal 
                isOpen={isGalleryOpen} 
                onClose={() => SetIsGalleryOpen(false)}
                images={imageLinks} 
            />

            {/* --- Image Gallery Section --- */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-2 h-[400px] md:h-[500px] mb-10 rounded-2xl overflow-hidden">
                <div className="w-full h-full relative group cursor-pointer">
                    <img 
                        src={imageLinks[0]}
                        alt="." 
                        className="w-full h-full object-cover hover:brightness-90 transition-all duration-300"
                    />
                </div>
                
                {/* Right 4-Grid Images */}
                <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 h-full">
                    {/* Top Left */}
                    <div className="relative w-full h-full min-h-0">
                        <img 
                        src={imageLinks[1]}
                        alt="." 
                        className="absolute inset-0 w-full h-full object-cover hover:brightness-90 transition-all duration-300" 
                        />
                    </div>

                    {/* Top Right */}
                    <div className="relative w-full h-full min-h-0">
                        <img 
                        src={imageLinks[2]}
                        alt="." 
                        className="absolute inset-0 w-full h-full object-cover hover:brightness-90 transition-all duration-300" 
                        />
                    </div>

                    {/* Bottom Left */}
                    <div className="relative w-full h-full min-h-0">
                        <img 
                        src={imageLinks[3]}
                        alt="." 
                        className="absolute inset-0 w-full h-full object-cover hover:brightness-90 transition-all duration-300" 
                        />
                    </div>

                    {/* Bottom Right */}
                    <div className="relative w-full h-full min-h-0">
                        <img 
                        src={imageLinks[4]}
                        alt="." 
                        className="absolute inset-0 w-full h-full object-cover hover:brightness-90 transition-all duration-300" 
                        />
                    </div>
                </div>
                <button
                    onClick={() => SetIsGalleryOpen(true)}
                    className='absolute cursor-pointer bottom-3 right-5 p-4 bg-[#ff5c5d] rounded-lg text-white font-semibold text-sm ' >
                        SHOW ALL IMAGES
                </button>
            </div>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            
            {/* Left Column Details */}
            <div className="lg:col-span-2 space-y-8">
            
            {/* Header Info */}
            <div>
                {/* <div className="flex gap-2 mb-3">
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">Ideal for Weddings</span>
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">Parties</span>
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">Workshops</span>
                </div> */}
                
                <h1 className="text-3xl font-bold mb-2">{venue_name}</h1>
                
                <div className="flex items-center text-gray-600 text-sm mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{venue_location}</span>
                </div>

                <div className="flex items-center gap-4 text-sm font-medium text-gray-800">
                <div className="flex items-center gap-1.5">
                    <Users className="w-5 h-5 text-gray-600" />
                    <span>{venue_capacity}</span>
                </div>
                {venue_rating && <div className="flex items-center gap-1">
                <span>·</span>
                    <StarSolid className="w-4 h-4 text-red-500" />
                    <span>{venue_rating}</span>
                </div>}
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
                    <span className="text-2xl font-bold">{venue_price + "₹"}</span>
                    <span className="text-gray-500 text-sm">{venue_type === "hourly" ? "/hour" : "/day"}</span>
                </div>

                {/* Form Inputs */}
                <FormBooking 
                    venue={venue} 
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    selectedSession={selectedSession}
                    setSelectedSession={setSelectedSession}
                    selectedTimes={selectedTimes}
                    setSelectedTimes={setSelectedTimes}
                />

                {/* Submit Button */}
                <button onClick={handleReservation} className="w-full cursor-pointer bg-[#f4645c] hover:bg-[#e05048] text-white py-3.5 rounded-lg font-semibold text-base transition-colors duration-200">
                    Confirm Reservation
                </button>
                <p className="text-center text-xs text-gray-500 mt-3 mb-6">You won't be charged yet</p>

                {/* Price Breakdown */}
                {/* <div className="space-y-3 text-sm text-gray-600 border-b border-gray-200 pb-4">
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
                </div> */}
                
                {/* Total */}
                <div className="flex justify-between font-bold text-gray-800 mt-4 text-base">
                <span>Total amount</span>
                <span>₹{venue_type === "hourly"
                    ? selectedTimes.length * 2 * venue_price
                    : venue_price
                }</span>
                </div>

            </div>
            </div>
        </div>
        </div>
    );
}