import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Layout, Building, Rupee, Cog, PlusCircle, Bell, Message, 
  Clock1, MapPin, DotsVertical, Star, Menu, X 
} from '@mynaui/icons-react';

// ==========================================
// 1. MOCK DATA (Move to a separate data.js file later)
// ==========================================
const RECENT_BOOKINGS = [
  { id: 1, guestName: 'Sarah Jenkins', guestAvatar: 'https://i.pravatar.cc/150?u=sarah', status: 'PENDING', venueName: 'Maple Community Hall', venueImage: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=150&q=80', date: 'Oct 24, 14:00 - 18:00', price: '$120.00' },
  { id: 2, guestName: 'Alex Miller', guestAvatar: 'https://i.pravatar.cc/150?u=alex', status: 'CONFIRMED', venueName: 'Skyline Rooftop Garden', venueImage: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=150&q=80', date: 'Oct 26, 18:00 - 22:00', price: '$300.00' }
];

const LISTED_PROPERTIES = [
  { id: 1, name: 'Maple Hall', price: '$45/hr', rating: '4.9', image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=400&q=80', isActive: true },
  { id: 2, name: 'Skyline Rooftop', price: '$75/hr', rating: '4.7', image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=400&q=80', isActive: true },
  { id: 3, name: 'Art Studio', price: '$35/hr', rating: '5.0', image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=400&q=80', isActive: false }
];

// ==========================================
// 2. REUSABLE UI COMPONENTS
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

const ToggleSwitch = ({ isActive }) => (
  <div className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isActive ? 'bg-[#2a5660]' : 'bg-gray-300'}`}>
    <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${isActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
  </div>
);

// ==========================================
// 3. LAYOUT COMPONENTS
// ==========================================

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen,navigate }) => (
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
          <h1 className="text-2xl font-black text-[#8b3d2c] tracking-tight">BookMyVenue</h1>
          <button className="lg:hidden text-gray-500 hover:text-gray-900" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Profile Card */}
        <div className="px-6 mb-8">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center space-x-4">
            <img src="https://i.pravatar.cc/150?u=host" alt="Host" className="w-12 h-12 rounded-full object-cover shadow-sm" />
            <div>
              <p className="text-sm font-bold text-gray-900">Neighborhood Host</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">Host since 2023</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-6 space-y-2">
          <SidebarItem icon={Building} label="Homepage" isActive={activeTab === 'My Venues'} onClick={() => { setActiveTab('My Venues'); setIsOpen(false); navigate("/host") }} />
          <SidebarItem icon={Layout} label="Dashboard" isActive={activeTab === 'Dashboard'} onClick={() => { setActiveTab('Dashboard'); setIsOpen(false); }} />
        </nav>
      </div>

      {/* Bottom Action */}
      <Link to="/host/dashboard/list-new-venues" className="p-6 border-t border-gray-100 cursor-pointer bg-white">
        <button className="w-full bg-[#8b3d2c] hover:bg-[#733224] text-white flex items-center justify-center space-x-2 py-4 rounded-xl transition-colors font-semibold text-sm shadow-sm">
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

const StatsOverview = () => (
  <div className="bg-white border border-gray-100 rounded-2xl flex flex-col md:flex-row items-center justify-between p-2 mb-10 shadow-sm">
    <div className="flex-1 w-full flex items-center space-x-5 p-6 md:border-r border-gray-100">
      <div className="bg-red-50 p-4 rounded-xl text-red-400">
        <Clock1 size={28} strokeWidth={2} />
      </div>
      <div>
        <div className="flex items-baseline space-x-3">
          <span className="text-4xl font-bold text-gray-900">12</span>
          <span className="text-sm font-semibold text-gray-500">Pending Requests</span>
        </div>
      </div>
    </div>
    <div className="flex-1 w-full flex items-center space-x-5 p-6 md:border-r border-gray-100 border-t md:border-t-0">
      <div className="bg-blue-50 p-4 rounded-xl text-blue-400">
        <Rupee size={28} strokeWidth={2} />
      </div>
      <div>
        <div className="flex items-baseline space-x-3">
          <span className="text-4xl font-bold text-gray-900">28k</span>
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
          <span className="text-4xl font-bold text-gray-900">5</span>
          <span className="text-sm font-semibold text-gray-500">Active Venues</span>
        </div>
      </div>
    </div>
  </div>
);

const RecentBookings = () => (
  <div className="mb-10">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-bold text-gray-900">Recent Bookings</h3>
    </div>
    
    <div className="space-y-4">
      {RECENT_BOOKINGS.map(booking => (
        <div key={booking.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 w-full md:w-auto md:min-w-[180px]">
            <img src={booking.guestAvatar} alt={booking.guestName} className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-50" />
            <div className="flex flex-col items-start">
              <p className="font-bold text-gray-900 text-sm mb-1">{booking.guestName}</p>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                booking.status === 'PENDING' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {booking.status}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-1 w-full border-t md:border-none border-gray-50 pt-4 md:pt-0 min-w-0">
            <img src={booking.venueImage} alt="Venue" className="w-14 h-10 rounded-lg object-cover shrink-0" />
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-bold text-gray-800 mb-0.5 truncate">{booking.venueName}</p>
              <p className="text-xs font-semibold text-gray-500 whitespace-nowrap">{booking.date}</p>
            </div>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-none border-gray-50 pt-4 md:pt-0 shrink-0">
            <p className="font-black text-gray-900 text-lg whitespace-nowrap">{booking.price}</p>
            {booking.status === 'PENDING' ? (
              <div className="flex gap-2">
                <button className="bg-[#2a5660] hover:bg-[#1f4048] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">Accept</button>
                <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Decline</button>
              </div>
            ) : (
              <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-50">
                <DotsVertical size={24} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ListedProperties = () => (
  <>
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h3 className="text-2xl font-bold text-gray-900">Listed Properties</h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
      {LISTED_PROPERTIES.map(venue => (
        <div key={venue.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="relative h-48 w-full">
            <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-sm">
              <Star size={14} className="text-[#ff5c5d] fill-[#ff5c5d]" />
              <span className="text-xs font-bold text-gray-900">{venue.rating}</span>
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-gray-900 text-base mb-1.5">{venue.name}</h4>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
              <p className="text-sm text-gray-500 font-semibold">{venue.price}</p>
              <ToggleSwitch isActive={venue.isActive} />
            </div>
          </div>
        </div>
      ))}

      <button className="border-2 cursor-pointer border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center h-full min-h-[280px] text-gray-500 hover:text-[#ff5c5d] hover:border-[#ff5c5d] hover:bg-[#fff9f9] transition-colors group">
        <div className="bg-white rounded-full p-4 shadow-sm mb-4 border border-gray-50 group-hover:border-[#ff5c5d]/20 transition-colors">
          <PlusCircle size={28} className="text-[#ff5c5d]" />
        </div>
        <span className="font-bold text-base">Add New Venue</span>
      </button>
    </div>
  </>
);

// ==========================================
// 4. MAIN PARENT COMPONENT
// ==========================================

export default function OwnerDashboard() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
      
      {/* Extracted Sidebar Component */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen}
        navigate={navigate} 
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto w-full relative">
        
        {/* Mobile Navbar Header (Only visible on small screens) */}
        <div className="lg:hidden flex items-center justify-between bg-white px-6 py-4 border-b border-gray-100 sticky top-0 z-30">
          <h1 className="text-xl font-black text-[#8b3d2c] tracking-tight">BookMyVenue</h1>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Dashboard Content Container */}
        <div className="max-w-[1400px] mx-auto p-6 md:p-10 lg:p-12">
          
          {/* Stacking the extracted components sequentially */}
          <TopHeader />
          <StatsOverview />
          
          <RecentBookings />
          
          <ListedProperties />
          
        </div>
      </main>

    </div>
  );
}