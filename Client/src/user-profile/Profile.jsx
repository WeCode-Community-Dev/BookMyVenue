import React, { useState, useEffect } from 'react';
import VenueNavbar from '../venue-list/VenueNavbar';
import UserProfileCard from './UserProfileCard';
import BookedVenues from './BookedVenues';
import AdminMessages from './AdminMessages';
import { Calendar, Mail } from 'lucide-react';

const DEFAULT_USER = {
  name: "Alex Mercer",
  email: "alex.mercer@ticketseats.com",
  phone: "+1 (555) 382-9901",
  bio: "Avid traveler, event coordinator, and workspace enthusiast. Love finding hidden gems and unique cabins for remote work and team syncs.",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  memberSince: "Jan 2024",
  role: "Premium Member"
};

const DEFAULT_BOOKINGS = [
  {
    id: "bk-101",
    venueId: 1,
    venueName: "Aura Oceanfront Estate",
    venueLocation: "Malibu, California",
    venueImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop",
    checkIn: "2026-07-20",
    checkOut: "2026-07-22",
    guests: 4,
    totalPaid: 1750,
    status: "Confirmed",
    hostName: "Elena Rostova",
    hostMessage: "Hi Alex, we are looking forward to hosting you next week! Valet instructions will be sent 24 hours prior."
  },
  {
    id: "bk-102",
    venueId: 2,
    venueName: "The Skylight Greenhouse",
    venueLocation: "Brooklyn, New York",
    venueImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600&auto=format&fit=crop",
    checkIn: "2026-08-05",
    checkOut: "2026-08-06",
    guests: 2,
    totalPaid: 560,
    status: "Pending Admin Approval",
    hostName: "Marcus Sterling",
    hostMessage: "Welcome! We are reviewing the calendar for your requested slot and will approve shortly."
  }
];

const DEFAULT_MESSAGES = [
  {
    id: "msg-001",
    sender: "TicketSeats Admin",
    senderRole: "Platform Administrator",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=150&auto=format&fit=crop",
    content: "Hi Alex, welcome to TicketSeats! Your account has been upgraded to 'Premium Member' status. You can now enjoy 10% off on your bookings.",
    timestamp: "2026-07-10T10:00:00Z",
    read: false,
    replies: [
      {
        sender: "TicketSeats Admin",
        text: "Hi Alex, welcome to TicketSeats! Your account has been upgraded to 'Premium Member' status. You can now enjoy 10% off on your bookings.",
        timestamp: "2026-07-10T10:00:00Z",
        isAdmin: true
      }
    ]
  },
  {
    id: "msg-002",
    sender: "Elena Rostova",
    senderRole: "Aura Oceanfront Estate Host",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
    content: "Hi Alex! I noticed you requested an early check-in for Aura Oceanfront Estate. We can accommodate you from 12:00 PM instead of 3:00 PM. Let me know if that works!",
    timestamp: "2026-07-09T14:30:00Z",
    read: true,
    replies: [
      {
        sender: "Elena Rostova",
        text: "Hi Alex! I noticed you requested an early check-in for Aura Oceanfront Estate. We can accommodate you from 12:00 PM instead of 3:00 PM. Let me know if that works!",
        timestamp: "2026-07-09T14:30:00Z",
        isAdmin: true
      }
    ]
  }
];

