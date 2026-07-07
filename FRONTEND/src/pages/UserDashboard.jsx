import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { 
  Layout, Building, MapPin, Menu, X, 
  Calendar, Clock1, SlashCircle 
} from '@mynaui/icons-react';
import Logo from '../assets/Logo.png';
import apiService from '../services/apiService';

// ==========================================
// 1. SIDEBAR COMPONENT
// ==========================================
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

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, navigate }) => (
  <>
    {/* Mobile Overlay Background */}
    {isOpen && (
      <div 
        className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />
    )}

    {/* Sidebar Container */}
    <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.02)] transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex-1 overflow-y-auto">
        {/* Logo & Mobile Close Button */}
        <div className="px-8 py-8 flex justify-between items-center">
          <img src={Logo} alt="BookMyVenue" className="text-2xl font-black text-[#8b3d2c] tracking-tight w-40" />
          <button className="lg:hidden text-gray-500 hover:text-gray-900" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Profile Card */}
        <div className="px-6 mb-8">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center space-x-4">
            <div>
              <p className="text-sm font-bold text-gray-900">Welcome, <span className='text-[#2e7078]'>{Cookies.get("userName") || "User"}</span></p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">Guest Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-6 space-y-2">
          <SidebarItem icon={Building} label="Homepage" isActive={activeTab === 'Homepage'} onClick={() => { setActiveTab('Homepage'); setIsOpen(false); navigate("/"); }} />
          <SidebarItem icon={Layout} label="My Bookings" isActive={activeTab === 'My Bookings'} onClick={() => { setActiveTab('My Bookings'); setIsOpen(false); }} />
        </nav>
      </div>
    </aside>
  </>
);

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function UserBookings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('My Bookings');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  console.log(bookings);
  
  // Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

// Fetch User Bookings
  useEffect(() => {
    const fetchBookings = async () => {
        const response = await apiService.UserMyBooking();
        setBookings(response)
    }
    fetchBookings()
  }, []);

  // Open the cancel modal
  const handleOpenCancelModal = (booking) => {
    setSelectedBooking(booking);
    setCancelReason("");
    setIsCancelModalOpen(true);
  };

  // Execute Cancellation
  const executeCancellation = async () => {
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation.");
      return;
    }

    const payload = {
      booking_id: selectedBooking.id,
      order_id: selectedBooking.order_id,
      cancel_reason: cancelReason
    };

    console.log("SENDING CANCELLATION PAYLOAD TO BACKEND:", payload);

    try {
      const response = await apiService.cancelBooking(payload);
      console.log(response);
      
        //   Update UI
      setBookings(prev => prev.map(b => 
        b.id === selectedBooking.id ? { ...b, status: 'cancelled' } : b
      ));

      setIsCancelModalOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen}
        navigate={navigate} 
      />

      <main className="flex-1 overflow-y-auto w-full relative">
        {/* Mobile Navbar Header */}
        <div className="lg:hidden flex items-center justify-between bg-white px-6 py-4 border-b border-gray-100 sticky top-0 z-30">
          <img src={Logo} alt="BookMyVenue" className="w-40 font-black text-[#8b3d2c] tracking-tight" />
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="max-w-[1200px] mx-auto p-6 md:p-10 lg:p-12">
          
          <header className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">My Bookings</h2>
            <p className="text-gray-500 font-medium">View and manage your upcoming reservations.</p>
          </header>

          {/* Bookings List */}
          <div className="space-y-4">
            {bookings.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
                    <p className="text-gray-500 font-medium">You have no bookings yet.</p>
                </div>
            ) : (
                bookings.map(booking => (
                <div key={booking.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
                    
                    {/* Venue Details */}
                    <div className="flex items-start gap-4 flex-1 w-full min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-[#2a5660]/10 flex items-center justify-center shrink-0">
                            <Building size={24} className="text-[#2a5660]" />
                        </div>
                        <div className="flex flex-col min-w-0 gap-1">
                            <p className="text-lg font-bold text-gray-900 mb-0.5 truncate">{booking.venue.venue_name}</p>
                            <div className='flex items-center gap-1'>
                                <MapPin size={16} className="text-gray-400" />
                                <p className="text-sm font-semibold text-gray-500 truncate">{booking.venue.location}</p>
                            </div>
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 flex-1 w-full border-t lg:border-none border-gray-50 pt-4 lg:pt-0">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</p>
                            <div className='flex items-center gap-1.5'>
                                <Calendar size={18} className="text-[#3e517f]" />
                                <span className="font-bold text-gray-900">{booking.booking_date}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Time</p>
                            <div className='flex items-center gap-1.5'>
                                <Clock1 size={18} className="text-[#3e517f]" />
                                <span className="font-bold text-gray-900">
                                    {booking.start_time && booking.end_time 
                                        ? `${booking.start_time} - ${booking.end_time}`
                                        : "Full Day"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status & Action */}
                    <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto border-t lg:border-none border-gray-50 pt-4 lg:pt-0 shrink-0">
                        {booking.status === 'confirmed' ? (
                            <span className="inline-flex px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-green-50 text-green-600 border border-green-100">
                                Confirmed
                            </span>
                        ) : (
                            <span className="inline-flex px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-red-50 text-red-600 border border-red-100">
                                Cancelled
                            </span>
                        )}

                        {/* Only show cancel button if it is still confirmed */}
                        {booking.status === 'confirmed' && (
                            <button 
                                onClick={() => handleOpenCancelModal(booking)}
                                className="px-4 py-2 text-sm font-bold text-red-500 hover:text-white border border-red-100 hover:bg-red-500 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                </div>
                ))
            )}
          </div>
        </div>

        {/* <div className='bg-[#ff535e] p-3 pl-5 rounded-3xl text-white font-medium mx-12' >
            <h1 className='text-xl font-bold' >REFUND POLICY</h1>
            <p>
                - if current date and booking date is more than 24 hours, then refund is not allowed <br />
                - if cancelled within 24 hours, then refund is allowed 30% of the amount <br />
                - if 3 days before the booking date, then refund is allowed 50% of the amount <br />
                - if 7 days before the booking date, then refund is allowed 70% of the amount <br />
                - else no refund is allowed
            </p>
        </div> */}
      </main>

      {/* ==========================================
          CANCELLATION MODAL
          ========================================== */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden transform transition-all">
                
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <SlashCircle className="text-red-500" size={20} />
                        Cancel Booking
                    </h3>
                    <button 
                        onClick={() => setIsCancelModalOpen(false)}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4">
                        You are about to cancel your booking for <span className="font-bold text-gray-900">{selectedBooking?.venue?.venue_name}</span> on <span className="font-bold text-gray-900">{selectedBooking?.booking_date}</span>.
                    </p>

                    <label className="block text-sm font-bold text-gray-900 mb-2">Reason for Cancellation <span className="text-red-500">*</span></label>
                    <textarea 
                        rows={3}
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Please briefly explain why you are cancelling..."
                        className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-gray-50 resize-none"
                    />
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button
                        onClick={() => setIsCancelModalOpen(false)}
                        className="px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-200 font-semibold text-sm transition-colors"
                    >
                        Keep Booking
                    </button>
                    <button
                        onClick={executeCancellation}
                        className="px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-sm shadow-sm transition-colors"
                    >
                        Confirm Cancellation
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}