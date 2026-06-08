import React, { useState, useEffect } from'react';
import { useNavigate } from'react-router-dom';
import { fetchMyVenues, updateBookingStatus } from '../services/venueApi';
import { fetchVenueBookings } from '../services/bookingApi';
import { fetchVenueAnalytics as fetchAnalyticsAPI } from '../services/venueApi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PartnerDashboard = () => {
 const navigate = useNavigate();
 const [venues, setVenues] = useState([]);
 const [selectedVenue, setSelectedVenue] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 const [bookings, setBookings] = useState([]);
 const [loadingBookings, setLoadingBookings] = useState(false);
 const [analytics, setAnalytics] = useState({ total_revenue: 0, total_bookings: 0 });

 useEffect(() => {
 loadVenues();
 loadAnalytics();
 }, []);

 const loadAnalytics = async () => {
   try {
     const data = await fetchAnalyticsAPI();
     setAnalytics(data);
   } catch (err) {
     console.error("Failed to load analytics", err);
   }
 };

 useEffect(() => {
 if (selectedVenue) {
 loadBookings(selectedVenue.id);
 }
 }, [selectedVenue]);

 const loadBookings = async (venueId) => {
 try {
 setLoadingBookings(true);
 const data = await fetchVenueBookings(venueId);
 setBookings(data);
 } catch (err) {
 console.error(err);
 } finally {
 setLoadingBookings(false);
 }
 };

 const loadVenues = async () => {
 try {
 setLoading(true);
 const data = await fetchMyVenues();
 setVenues(data);
 } catch (err) {
 setError(err.message);
 } finally {
 setLoading(false);
 }
 };

 const handleStatusUpdate = async (bookingId, newStatus) => {
 try {
 await updateBookingStatus(bookingId, newStatus);
 // Update local state
 setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
 } catch (err) {
 alert(err.message || `Failed to ${newStatus.toLowerCase()} booking`);
 }
 };


 if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

 return (
 <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
  <div className="flex justify-between items-center mb-8">
  <h1 className="text-3xl font-bold text-slate-100">Partner Dashboard</h1>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6">
  <h3 className="text-slate-400 font-medium mb-1">Your Venues</h3>
  <p className="text-3xl font-bold text-slate-100">{venues.length}</p>
  </div>
  <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6">
  <h3 className="text-slate-400 font-medium mb-1">Total Bookings</h3>
  <p className="text-3xl font-bold text-slate-100">{analytics.total_bookings}</p>
  </div>
  <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6">
  <h3 className="text-slate-400 font-medium mb-1">Total Revenue</h3>
  <p className="text-3xl font-bold text-indigo-400">
  ${analytics.total_revenue}
  </p>
  </div>
  </div>

  <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6 mb-8">
    <h3 className="text-xl font-semibold mb-4 text-slate-100">Analytics Overview</h3>
    <div className="h-64">
      <Bar 
        data={{
          labels: ['Total Venues', 'Total Bookings', 'Revenue ($100s)'],
          datasets: [{
            label: 'Overview Metrics',
            data: [venues.length, analytics.total_bookings, analytics.total_revenue / 100],
            backgroundColor: ['#6366f1', '#10b981', '#f59e0b'],
          }]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        }}
      />
    </div>
  </div>
 
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Sidebar: Venues */}
  <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-4">
  <h2 className="text-xl font-semibold mb-4 text-slate-100">Your Venues</h2>
  <div className="space-y-2">
  {venues.map(v => (
  <button 
  key={v.id}
  onClick={() => setSelectedVenue(v)}
  className={`w-full text-left p-3 rounded-lg border ${selectedVenue?.id === v.id ?'bg-slate-800 border-slate-700 text-indigo-400':'border-transparent text-slate-300 hover:bg-slate-800/50'}`}
  >
  <div className="flex items-center space-x-3">
  {v.photos && v.photos.length > 0 && (
  <img src={v.photos[0]} alt={v.name} className="w-10 h-10 rounded-md object-cover"/>
  )}
  <div>
  <div className="font-medium text-slate-200">{v.name}</div>
  <div className="text-xs text-slate-500 uppercase">{v.inventory_type}</div>
  </div>
  </div>
  </button>
  ))}
  </div>
  </div>

 {/* Main Content: Event & Matrix Management */}
 <div className="col-span-2 space-y-6">
  {selectedVenue ? (
  <>
  <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6">
  <div className="flex justify-between items-center mb-4">
  <h2 className="text-xl font-semibold text-slate-100">Manage {selectedVenue.name}</h2>
  <button onClick={() => navigate(`/venues/${selectedVenue.id}/edit`, { state: { venue: selectedVenue } })} className="text-sm font-medium text-indigo-400 hover:text-indigo-300 bg-slate-800 px-3 py-1.5 rounded-lg transition-colors border border-slate-700">
  Edit Venue
  </button>
  </div>
  
  <h3 className="text-lg font-medium mb-3 mt-6 border-t pt-4 border-slate-800 text-slate-200">Recent Bookings</h3>
  {loadingBookings ? (
  <div className="text-sm text-slate-400 py-4">Loading bookings...</div>
  ) : bookings.length === 0 ? (
  <div className="text-sm text-slate-500 py-4 italic">No bookings found for this venue.</div>
  ) : (
  <div className="overflow-x-auto">
  <table className="w-full text-left border-collapse">
  <thead>
  <tr className="border-b border-slate-800 bg-slate-900/50">
  <th className="p-3 text-sm font-semibold text-slate-400">ID</th>
  <th className="p-3 text-sm font-semibold text-slate-400">Status</th>
  <th className="p-3 text-sm font-semibold text-slate-400">Date/Time</th>
  <th className="p-3 text-sm font-semibold text-slate-400">Tickets</th>
  <th className="p-3 text-sm font-semibold text-slate-400 text-right">Actions</th>
  </tr>
  </thead>
  <tbody className="divide-y divide-slate-800/50">
  {bookings.map(b => (
  <tr key={b.id} className="hover:bg-slate-800/50 transition-colors">
  <td className="p-3 text-sm text-slate-300">#{b.id}</td>
  <td className="p-3">
  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${b.status ==='CONFIRMED'?'bg-green-900/30 text-green-400 border border-green-800/50': b.status ==='CANCELLED'?'bg-red-900/30 text-red-400 border border-red-800/50':'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50'}`}>
  {b.status}
  </span>
  </td>
  <td className="p-3 text-sm text-slate-300">
  {new Date(b.start_time).toLocaleString()} - {new Date(b.end_time).toLocaleString()}
  </td>
  <td className="p-3 text-sm text-slate-300">{b.tickets_count}</td>
  <td className="p-3 text-sm text-right space-x-2">
    {b.status === 'PENDING' && (
      <>
        <button onClick={() => handleStatusUpdate(b.id, 'CONFIRMED')} className="px-3 py-1 bg-green-900/40 text-green-400 hover:bg-green-800/60 rounded-md transition-colors border border-green-800/50">Accept</button>
        <button onClick={() => handleStatusUpdate(b.id, 'CANCELLED')} className="px-3 py-1 bg-red-900/40 text-red-400 hover:bg-red-800/60 rounded-md transition-colors border border-red-800/50">Reject</button>
      </>
    )}
    {b.status === 'CONFIRMED' && (
      <button onClick={() => handleStatusUpdate(b.id, 'CANCELLED')} className="px-3 py-1 bg-red-900/40 text-red-400 hover:bg-red-800/60 rounded-md transition-colors border border-red-800/50">Cancel Booking</button>
    )}
  </td>
  </tr>
  ))}
  </tbody>
  </table>
  </div>
  )}
  </div>

 </>
 ) : (
  <div className="bg-slate-900 border border-dashed border-slate-800 rounded-xl p-10 text-center text-slate-500">
  Select a venue from the sidebar to view its bookings.
  </div>
 )}
 </div>
 </div>
 </div>
 );
};

export default PartnerDashboard;
