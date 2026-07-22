import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Layout, Building, Rupee, PlusCircle,
  MapPin, Menu, X,
  User, Calendar, Mail, ExternalLink, ArrowLongRight
} from '@mynaui/icons-react';
import Cookies from 'js-cookie';
import apiService from '../services/apiService';
import Logo from '../assets/Logo.png';
import EditVenueModal from '../components/EditVenueModal';
import FormBooking from '../components/FormBooking'; 
import toast, { Toaster } from 'react-hot-toast';
import Loading from '../components/Loading';

const SidebarItem = ({ icon: Icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full cursor-pointer flex items-center space-x-4 px-5 py-3.5 rounded-xl transition-colors text-sm font-semibold ${
      isActive ? 'bg-[#ff5c5d] text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <Icon size={22} className={isActive ? "text-white" : "text-gray-500"} />
    <span>{label}</span>
  </button>
);

const ToggleSwitch = ({ isActive, onToggle, venue }) => (
  <div 
    onClick={() => onToggle(venue)} 
    className={`relative w-20 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
      isActive ? 'bg-[#2a5660]' : 'bg-gray-300'
    }`}
  >
    <div className="absolute inset-0 flex items-center pointer-events-none">
      <span 
        className={`absolute left-2.5 text-xs font-semibold text-white whitespace-nowrap transition-opacity duration-300 ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Online
      </span>
      <span 
        className={`absolute right-2 text-xs font-semibold text-gray-600 whitespace-nowrap transition-opacity duration-300 ${
          isActive ? 'opacity-0' : 'opacity-100'
        }`}
      >
        Offline
      </span>
    </div>

    <div 
      className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 z-10 ${
        isActive ? 'translate-x-12' : 'translate-x-0'
      }`}
    />
  </div>
);

// ==========================================
//          LAYOUT COMPONENTS
// ==========================================

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, navigate }) => (
  <>
    {isOpen && (
      <div 
        className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />
    )}

    <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.02)] transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-8 flex justify-between items-center">
          <img src={Logo} alt="" className="text-2xl font-black text-[#8b3d2c] tracking-tight" />
          <button className="lg:hidden text-gray-500 hover:text-gray-900" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="px-6 mb-8">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center  space-x-4">
            <div>
              <p className="text-sm font-bold text-gray-900">Welcome <span className='text-[#2e7078]' >{Cookies.get("userName")}</span> </p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">Host Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="px-6 space-y-2">
          <SidebarItem icon={Building} label="Homepage" isActive={activeTab === 'Homepage'} onClick={() => { setActiveTab('Homepage'); setIsOpen(false); navigate("/host") }} />
          <SidebarItem icon={Layout} label="Dashboard" isActive={activeTab === 'Dashboard'} onClick={() => { setActiveTab('Dashboard'); setIsOpen(false); }} />
        </nav>
      </div>

      <Link to="/host/dashboard/list-new-venues" className="p-6 border-t border-gray-100 cursor-pointer bg-white">
        <button className="w-full bg-[#ff535e] cursor-pointer hover:bg-[#733224] text-white flex items-center justify-center space-x-2 py-4 rounded-xl transition-colors font-semibold text-sm shadow-sm">
          <PlusCircle size={20} />
          <span>List New Space</span>
        </button>
      </Link>
    </aside>
  </>
);

const TopHeader = () => (
  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6">
    <div>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">Welcome back, Community Host</h2>
      <p className="text-gray-500 font-medium">High-efficiency overview of your venue network.</p>
    </div>
  </header>
);

const StatsOverview = ({ venue, ownerRevenue }) => (
  <div className="bg-white border border-gray-100 rounded-2xl flex flex-col md:flex-row items-center justify-between p-2 mb-10 shadow-sm">
    <div className="flex-1 w-full flex items-center space-x-5 p-6 md:border-r border-gray-100 border-t md:border-t-0">
      <div className="bg-blue-50 p-4 rounded-xl text-blue-400">
        <Rupee size={28} strokeWidth={2} />
      </div>
      <div>
        <div className="flex items-baseline space-x-3">
          <span className="text-4xl font-bold text-gray-900">{ownerRevenue}</span>
          <span className="text-sm font-semibold text-gray-500">Total Revenue</span>
        </div>
      </div>
    </div>
    <div className="flex-1 w-full flex items-center space-x-5 p-6 border-t md:border-t-0 border-gray-100">
      <div className="bg-[#f0e8d5] p-4 rounded-xl text-[#8b7355]">
        <MapPin size={28} strokeWidth={2} />
      </div>
      <div>
        <div className="flex items-baseline space-x-3">
          <span className="text-4xl font-bold text-gray-900">{venue.length}</span>
          <span className="text-sm font-semibold text-gray-500">Your Venues</span>
        </div>
      </div>
    </div>
  </div>
);

