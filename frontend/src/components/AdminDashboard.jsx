import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAdminUsers, fetchAdminBookings, deleteAdminVenue, deleteAdminUser, moderateAdminVenue } from '../services/adminApi';
import { fetchVenues, updateBookingStatus } from '../services/venueApi';
import EditUserModal from './EditUserModal';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  const [activeTab, setActiveTab] = useState('users');

  const loadData = async () => {
    try {
      const [u, v, b] = await Promise.all([
        fetchAdminUsers(),
        fetchVenues({ limit: 100000 }),
        fetchAdminBookings()
      ]);
      setUsers(u);
      setVenues(v);
      setBookings(b);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteVenue = async (id) => {
    if (confirm("Are you sure you want to delete this venue? This will also delete its bookings.")) {
      const originalVenues = [...venues];
      setVenues(venues.filter(v => v.id !== id));
      try {
        await deleteAdminVenue(id);
      } catch (err) {
        setVenues(originalVenues);
        alert("Failed to delete venue: " + err.message);
      }
    }
  };

  const handleModerateVenue = async (id, status) => {
    try {
      await moderateAdminVenue(id, status);
      setVenues(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    } catch (err) {
      alert("Failed to moderate venue: " + err.message);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    } catch (err) {
      alert(err.message || `Failed to ${newStatus.toLowerCase()} booking`);
    }
  };

  const handleDeleteUser = async (id) => {
    if (confirm("Are you sure you want to delete this user? This will also delete all their venues and bookings.")) {
      const originalUsers = [...users];
      setUsers(users.filter(u => u.id !== id));
      try {
        await deleteAdminUser(id);
        loadData(); // Quietly reload in background to update venue/booking counts
      } catch (err) {
        setUsers(originalUsers);
        alert("Failed to delete user: " + err.message);
      }
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Admin Dashboard...</div>;

  return (
    <div className="space-y-12 animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-100">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => setActiveTab('users')}
          className={`p-6 rounded-2xl shadow-sm border cursor-pointer transition-colors ${activeTab === 'users' ? 'bg-indigo-900/30 border-indigo-800 text-slate-100' : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'}`}
        >
          <h3 className="text-lg font-semibold opacity-80">Total Users</h3>
          <p className="text-4xl font-bold text-indigo-400 mt-2">{users.length}</p>
        </div>
        <div 
          onClick={() => setActiveTab('venues')}
          className={`p-6 rounded-2xl shadow-sm border cursor-pointer transition-colors ${activeTab === 'venues' ? 'bg-indigo-900/30 border-indigo-800 text-slate-100' : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'}`}
        >
          <h3 className="text-lg font-semibold opacity-80">Total Venues</h3>
          <p className="text-4xl font-bold text-indigo-400 mt-2">{venues.length}</p>
        </div>
        <div 
          onClick={() => setActiveTab('bookings')}
          className={`p-6 rounded-2xl shadow-sm border cursor-pointer transition-colors ${activeTab === 'bookings' ? 'bg-indigo-900/30 border-indigo-800 text-slate-100' : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'}`}
        >
          <h3 className="text-lg font-semibold opacity-80">Total Bookings</h3>
          <p className="text-4xl font-bold text-indigo-400 mt-2">{bookings.length}</p>
        </div>
      </div>

      {activeTab === 'venues' && (
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-xl font-bold text-slate-100">Venues Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/50 text-slate-400 text-sm font-medium border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {venues.map(v => (
                  <tr key={v.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">#{v.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-200">{v.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{v.location}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        v.status === 'APPROVED' ? 'bg-green-900/30 text-green-400 border border-green-800/50' :
                        v.status === 'REJECTED' ? 'bg-red-900/30 text-red-400 border border-red-800/50' :
                        'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50'
                      }`}>
                        {v.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {(!v.status || v.status === 'PENDING') && (
                        <>
                          <button onClick={() => handleModerateVenue(v.id, 'APPROVED')} className="text-green-400 hover:text-green-300 text-sm font-medium">Approve</button>
                          <button onClick={() => handleModerateVenue(v.id, 'REJECTED')} className="text-red-400 hover:text-red-300 text-sm font-medium">Reject</button>
                        </>
                      )}
                      <button 
                        onClick={() => navigate(`/venues/${v.id}/edit`, { state: { venue: v } })}
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium ml-2"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteVenue(v.id)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {venues.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No venues found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-xl font-bold text-slate-100">Users Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/50 text-slate-400 text-sm font-medium border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">#{u.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-200">{u.username}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      <span className="px-2.5 py-1 bg-indigo-900/30 text-indigo-400 border border-indigo-800/50 rounded-full text-xs font-semibold">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-4">
                      <button 
                        onClick={() => setEditingUser(u)}
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-xl font-bold text-slate-100">Bookings Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/50 text-slate-400 text-sm font-medium border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Venue ID</th>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Start Time</th>
                  <th className="px-6 py-4">End Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">#{b.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{b.venue_id}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{b.user_id}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{new Date(b.start_time).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{new Date(b.end_time).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        b.status === 'CONFIRMED' ? 'bg-green-900/30 text-green-400 border-green-800/50' :
                        b.status === 'CANCELLED' ? 'bg-red-900/30 text-red-400 border-red-800/50' :
                        'bg-yellow-900/30 text-yellow-400 border-yellow-800/50'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right space-x-2">
                      {b.status === 'PENDING' && (
                        <>
                          <button onClick={() => handleStatusUpdate(b.id, 'CONFIRMED')} className="px-3 py-1 bg-green-900/40 text-green-400 hover:bg-green-800/60 rounded-md transition-colors border border-green-800/50">Accept</button>
                          <button onClick={() => handleStatusUpdate(b.id, 'CANCELLED')} className="px-3 py-1 bg-red-900/40 text-red-400 hover:bg-red-800/60 rounded-md transition-colors border border-red-800/50">Reject</button>
                        </>
                      )}
                      {b.status === 'CONFIRMED' && (
                        <button onClick={() => handleStatusUpdate(b.id, 'CANCELLED')} className="px-3 py-1 bg-red-900/40 text-red-400 hover:bg-red-800/60 rounded-md transition-colors border border-red-800/50">Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No bookings found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            setEditingUser(null);
            loadData();
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