export function Profile() {
  const [user, setUser] = useState(DEFAULT_USER);
  const [bookings, setBookings] = useState(DEFAULT_BOOKINGS);
  const [messages, setMessages] = useState(DEFAULT_MESSAGES);
  const [activeTab, setActiveTab] = useState("bookings"); // "bookings" | "messages"

  // Load from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("ts_user");
    const storedBookings = localStorage.getItem("ts_bookings");
    const storedMessages = localStorage.getItem("ts_messages");

    if (storedUser) setUser(JSON.parse(storedUser));
    else localStorage.setItem("ts_user", JSON.stringify(DEFAULT_USER));

    if (storedBookings) setBookings(JSON.parse(storedBookings));
    else localStorage.setItem("ts_bookings", JSON.stringify(DEFAULT_BOOKINGS));

    if (storedMessages) setMessages(JSON.parse(storedMessages));
    else localStorage.setItem("ts_messages", JSON.stringify(DEFAULT_MESSAGES));
  }, []);

  // Handlers that update state and localStorage
  const handleSaveUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("ts_user", JSON.stringify(updatedUser));
  };

  const handleCancelBooking = (bookingId) => {
    const updatedBookings = bookings.map(b => 
      b.id === bookingId ? { ...b, status: 'Cancelled' } : b
    );
    setBookings(updatedBookings);
    localStorage.setItem("ts_bookings", JSON.stringify(updatedBookings));
  };

  const handleToggleRead = (messageId) => {
    const updatedMessages = messages.map(m => 
      m.id === messageId ? { ...m, read: !m.read } : m
    );
    setMessages(updatedMessages);
    localStorage.setItem("ts_messages", JSON.stringify(updatedMessages));
  };

  const handleAddReply = (messageId, replyText) => {
    const updatedMessages = messages.map(m => {
      if (m.id === messageId) {
        const newReply = {
          sender: user.name,
          text: replyText,
          timestamp: new Date().toISOString(),
          isAdmin: false
        };
        return {
          ...m,
          read: true, // Auto-mark read on reply
          replies: [...(m.replies || []), newReply]
        };
      }
      return m;
    });
    setMessages(updatedMessages);
    localStorage.setItem("ts_messages", JSON.stringify(updatedMessages));
  };

  // Computations for notification counters
  const pendingBookingsCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending Admin Approval').length;
  const unreadMessagesCount = messages.filter(m => !m.read).length;

  return (
    <div className="min-h-screen w-full font-sans bg-gradient-to-b from-[#D4CEB8] via-[#F4F1E6] to-[#FAF9F6] text-slate-800 selection:bg-ticket-yellow selection:text-slate-900 pb-20 relative overflow-x-hidden">
      
      {/* Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-ticket-orange/5 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-ticket-yellow/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Navbar */}
      <VenueNavbar />

      <main className="max-w-5xl mx-auto px-6 md:px-12 mt-10 relative z-10">
        
        {/* Dynamic header greeting */}
        <div className="mb-8 animate-fade-in-up" style={{ opacity: 0 }}>
          <span className="text-xs font-bold text-ticket-orange uppercase tracking-widest pl-0.5">Guest Dashboard</span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-850 to-ticket-orange">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage your details, bookings, and host inquiries in one place.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: User Profile Details (Span 4) */}
          <div className="lg:col-span-4 animate-fade-in-up" style={{ animationDelay: '0.15s', opacity: 0 }}>
            <UserProfileCard user={user} onSave={handleSaveUser} />
          </div>

          {/* Right Column: Bookings & Messages Center Tabs (Span 8) */}
          <div className="lg:col-span-8 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            
            {/* Tabs Selector Navigation */}
            <div className="bg-white border border-slate-200/80 p-2 rounded-2xl flex gap-2.5 shadow-sm">
              <button 
                onClick={() => setActiveTab("bookings")}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTab === "bookings" 
                    ? "bg-slate-900 text-white shadow-md" 
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Calendar className="w-4 h-4" /> 
                My Bookings
                {pendingBookingsCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition-colors ${
                    activeTab === "bookings" ? "bg-ticket-yellow text-slate-900" : "bg-slate-100 text-slate-600"
                  }`}>
                    {pendingBookingsCount}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab("messages")}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTab === "messages" 
                    ? "bg-slate-900 text-white shadow-md" 
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Mail className="w-4 h-4" /> 
                Messages Center
                {unreadMessagesCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition-colors ${
                    activeTab === "messages" ? "bg-ticket-orange text-white" : "bg-ticket-orange/15 text-ticket-orange"
                  }`}>
                    {unreadMessagesCount}
                  </span>
                )}
              </button>
            </div>

            {/* Render Active Component with Transition key & fadeInUp animation */}
            <div key={activeTab} className="bg-transparent rounded-2xl animate-fade-in-up" style={{ opacity: 0, animationDuration: '350ms' }}>
              {activeTab === "bookings" ? (
                <BookedVenues bookings={bookings} onCancelBooking={handleCancelBooking} />
              ) : (
                <AdminMessages 
                  messages={messages} 
                  onToggleRead={handleToggleRead} 
                  onAddReply={handleAddReply} 
                />
              )}
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

export default Profile;
