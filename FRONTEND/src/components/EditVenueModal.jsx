import { 
  X, Building, MapPin, Users, Wifi, 
  Coffee, Parking, AirVent, Wheelchair, 
  Monitor, Rupee, Clock1, Trash, Plus
} from '@mynaui/icons-react';
import { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import toast, {Toaster} from 'react-hot-toast';

export default function EditVenueModal({ isOpen, onClose, venueData }) {

    const [basicFormData, setBasicFormData] = useState({
        venue_name: '',
        location: '',
        venue_description: '',
        capacity: '',
    });

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

    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                if(!isOpen || !venueData?.id) return;

                const response = await apiService.getVenueByID(venueData?.id);
                console.log(response);
                
                
                setBasicFormData({
                    venue_name: response ? response.venue_name : '',
                    location: response ? response.location : '',
                    venue_description: response ? response.venue_description : '',
                    capacity: response ? response.capacity : '',
                });

                setAmenitiesFormData({
                    wifi: response?.amenities?.wifi || false,
                    kitchen: response?.amenities?.kitchen || false,
                    parking: response?.amenities?.parking || false,
                    ac: response?.amenities?.ac || false,
                    wheel_chair: response?.amenities?.wheel_chair || false,
                    av_equipements: response?.amenities?.av_equipements || false,
                });

                setAvailabilityFormData({
                    booking_types: response?.availability?.booking_types || "hourly",
                    open_time: response?.availability?.open_time || "",
                    closing_time: response?.availability?.closing_time || "",
                    minimum_hours: response?.availability?.minimum_hours || 0,
                    gap_between_bookings: response?.availability?.gap_between_bookings || 0,
                    venue_price: response?.availability?.venue_price || 0
                });

                setImages(response ? response.images : []);
                
            } catch (error) {
                console.log(error);
                toast.error("Failed to Fetch Veneus!")
            }
        }
        fetchVenues()

    }, [isOpen, venueData?.id]);

    if (!isOpen) return null;

    const AMENITIES_CONFIG = [
        { key: 'wifi', label: 'High-Speed WIFI', icon: Wifi },
        { key: 'kitchen', label: 'Kitchen', icon: Coffee },
        { key: 'parking', label: 'Parking', icon: Parking },
        { key: 'ac', label: 'Air Conditioning', icon: AirVent },
        { key: 'wheel_chair', label: 'Wheelchair Accessible', icon: Wheelchair },
        { key: 'av_equipements', label: 'A/V Equipment', icon: Monitor },
    ];

    const handleChange = (e) => {
        const {name, value} = e.target;

        const numberFields = ['capacity', 'venue_price', 'minimum_hours', 'gap_between_bookings'];
        const parsedValue = numberFields.includes(name) ? Number(value) : value;

        if(name in basicFormData){setBasicFormData(prev => ({...prev, [name]:parsedValue}))}
        else if(name in availabilityFormData){setAvailabilityFormData(prev => ({...prev, [name]:parsedValue}))}
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files)

        const newImages = files.map(file => ({
            file: file,
            preview: URL.createObjectURL(file)
        }))

        setImages(prev => [...prev, ...newImages]);
    }

    const handleSubmit = async () => {
        try {    
            // 1. Always update the text/boolean data
            await apiService.UpdateBasicDetails(venueData?.id, basicFormData);
            await apiService.UpdateAmenities(venueData?.id, amenitiesFormData);
            await apiService.updateAvailability(venueData?.id, availabilityFormData);
            
            // 2. Filter out ONLY the newly uploaded files
            const newUploads = images.filter(img => img.file);

            // 3. THE FIX: Only run the image API if there is actually a new file!
            if (newUploads.length > 0) {
                
                const existingImageIds = images
                    .filter(img => img.id)
                    .map(img => img.id); 

                const formData = new FormData();
                
                formData.append('existing_image_ids', JSON.stringify(existingImageIds));

                newUploads.forEach((img) => {
                    formData.append('image', img.file); 
                });

                await apiService.UpdateImages(venueData?.id, formData);
                console.log("New images successfully sent!");
            }

            // Close the modal after everything succeeds
            onClose();
        } catch (error) {
            console.error("Failed to save:", error);
            toast.error("Failed to Modify Venues!");
        }
    }

    const handleRemoveImage = (imageToRemove) => {
        setImages(prev => prev.filter(img => img !== imageToRemove));
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        < Toaster />
        {/* Modal Container */}
        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-xl flex flex-col overflow-hidden transform transition-all scale-100">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Edit Space Details</h2>
                <p className="text-xs text-gray-500 mt-0.5">Update your venue information and image gallery.</p>
            </div>
            <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            >
                <X size={20} />
            </button>
            </div>


            {/* Scrollable Form Content */}
            <form onSubmit={(e) => e.preventDefault()} className="p-6 overflow-y-auto space-y-8 flex-1 bg-[#fbfcfd]">
                <div className="space-y-5 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Basic Information</h3>
                    
                    {/* Venue Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1.5">Venue Name</label>
                        <div className="relative flex items-center">
                            <Building size={18} className="absolute left-3 text-gray-400 pointer-events-none" />
                            <input 
                                type="text" 
                                name='venue_name'
                                value={basicFormData.venue_name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2b5155] focus:border-transparent transition-all bg-white"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1.5">Location</label>
                        <div className="relative flex items-center">
                            <MapPin size={18} className="absolute left-3 text-gray-400 pointer-events-none" />
                            <input 
                            type="text" 
                            name='location'
                            value={basicFormData.location}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2b5155] focus:border-transparent transition-all bg-white"
                            />
                        </div>
                    </div>

                    {/* Venue Description */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1.5">Venue Description</label>
                        <textarea 
                            rows={4}
                            name='venue_description'
                            value={basicFormData.venue_description}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2b5155] focus:border-transparent transition-all bg-white resize-none"
                        />
                        <div className="flex justify-between items-center text-xs text-gray-400 mt-1.5 px-0.5">
                            <span>Minimum 50 characters recommended.</span>
                            {/* <span>0 / 500</span> */}
                        </div>
                    </div>

                    {/* Maximum Guest Capacity */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1.5">Maximum Guest Capacity</label>
                        <div className="relative flex items-center">
                            <Users size={18} className="absolute left-3 text-gray-400 pointer-events-none" />
                            <input 
                            type="number" 
                            name='capacity'
                            value={basicFormData.capacity}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2b5155] focus:border-transparent transition-all bg-white"
                            />
                        </div>
                        <span className="block text-xs text-gray-400 mt-1.5 px-0.5">Include both seating and standing room capacity.</span>
                    </div>

                    {/* ==========================================
                        SECTION 2: AMENITIES 
                        ========================================== */}
                    <div className="space-y-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Amenities</h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {AMENITIES_CONFIG.map((amenity) => {
                                const IconComponent = amenity.icon;
                                const isSelected = amenitiesFormData[amenity.key] || false;

                                return (
                                    <button
                                        key={amenity.key}
                                        onClick={() => setAmenitiesFormData(prev => ({
                                            ...prev,
                                            [amenity.key]: !prev[amenity.key]
                                        }))}
                                        type="button"
                                        className={`flex flex-col items-center justify-center p-5 border rounded-xl cursor-pointer transition-all duration-200 gap-2 text-center group ${
                                        isSelected 
                                            ? 'border-[#2b5155] bg-slate-50 text-[#2b5155] ring-1 ring-[#2b5155]' 
                                            : 'border-gray-100 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <IconComponent 
                                        size={24} 
                                        className={isSelected ? 'text-[#2b5155]' : 'text-gray-400 group-hover:text-gray-600'} 
                                        />
                                        <span className="text-xs font-bold tracking-tight">{amenity.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    {/* ==========================================
                        SECTION 3: TIMING & BOOKING (image_f8ba89.png)
                        ========================================== */}
                    <div className="space-y-5 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Booking & Operational Constraints</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Booking Type */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-1.5">Booking Type</label>
                                <select value={availabilityFormData.booking_types} 
                                        onChange={handleChange} 
                                        name='booking_types'
                                        className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2b5155] bg-white text-gray-800 font-medium">
                                    <option value="hourly">Hourly</option>
                                    <option value="daily">Daily</option>
                                </select>
                            </div>

                            {/* Base Price */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-1.5">Base Price</label>
                                <div className="relative flex items-center">
                                    <Rupee size={16} className="absolute left-3 text-gray-400 pointer-events-none" />
                                <input 
                                    type="number" 
                                    value={availabilityFormData.venue_price}
                                    name='venue_price'
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full pl-8 pr-4 py-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2b5155] focus:border-transparent transition-all bg-white"
                                />
                                </div>
                            </div>

                            {/* Opening Time */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-1.5">Opening Time</label>
                                <div className="relative flex items-center">
                                <input 
                                    type="time" 
                                    value={availabilityFormData.open_time}
                                    onChange={handleChange}
                                    name='open_time'
                                    className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2b5155] focus:border-transparent transition-all bg-white text-gray-700"
                                />
                                {/* <Clock1 size={16} className="absolute right-3 text-gray-400 pointer-events-none" /> */}
                                </div>
                            </div>

                            {/* Closing Time */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-1.5">Closing Time</label>
                                <div className="relative flex items-center">
                                <input 
                                    type="time" 
                                    value={availabilityFormData.closing_time}
                                    name='closing_time'
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2b5155] focus:border-transparent transition-all bg-white text-gray-700"
                                />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ==========================================
                        SECTION 4: IMAGE MANAGEMENT SECTION
                        ========================================== */}
                    <div className="space-y-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Media Gallery</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Manage space layout photos. First image will act as the cover preview.</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        
                            {images.map((img) => (
                                <div key={img.id || img.preview} className="relative aspect-video sm:aspect-square bg-gray-50 border border-gray-100 rounded-xl overflow-hidden group shadow-inner">
                                    <img 
                                        src={img.image_url || img.preview} 
                                        alt={`Venue layout ${img.id}`} 
                                        className="w-full h-full object-cover"
                                    />
                                    
                                    {/* <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(img)}
                                            className="p-2 bg-white/90 hover:bg-white text-red-500 rounded-full transition-transform transform scale-90 group-hover:scale-100 shadow cursor-pointer"
                                            title="Delete Image"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div> */}

                                    {img.cover_image && (
                                        <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white px-1.5 py-0.5 rounded uppercase tracking-wider">
                                            Cover
                                        </span>
                                    )}
                                </div>
                            ))}

                            <label className="aspect-video sm:aspect-square border-2 border-dashed border-gray-200 hover:border-[#ff5c5d] hover:bg-[#fff9f9] rounded-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer group transition-all">
                                <div className="p-3 bg-gray-50 rounded-full group-hover:bg-white border border-gray-100 shadow-xs transition-colors">
                                    <Plus size={20} className="text-gray-400 group-hover:text-[#ff5c5d]" />
                                </div>
                                <span className="text-xs font-bold text-gray-500 group-hover:text-[#ff5c5d] mt-2 block">Upload Image</span>
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*"
                                    className="hidden" 
                                    onChange={handleFileSelect}
                                />
                            </label>

                        </div>
                    </div>
                </div>
            </form>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 font-semibold text-sm transition-colors cursor-pointer"
            >
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                type="button"
                className="px-5 py-2.5 rounded-lg bg-[#ff535e] hover:bg-[#e0444f] text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
            >
                Save Modifications
            </button>
            </div>

        </div>
        </div>
    );
}