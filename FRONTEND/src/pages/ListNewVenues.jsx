import { 
    X, 
    Check, 
    Users, 
    ArrowLeft, 
    ArrowRight,
    MapPin,
    Building,
    Wifi,
    Coffee,
    Truck,
    SunSnow, 
    Monitor, 
    Wheelchair,
    Upload, // Added for the upload zone
    Image as ImageIcon, // Added for image placeholders
    Trash // Added for delete button
} from '@mynaui/icons-react';

import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';

import Loading from '../components/Loading';
import Logo from '../assets/Logo.png'

export default function ListNewVenue() {

    const navigate = useNavigate()

    const [currentStep, setCurrentStep] = useState(1); 

    const steps = ['Basic Info', 'Amenities', 'Photos', 'Availability'];

    const [venueId, setVenueId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const InputImagesRef = useRef(null);
    const [imageselected, setImagesSelected] = useState([]);

    const currentUserId = Cookies.get('userId');

    const [basicFormData, setBasicFormData] = useState({
        user_id: currentUserId ? parseInt(currentUserId) : 1,
        venue_name: "",
        venue_description: "",
        location: "",
        capacity: 0,
    })

    const [amenitiesFormData, setAmenitiesFormData] = useState({
        wifi: false,
        kitchen: false,
        parking: false,
        ac: false,
        wheel_chair: false,
        av_equipements: false
    })

    const [availabilityFormData, setAvailabilityFormData] = useState({
        booking_types: "hourly",
        open_time: "",
        closing_time: "",
        minimum_hours: 0,
        gap_between_bookings: 0,
        venue_price: 0
    })

    // for step 3
    const handleInputClick = () => {
        InputImagesRef.current.click()
    }

    // for step 3
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files)
        
        const newImages = files.map(file => ({
            file: file,
            preview: URL.createObjectURL(file)
        }))

        setImagesSelected( prev => [...prev, ...newImages] );
    }
    
    // for step 3
    const removeImage = (indexToRemove) => {
        setImagesSelected(prev => 
            prev.filter((_, index) => index !== indexToRemove)
        )
    }
    
    // updates values for the form datas
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Convert to number if it's a number field, otherwise keep as string
        const numberFields = ['capacity', 'venue_price', 'minimum_hours', 'gap_between_bookings'];
        const parsedValue = numberFields.includes(name) ? Number(value) : value;

        if (name in basicFormData) {
            setBasicFormData(prev => ({ ...prev, [name]: parsedValue }));
        } else if (name in availabilityFormData) {
            setAvailabilityFormData(prev => ({ ...prev, [name]: parsedValue }));
        } else {
            console.warn(`Warning: Input name "${name}" was not found in either state object!`);
        }
    }
    
    // submitting the forms
    const handleSubmit = async () => {
        setIsLoading(true);
        try {

            if(currentStep === 1){
                const freshUserId = Cookies.get('userId')

                if(!freshUserId){
                    console.log("User session not found. Please Log in again!");
                    return false;
                }

                const payload = {
                    ...basicFormData,
                    userId: parseInt(freshUserId)
                }

                if(basicFormData.venue_name && basicFormData.location && basicFormData.venue_description && basicFormData.capacity > 0){
                    const response = await apiService.postBasicVenueDetails(payload)
                    setVenueId(response?.venue_id)
                }else{
                    toast.error("Please Fill Complete Form!");
                    return false;
                }

            } else if (currentStep === 2){
                await apiService.postVenueAmenities(amenitiesFormData, venueId)
            } else if (currentStep === 3){
                const formDataPayload = new FormData();
                imageselected.forEach((imageObj) => {
                    formDataPayload.append('images', imageObj.file); 
                });
                await apiService.postVenuePhotos(formDataPayload, venueId);
            } else if (currentStep === 4){
                await apiService.postVenueAvailability(availabilityFormData, venueId)
            }
            
            // API call successful!
            return true; 
            
        } catch (error) {
            console.error(error.response?.data || error)
            toast.error("Something went wrong! Please try Again!");
            
            // API call failed!
            return false; 

        } finally {
            setIsLoading(false);
        }
    }

    // for step 2 
    const toggleAmenities = (amenity) => {
        setAmenitiesFormData(prev => ({
            ...prev,
            [amenity] : !prev[amenity]
        }))
    }

    const LoadingText = "Please Wait..."
    if(isLoading){
        return <Loading LoadingText={LoadingText} />
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col ">
            <Toaster position='top-right' />
            
            <header className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <Link to="/host/dashboard" className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors cursor-pointer">
                    <X size={24} />
                </Link>
                <img src={Logo} alt="Logo" className="w-70 font-black text-[#8b3d2c] tracking-tight absolute left-1/2 transform -translate-x-1/2" />
                <div className="w-10"></div> 
            </header>

            <main className="flex-1 flex flex-col items-center pt-10 px-4 pb-20">
                
                <div className="w-full max-w-4xl mb-12 px-4 md:px-12">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-[2px] bg-gray-200 -z-10"></div>
                        
                        <div 
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-[2px] bg-[#2a5660] -z-10 transition-all duration-300"
                            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                        ></div>

                        {steps.map((label, index) => {  
                            const stepNumber = index + 1;
                            const isCompleted = stepNumber < currentStep;
                            const isActive = stepNumber === currentStep;

                            return (
                                <div key={label} className="flex flex-col items-center bg-[#f8fafc] px-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                                        isCompleted 
                                            ? 'bg-[#2a5660] text-white' 
                                            : isActive 
                                                ? 'bg-white border-2 border-[#2a5660] text-[#2a5660]' 
                                                : 'bg-white border-2 border-gray-300 text-gray-400'
                                    }`}>
                                        {isCompleted ? <Check size={20} /> : stepNumber}
                                    </div>
                                    <span className={`mt-3 text-[10px] md:text-xs font-semibold absolute top-12 whitespace-nowrap ${
                                        isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'
                                    }`}>
                                        {label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 p-8 md:p-10 mb-8">
                    
                    {/* STEP 1: BASIC INFO */}
                    {currentStep === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* ... (Kept exactly as you had it) ... */}
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Let's start with the basics</h2>
                            <p className="text-gray-500 mb-8">What is the name and location of your property?</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Venue Name</label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            placeholder="e.g., The Grand Hall"
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2a5660] focus:border-[#2a5660] outline-none transition-all"
                                            name='venue_name'
                                            value={basicFormData.venue_name}
                                            onChange={handleChange}
                                        />

                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text" 
                                            placeholder="e.g., Downtown Metro Area" 
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2a5660] focus:border-[#2a5660] outline-none transition-all"
                                            name='location'
                                            value={basicFormData.location}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Venue Description</label>
                                        <textarea 
                                            rows={5} 
                                            placeholder="e.g., A bright, airy loft with exposed brick walls..." 
                                            className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2a5660] focus:border-[#2a5660] outline-none transition-all resize-none"
                                            name='venue_description'
                                            value={basicFormData.venue_description}
                                            onChange={handleChange}
                                        />
                                        <div className="flex justify-between mt-1">
                                            <span className="text-xs text-gray-500 font-medium">Minimum 50 characters recommended.</span>
                                            <span className="text-xs text-gray-500 font-medium">0 / 500</span> 
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Maximum Guest Capacity</label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input 
                                                type="number" 
                                                placeholder="e.g., 50" 
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2a5660] focus:border-[#2a5660] outline-none transition-all"
                                                name='capacity'
                                                value={basicFormData.capacity}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <span className="block mt-1 text-xs text-gray-500 font-medium">Include both seating and standing room capacity.</span>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    )}

                    {/* STEP 2: AMENITIES */}
                    {currentStep === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">What does your space offer?</h2>
                            <p className="text-gray-500 mb-8">Select all the amenities that guests will have access to.</p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                
                                <button 
                                    type="button"
                                    onClick={() => toggleAmenities("wifi")} 
                                    className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all group ${
                                        amenitiesFormData.wifi ? "border-[#2a5660] bg-[#2a5660]/5" : "border-gray-200 hover:border-[#2a5660] hover:bg-gray-50"
                                    }`}
                                >
                                    <Wifi size={32} className={`mb-3 transition-colors ${amenitiesFormData.wifi ? "text-[#2a5660]" : "text-gray-400 group-hover:text-[#2a5660]"}`} />
                                    <span className={`text-sm font-bold ${amenitiesFormData.wifi ? "text-[#2a5660]" : "text-gray-700"}`}>High-Speed WiFi</span>
                                </button>

                                <button 
                                    type="button"
                                    onClick={() => toggleAmenities("kitchen")} 
                                    className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all group ${
                                        amenitiesFormData.kitchen ? "border-[#2a5660] bg-[#2a5660]/5" : "border-gray-200 hover:border-[#2a5660] hover:bg-gray-50"
                                    }`}
                                >
                                    <Coffee size={32} className={`mb-3 transition-colors ${amenitiesFormData.kitchen ? "text-[#2a5660]" : "text-gray-400 group-hover:text-[#2a5660]"}`} />
                                    <span className={`text-sm font-bold ${amenitiesFormData.kitchen ? "text-[#2a5660]" : "text-gray-700"}`}>Kitchen</span>
                                </button>

                                <button 
                                    type="button"
                                    onClick={() => toggleAmenities("parking")} 
                                    className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all group ${
                                        amenitiesFormData.parking ? "border-[#2a5660] bg-[#2a5660]/5" : "border-gray-200 hover:border-[#2a5660] hover:bg-gray-50"
                                    }`}
                                >
                                    <Truck size={32} className={`mb-3 transition-colors ${amenitiesFormData.parking ? "text-[#2a5660]" : "text-gray-400 group-hover:text-[#2a5660]"}`} />
                                    <span className={`text-sm font-bold ${amenitiesFormData.parking ? "text-[#2a5660]" : "text-gray-700"}`}>Parking</span>
                                </button>

                                <button 
                                    type="button"
                                    onClick={() => toggleAmenities("ac")} 
                                    className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all group ${
                                        amenitiesFormData.ac ? "border-[#2a5660] bg-[#2a5660]/5" : "border-gray-200 hover:border-[#2a5660] hover:bg-gray-50"
                                    }`}
                                >
                                    <SunSnow size={32} className={`mb-3 transition-colors ${amenitiesFormData.ac ? "text-[#2a5660]" : "text-gray-400 group-hover:text-[#2a5660]"}`} />
                                    <span className={`text-sm font-bold ${amenitiesFormData.ac ? "text-[#2a5660]" : "text-gray-700"}`}>Air Conditioning</span>
                                </button>

                                <button 
                                    type="button"
                                    onClick={() => toggleAmenities("wheel_chair")} 
                                    className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all group ${
                                        amenitiesFormData.wheel_chair ? "border-[#2a5660] bg-[#2a5660]/5" : "border-gray-200 hover:border-[#2a5660] hover:bg-gray-50"
                                    }`}
                                >
                                    <Wheelchair size={32} className={`mb-3 transition-colors ${amenitiesFormData.wheel_chair ? "text-[#2a5660]" : "text-gray-400 group-hover:text-[#2a5660]"}`} />
                                    <span className={`text-sm font-bold ${amenitiesFormData.wheel_chair ? "text-[#2a5660]" : "text-gray-700"}`}>Wheelchair Accessible</span>
                                </button>

                                <button 
                                    type="button"
                                    onClick={() => toggleAmenities("av_equipements")} 
                                    className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all group ${
                                        amenitiesFormData.av_equipements ? "border-[#2a5660] bg-[#2a5660]/5" : "border-gray-200 hover:border-[#2a5660] hover:bg-gray-50"
                                    }`}
                                >
                                    <Monitor size={32} className={`mb-3 transition-colors ${amenitiesFormData.av_equipements ? "text-[#2a5660]" : "text-gray-400 group-hover:text-[#2a5660]"}`} />
                                    <span className={`text-sm font-bold ${amenitiesFormData.av_equipements ? "text-[#2a5660]" : "text-gray-700"}`}>A/V Equipment</span>
                                </button>

                            </div>
                        </div>
                    )}

                    {/* ========================================== */}
                    {/* STEP 3: PHOTOS */}
                    {/* ========================================== */}
                    {currentStep === 3 && (

                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">

                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Show off your space</h2>
                            <p className="text-gray-500 mb-8">High-quality photos are the most important part of your listing.</p>

                            {/* Click to Upload Zone */}
                            <div onClick={handleInputClick} className="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 p-10 flex flex-col items-center justify-center text-center hover:bg-gray-100 hover:border-[#2a5660] transition-all cursor-pointer group mb-8">
                                <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                    <Upload size={32} className="text-[#2a5660]" />
                                </div>
                                <p className="text-gray-900 font-bold mb-1">Click to upload Images</p>
                                <p className="text-sm text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>

                                <input type="file" className='hidden' multiple accept='image/*' ref={InputImagesRef} onChange={handleFileSelect} />
                            </div>

                            {/* Image Preview Grid */}
                            {imageselected.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-4">Uploaded Photos {imageselected.length} </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {imageselected.map((imageObj, index) => (
                                            <div key={index} className={`relative aspect-square rounded-xl bg-gray-200 overflow-hidden group ${index === 0 ? 'border-2 border-[#2a5660]' : 'border border-gray-200'}`}>

                                                {index === 0 &&
                                                    <div className="absolute cursor-pointer top-2 left-2 bg-[#2a5660] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider z-10">
                                                        Cover
                                                    </div>
                                                }
                                                
                                                <img src={imageObj.preview} alt={`File preview ${index}`} className='object-cover h-full w-full' />
                                                <button type='button' onClick={() => removeImage(index)} 
                                                        className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors z-10">
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========================================== */}
                    {/*      STEP 4: AVAILABILITY & PRICING */       }
                    {/* ========================================== */}
                    {currentStep === 4 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Set your rules & pricing</h2>
                            <p className="text-gray-500 mb-8">How do you want to rent out this space?</p>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Booking Type</label>
                                        <select onChange={handleChange} 
                                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2a5660] focus:border-[#2a5660] outline-none transition-all"
                                                name='booking_types'
                                                value={availabilityFormData.booking_types}
                                        >
                                                
                                            <option value="hourly">Hourly</option>
                                            <option value="daily">Daily</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Base Price</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                            <input type="number"
                                                placeholder="0.00" 
                                                className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 outline-none" 
                                                onChange={handleChange}
                                                name='venue_price'
                                                value={availabilityFormData.venue_price}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Opening Time</label>
                                        <input type="time" 
                                            className="w-full p-3 rounded-lg border border-gray-300 outline-none" 
                                            onChange={handleChange}
                                            name='open_time'
                                            value={availabilityFormData.open_time}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Closing Time</label>
                                        <input type="time" 
                                            className="w-full p-3 rounded-lg border border-gray-300 outline-none" 
                                            onChange={handleChange}
                                            name='closing_time'
                                            value={availabilityFormData.closing_time}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Bottom Navigation Buttons */}
                <div className="w-full max-w-2xl flex items-center justify-between">
                    <button 
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all ${
                            currentStep === 1 
                                ? 'text-gray-300 cursor-not-allowed border border-gray-200' 
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 shadow-sm cursor-pointer'
                        }`}
                    >
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </button>

                    {/* currentStep === 4 */}
                    <button 
                        onClick={async () => {
                            // Wait for the result of the API call
                            const isSuccess = await handleSubmit();
                            
                            // Only move to the next step if the API call didn't crash
                            if (isSuccess) {
                                if (currentStep === 4) {
                                    toast.success("Venue Created Successfully!");
                                    setTimeout(() => {
                                        navigate("/host/dashboard");
                                    }, 1000);
                                } else {
                                    nextStep();
                                }
                            }
                        }}
                        className="flex items-center space-x-2 px-8 py-3 rounded-lg font-bold text-white bg-[#943d2c] hover:bg-[#7a3123] transition-colors shadow-sm cursor-pointer"
                    >
                        <span>{currentStep === 4 ? 'Publish Venue' : 'Next Step'}</span>
                        {currentStep !== 4 && <ArrowRight size={20} />}
                    </button>
                </div>

            </main>
        </div>
    );
}