const RecentBookings = ({ allBookings }) => (
  <div className="mb-10">
    {allBookings.length > 0 && (
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">All Bookings</h3>
      </div>
    )}
    
    <div className="space-y-4">
      {allBookings.map((item) => {
        const booking = item.booking;
        const venuePrice = item.venue_price;

        return (
          <div key={booking.id} className="relative bg-white border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`STATUS absolute backdrop-blur-sm rounded-2xl -left-1 -top-2 ${booking.status === "cancelled" ? "bg-[#ff535e]/90" : "bg-[#56bd7b]"}  text-white px-2 p-1 font-semibold text-xs`} >
              Status: {booking.status}
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto md:min-w-[180px]">
              <div className="flex flex-col items-start">
                <div className='flex gap-1 mb-1' >
                  <User size={16} className="rounded-full object-cover shadow-sm border border-gray-50" />
                  <p className={`font-bold text-sm text-gray-900 ${booking.user?.name || 'text-red-900' }`}>{booking.user?.name || "Offline Booking"}</p>
                </div>
                <div className='flex gap-1 mb-1' >
                  <Mail size={16} color="#3e517f" />
                  {/* FIX: Added optional chaining for email */}
                  <p className="text-xs font-semibold text-gray-500 whitespace-nowrap">{booking.user?.email || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-1 w-full border-t md:border-none border-gray-50 pt-4 md:pt-0 min-w-0">
              <div className="flex flex-col min-w-0 gap-1">
                {/* FIX: Added optional chaining for venue details just in case */}
                <p className="text-sm font-bold text-gray-800 mb-0.5 truncate">{booking.venue?.venue_name || "Unknown Venue"}</p>
                <p className="text-xs font-semibold text-gray-500 whitespace-nowrap truncate">{booking.venue?.venue_description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-1 w-full border-t md:border-none border-gray-50 pt-4 md:pt-0 min-w-0">
              <div className="flex flex-col min-w-0 gap-1">
                <div className='flex gap-1' >
                  <Calendar size={16} color="#3e517f" />
                  <p className="text-xs font-bold text-gray-800 mb-0.5 truncate">{booking.booking_date}</p>
                </div>
                <div className='flex gap-1' >
                  <MapPin size={16} color="#3e517f" />
                  <p className="text-xs font-semibold text-gray-500 whitespace-nowrap truncate ">{booking.venue?.location}</p>
                </div>
              </div>
            </div>

            {
              booking.order?.status === "refunded" ? (
                <div className="flex items-center gap-4 flex-1 w-full border-t md:border-none border-gray-50 pt-4 md:pt-0 min-w-0">
                  <div className="flex flex-col min-w-0 gap-1">
                    <h2 className="font-black text-[#ff535e] text-xs whitespace-nowrap">
                      Refunded Amount
                    </h2>
                    <div className="flex gap-1">
                      <p className="text-sm font-bold text-gray-900 mb-0.5 truncate">
                        ₹{(booking.order?.refunded_amount ?? 0) / 100}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 flex-1 w-full border-t md:border-none border-gray-50 pt-4 md:pt-0 min-w-0">
                  <div className="flex flex-col min-w-0 gap-1">
                    <h2 className="font-black text-[#ff535e] text-xs whitespace-nowrap">
                      Paid Amount
                    </h2>
                    <div className="flex gap-1">
                      <p className="text-sm font-bold text-gray-900 mb-0.5 truncate">
                        ₹{venuePrice}
                      </p>
                    </div>
                  </div>
                </div>
              )
            }
            
            {booking.start_time !== "" || booking.end_time !== "" ? (
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-none border-gray-50 pt-4 md:pt-0 shrink-0">
                <div>
                  <h2 className='font-black text-[#ff535e] text-xs whitespace-nowrap flex flex-col' >Start Time</h2>
                  <p className="font-black text-gray-900 text-sm whitespace-nowrap">{booking.start_time}</p>
                </div>
                <div>
                  <h2 className='font-black text-[#ff535e] text-xs whitespace-nowrap flex flex-col' >End Time</h2>
                  <p className="font-black text-gray-900 text-sm whitespace-nowrap"> {booking.end_time}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-none border-gray-50 pt-4 md:pt-0 shrink-0">
                <div>
                  <h2 className='font-black text-[#ff535e] text-xs whitespace-nowrap flex flex-col' >Venue Type</h2>
                  <p className="font-black text-gray-900 text-sm whitespace-nowrap">Day</p>
                </div>
                <div className='ml-12'></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

const OfflineBookingModal = ({ isOpen, onClose, venue, fetchVenues }) => {
  const [fullVenue, setFullVenue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState("hourly");
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch full details when the modal opens
  useEffect(() => {
    const fetchDetailedVenue = async () => {
      if (isOpen && venue?.id) {
        setIsLoading(true);
        try {
          const response = await apiService.getVenueByID(venue.id);
          setFullVenue(response);
        } catch (error) {
          console.error("Failed to fetch full venue details:", error);
          // Changed to toast.error
          toast.error("Failed to load venue details for booking."); 
          onClose();
        } finally {
          setIsLoading(false);
        }
      } else {
        setFullVenue(null);
        setSelectedTimes([]); 
      }
    };
    fetchDetailedVenue();
  }, [isOpen, venue]);

  if (!isOpen || !venue) return null;

  const SetTimeFromString = (dateObject, StringTime, type="timeSlot") => {
    if (!StringTime) return dateObject;
    const [time, modifier] = StringTime.split(" ");
    let [hour, minute] = time.split(":").map(Number);

    if(modifier === "PM" && hour < 12) hour += 12;
    if(modifier === "AM" && hour === 12) hour = 0;

    if(type === "razorpay"){
        return`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;  
    } else if (type === "timeSlot") {
        dateObject.setHours(hour, minute, 0, 0);
        return dateObject;
    };
  };

  const getFormattedStartAndEndTimes = (selectedTimesArray) => {
    let minStart = "23:59";
    let maxEnd = "00:00";
    selectedTimesArray.forEach(slot => {
        const [start, end] = slot.split(" - ");
        const start24 = SetTimeFromString(new Date(), start, "razorpay");
        const end24 = SetTimeFromString(new Date(), end, "razorpay");
        if(start24 < minStart) minStart = start24;
        if(end24 > maxEnd) maxEnd = end24;
    });
    return { start_time: minStart, end_time: maxEnd };
  };

  const handleFormatDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const date = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
  };

  const handleOfflineBooking = async () => {
    if (!fullVenue) return;
    
    try {
      setIsSubmitting(true);
      const isHourly = fullVenue.availability.booking_types === "hourly";

      if (isHourly && selectedTimes.length === 0) {
        // Changed to toast.error
        toast.error("Please select at least one time slot."); 
        setIsSubmitting(false);
        return;
      }

      let startTime = "";
      let endTime = "";

      if (isHourly && selectedTimes.length > 0) {
        const times = getFormattedStartAndEndTimes(selectedTimes);
        startTime = times.start_time;
        endTime = times.end_time;
      }

      const payload = {
        venue_id: fullVenue.id,
        booking_date: handleFormatDate(selectedDate),
        start_time: startTime,
        end_time: endTime
      };

      await apiService.OfflineBooking(payload);
      // Changed to toast.success
      toast.success("Offline booking successful!"); 
      fetchVenues();
      onClose();
    } catch (error) {
      console.error("Offline booking failed", error);
      // Changed to toast.error
      toast.error("Failed to create offline booking"); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Book Offline</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
            <X size={24} />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6 font-medium">Reserve "{venue.venue_name}" manually for an offline customer.</p>

        {/* Updated to use the imported Loading component */}
        {isLoading || !fullVenue ? (
          <div className="flex justify-center items-center py-12">
            <Loading LoadingText="Loading schedule..." />
          </div>
        ) : (
          <>
            <FormBooking 
              venue={fullVenue}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedSession={selectedSession}
              setSelectedSession={setSelectedSession}
              selectedTimes={selectedTimes}
              setSelectedTimes={setSelectedTimes}
              SetTimeFromString={SetTimeFromString}
            />

            <button
              onClick={handleOfflineBooking}
              disabled={isSubmitting}
              className="w-full mt-6 bg-[#ff5c5d] hover:bg-[#e05048] text-white py-3.5 rounded-xl font-semibold text-base transition-colors duration-200 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Booking..." : "Confirm Offline Booking"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};


const ListedProperties = ({ handleToggleAvailability, userVenues, setSelectedVenue, setIsEditOpen, setIsOfflineModalOpen }) => (
  <>
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h3 className="text-2xl font-bold text-gray-900">Listed Properties</h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
      {userVenues?.map(venue => (
        <div key={venue.id} className="relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="relative h-48 w-full">
            <img src={venue.image} alt={venue.venue_name} className="w-full h-full object-cover" />

            <button onClick={() => { setSelectedVenue(venue); setIsEditOpen(true); }}
              className='flex absolute text-gray-700 hover:text-black cursor-pointer right-2 top-2 rounded-xl p-2 bg-white/90 backdrop-blur-sm shadow-sm transition-colors' >
                <ExternalLink size={16} className='mr-1.5 mt-0.5' />
                <span className='text-sm font-bold'>Edit</span>
            </button>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className='mb-2' >
              <h4 className="font-bold text-gray-900 text-lg mb-1.5">{venue.venue_name}</h4>
              <div className='flex'>
                <MapPin size={18} color="#3e517f" />
                <h4 className="text-gray-700 text-sm mb-1.5 ml-1">{venue.location}</h4>
              </div>
            </div>
            <button onClick={() => { setSelectedVenue(venue); setIsOfflineModalOpen(true); }}
              className='flex absolute right-0 bottom-12 text-red-700 hover:text-black cursor-pointer p-2 transition-colors duration-500' >
                <span className='text-sm font-bold'>Book Offline</span>
                <ArrowLongRight size={16} className='mr-1.5 mt-0.5' />
            </button>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
              <p className="text-sm text-gray-500 font-semibold">₹{venue.price}<span className={" text-xs text-[#ff485e] py-1"} >/{venue.booking_types === "hourly" ? "hour" : "day"}</span> </p>
              <ToggleSwitch isActive={venue.is_available}
               venue={venue}
               onToggle={handleToggleAvailability}  
              />
            </div>
          </div>
        </div>
      ))}

      <Link to="/host/dashboard/list-new-venues" className="border-2 cursor-pointer border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center h-full min-h-[280px] text-gray-500 hover:text-[#ff5c5d] hover:border-[#ff5c5d] hover:bg-[#fff9f9] transition-colors group">
        <div className="bg-white rounded-full p-4 shadow-sm mb-4 border border-gray-50 group-hover:border-[#ff5c5d]/20 transition-colors">
          <PlusCircle size={28} className="text-[#ff5c5d]" />
        </div>
        <span className="font-bold text-base">Add New Venue</span>
      </Link>
    </div>
  </>
);

// ==========================================
// 4. MAIN PARENT COMPONENT
// ==========================================

export default function OwnerDashboard() {
  const navigate = useNavigate();

  const [userVenues, setUserVenues] = useState([]);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [ownerRevenue, setOwnerRevenue] = useState(0);
  const [allBookings, setAllBookings] = useState([]);
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false); // Added State
  const [selectedVenue, setSelectedVenue] = useState(null);

  const onCloseEdit = () => setIsEditOpen(false);
  const onCloseOffline = () => setIsOfflineModalOpen(false); // Added Handler

  const handleToggleAvailability = async (venue) => {
    try {
      const ToggledAvailability = !venue.is_available;
      const statusPayload = ToggledAvailability ? "active" : "inactive";

      const payload = {
        status: statusPayload,
        reason: "Reason of the Owner."
      };

      await apiService.updateVenueAvailability(payload, venue.id);

      setUserVenues(prevVenues => prevVenues.map(v => 
        v.id === venue.id ? { ...v, is_available: ToggledAvailability } : v
      )); 

    } catch (error) {
      toast.error("Venue is rejected/pending. Please wait for approval if rejected you will recieve an email with the reason.");
      console.error(error);
    }
  }

  const fetchVenues = async () => {
    try {
      const response = await apiService.GetOwnerVenues(Cookies.get('userId'));

      const revenueResponse = await apiService.GetOwnerRevenue();      
      setOwnerRevenue(revenueResponse.total_earnings);

      const allBookingsData = await apiService.GetAllBookingForOwner();
      setAllBookings(Array.isArray(allBookingsData) ? allBookingsData : []);
      
      if (Array.isArray(response)){
        setUserVenues(response);
      } else {
        setUserVenues([]);
      }
      
    } catch (error) {
      console.log(error);
      setUserVenues([]);
      setAllBookings([]);
    }
  }

  useEffect(() => {
    fetchVenues();
  }, []);

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
      
      <Toaster />

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen}
        navigate={navigate} 
      />

      <main className="flex-1 overflow-y-auto w-full relative">
        <div className="lg:hidden flex items-center justify-between bg-white px-6 py-4 border-b border-gray-100 sticky top-0 z-30">
          <img src={Logo} alt="BookMyVenue" className="w-55 font-black text-[#8b3d2c] tracking-tight" />
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="max-w-[1400px] mx-auto p-6 md:p-10 lg:p-12">
          <TopHeader />
          <StatsOverview venue={userVenues} ownerRevenue={ownerRevenue} />
          <RecentBookings allBookings={allBookings} />
          
          <EditVenueModal 
            isOpen={isEditOpen} 
            venueData={selectedVenue} 
            onClose={onCloseEdit} 
            fetchVenues={fetchVenues} 
          />

          {/* New Offline Booking Modal Rendered Here */}
          <OfflineBookingModal 
            isOpen={isOfflineModalOpen}
            onClose={onCloseOffline}
            venue={selectedVenue}
            fetchVenues={fetchVenues}
          />

          <ListedProperties 
            handleToggleAvailability={handleToggleAvailability}
            userVenues={userVenues} 
            setSelectedVenue={setSelectedVenue} 
            setIsEditOpen={setIsEditOpen}
            setIsOfflineModalOpen={setIsOfflineModalOpen} 
          />
        </div>
      </main>
    </div>
  );
}