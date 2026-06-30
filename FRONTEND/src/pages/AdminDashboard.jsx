import React, { useState } from 'react';

// ==========================================
// 1. DUMMY DATA (Replace with API data)
// ==========================================
const USERS_DATA = [
  { id: 1, initials: 'ES', name: 'Elena Santos', role: 'Host', joinDate: 'Oct 12, 2023', status: 'Active', avatarBg: 'bg-[#2a5660] text-white' },
  { id: 2, initials: 'MJ', name: 'Marcus Johnson', role: 'Guest', joinDate: 'Nov 05, 2023', status: 'Active', avatarBg: 'bg-gray-500 text-white' },
  { id: 3, initials: 'SL', name: 'Sarah Lee', role: 'Host', joinDate: 'Dec 01, 2023', status: 'Pending', avatarBg: 'bg-[#ff5c5d] text-white' },
];

const PENDING_VENUES = [
  { 
    id: 1, 
    name: 'Sunrise Yoga Studio', 
    host: 'Elena Santos', 
    location: 'Downtown, 1st Avenue',
    price: '₹1,200',
    image: 'https://images.unsplash.com/photo-1599438012674-124b81c2f974?q=80&w=150&h=100&auto=format&fit=crop'
  },
  { 
    id: 2, 
    name: 'The Oak Meeting Room', 
    host: 'James Carter', 
    location: 'Westside Business Park',
    price: '₹850',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=150&h=100&auto=format&fit=crop'
  },
];

// ==========================================
// 2. REUSABLE UI COMPONENTS
// ==========================================
const SidebarItem = ({ svgPath, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full cursor-pointer flex items-center space-x-4 px-5 py-3.5 rounded-xl transition-colors text-sm font-semibold ${
      isActive ? 'bg-[#ff5c5d] text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <svg className={`w-[22px] h-[22px] ${isActive ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {svgPath}
    </svg>
    <span>{label}</span>
  </button>
);

// ==========================================
// 3. MAIN PARENT COMPONENT
// ==========================================
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR (Matches OwnerDashboard) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.02)] transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex-1 overflow-y-auto">
          
          {/* Logo & Mobile Close */}
          <div className="px-8 py-8 flex justify-between items-center">
            <h1 className="text-2xl font-black text-[#8b3d2c] tracking-tight">BookMyVenue</h1>
            <button className="lg:hidden text-gray-500 hover:text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Profile Card */}
          <div className="px-6 mb-8">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-[#2a5660] text-white flex items-center justify-center font-bold shadow-sm">
                AD
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">System Admin</p>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Full Access</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-6 space-y-2">
            <SidebarItem 
              svgPath={<><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></>}
              label="Dashboard" 
              isActive={activeTab === 'Dashboard'} 
              onClick={() => { setActiveTab('Dashboard'); setIsMobileMenuOpen(false); }} 
            />
             <SidebarItem 
              svgPath={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></>}
              label="User Directory" 
              isActive={activeTab === 'Users'} 
              onClick={() => { setActiveTab('Users'); setIsMobileMenuOpen(false); }} 
            />
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto w-full relative">
        
        {/* Mobile Navbar Header */}
        <div className="lg:hidden flex items-center justify-between bg-white px-6 py-4 border-b border-gray-100 sticky top-0 z-30">
          <h1 className="text-xl font-black text-[#8b3d2c] tracking-tight">BookMyVenue</h1>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>

        {/* Dashboard Content Container (Matches Owner max-w and padding) */}
        <div className="max-w-[1400px] mx-auto p-6 md:p-10 lg:p-12">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">Admin Portal</h2>
              <p className="text-gray-500 font-medium">Manage community spaces, host requests, and users.</p>
            </div>
          </header>

          {/* Quick Stats (Styled exactly like Owner stats) */}
          <div className="bg-white border border-gray-100 rounded-2xl flex flex-col md:flex-row items-center justify-between p-2 mb-10 shadow-sm">
            <div className="flex-1 w-full flex items-center space-x-5 p-6 md:border-r border-gray-100">
              <div className="bg-blue-50 p-4 rounded-xl text-blue-400">
                 <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <div>
                <div className="flex items-baseline space-x-3">
                  <span className="text-4xl font-bold text-gray-900">1,248</span>
                  <span className="text-sm font-semibold text-gray-500">Total Users</span>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full flex items-center space-x-5 p-6 border-t md:border-t-0 border-gray-100">
              <div className="bg-red-50 p-4 rounded-xl text-red-400">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <div>
                <div className="flex items-baseline space-x-3">
                  <span className="text-4xl font-bold text-gray-900">{PENDING_VENUES.length}</span>
                  <span className="text-sm font-semibold text-gray-500">Pending Venues</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            
            {/* 1. USER MANAGEMENT SECTION */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">User Management</h3>
                <button className="text-[#8b3d2c] text-sm font-bold hover:underline">View All &rarr;</button>
              </div>
              
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Join Date</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {USERS_DATA.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${user.avatarBg}`}>
                              {user.initials}
                            </div>
                            <span className="font-bold text-gray-900 text-sm">{user.name}</span>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-600">{user.role}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-500 whitespace-nowrap">{user.joinDate}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                              user.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 2. VENUE APPROVALS SECTION (Styled like RecentBookings) */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-gray-900">Venue Approvals</h3>
                  <span className="px-2.5 py-0.5 bg-[#ff5c5d] text-white text-xs font-bold rounded-full">
                    {PENDING_VENUES.length} Action Required
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {PENDING_VENUES.map(venue => (
                  <div key={venue.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm hover:shadow-md transition-shadow">
                    
                    {/* Venue Image & Info */}
                    <div className="flex items-center gap-4 flex-1 w-full min-w-0">
                      <img src={venue.image} alt={venue.name} className="w-16 h-12 md:w-20 md:h-14 rounded-lg object-cover shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm md:text-base font-bold text-gray-900 mb-0.5 truncate">{venue.name}</p>
                        <p className="text-xs font-semibold text-gray-500 truncate">Host: {venue.host} &bull; {venue.location}</p>
                      </div>
                    </div>

                    {/* Action Area */}
                    <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-none border-gray-50 pt-4 md:pt-0 shrink-0">
                      <p className="font-black text-gray-900 text-lg whitespace-nowrap">{venue.price}<span className="text-xs text-gray-500 font-semibold">/hr</span></p>
                      <div className="flex gap-2">
                        <button className="bg-[#2a5660] hover:bg-[#1f4048] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                          Approve
                        </button>
                        <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                          Reject
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}