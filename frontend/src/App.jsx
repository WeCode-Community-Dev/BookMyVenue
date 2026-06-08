import React, { useState, useEffect, Suspense, lazy, useTransition, useRef, useCallback } from'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from'react-router-dom';
import { fetchVenues } from './services/venueApi';
import { logout, parseJwt } from './services/authApi';
import VenueCard from'./components/VenueCard';
import VenueFilters from'./components/VenueFilters';
import VenueMap from'./components/VenueMap';
import CreateVenuePage from'./components/CreateVenuePage';
import BookingPage from'./components/BookingPage';
import AuthPage from './components/AuthPage';
import EditVenuePage from './components/EditVenuePage';
import Header from './components/Header';
import Footer from './components/Footer';
import { 
  AboutUs, Careers, Press, PartnerWithUs, 
  HelpCenter, ContactUs, PrivacyPolicy, TermsOfService 
} from './components/StaticPages';
import ProfilePage from './components/ProfilePage';

const PartnerDashboard = lazy(() => import('./components/PartnerDashboard'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const VenueDetails = lazy(() => import('./components/VenueDetails'));

function App() {
 const navigate = useNavigate();
 const location = useLocation();

 useEffect(() => {
   window.scrollTo(0, 0);
 }, [location.pathname]);

 const [venues, setVenues] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [toastMessage, setToastMessage] = useState(null);

 const [page, setPage] = useState(0);
 const [hasMore, setHasMore] = useState(true);
 const [isFetchingMore, setIsFetchingMore] = useState(false);
 const [autoScrollCount, setAutoScrollCount] = useState(0);
 const observer = useRef();

 const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('user_role') || !!localStorage.getItem('token'));
 
 const [userRole, setUserRole] = useState(() => {
 const role = localStorage.getItem('user_role');
 if (role) return role;
 
 // Fallback for old token
 const token = localStorage.getItem('token');
 if (token) {
 const payload = parseJwt(token);
 return payload ? payload.role : null;
 }
 return null;
 });
 
 const [listLayout, setListLayout] = useState('grid'); //'grid','list', or'map'
 const [isPending, startTransition] = useTransition();
 const [activeFilters, setActiveFilters] = useState({});
 const [searchQuery, setSearchQuery] = useState('');
 const [sortOption, setSortOption] = useState('newest');
 const [isFiltersOpen, setIsFiltersOpen] = useState(false);

 const loadVenues = async (reset = false) => {
 if (reset) {
   setLoading(true);
 } else {
   setIsFetchingMore(true);
 }
 setError(null);
 try {
   const currentSkip = reset ? 0 : page * 20;
   const data = await fetchVenues({ ...activeFilters, search: searchQuery, sort: sortOption, skip: currentSkip, limit: 20 });
   if (reset) {
     setVenues(data);
   } else {
     setVenues(prev => {
       const newVenues = data.filter(v => !prev.some(p => p.id === v.id));
       return [...prev, ...newVenues];
     });
   }
   setHasMore(data.length === 20);
 } catch (err) {
   setError(err.message ||'Failed to load venues.');
 } finally {
   if (reset) {
     setLoading(false);
   } else {
     setIsFetchingMore(false);
   }
 }
 };

 useEffect(() => {
 setPage(0);
 setHasMore(true);
 setAutoScrollCount(0);
 loadVenues(true);
 }, [activeFilters, searchQuery, sortOption]);

 useEffect(() => {
 if (page > 0) {
   loadVenues(false);
 }
 }, [page]);

 const lastVenueElementRef = useCallback(node => {
 if (loading || isFetchingMore) return;
 if (observer.current) observer.current.disconnect();
 observer.current = new IntersectionObserver(entries => {
   if (entries[0].isIntersecting && hasMore && autoScrollCount < 3) {
     setPage(prevPage => prevPage + 1);
     setAutoScrollCount(prev => prev + 1);
   }
 });
 if (node) observer.current.observe(node);
 }, [loading, isFetchingMore, hasMore, autoScrollCount]);

 const showToast = (msg) => {
 setToastMessage(msg);
 setTimeout(() => setToastMessage(null), 3000);
 };

 const handleLogout = () => {
 logout();
 setIsAuthenticated(false);
 setUserRole(null);
 showToast('Logged out successfully');
 navigate('/');
 };

 const handleCreateVenueClick = () => {
 if (!isAuthenticated) {
 navigate('/auth', { state: { from:'/venues/create'} });
 return;
 }
 navigate('/venues/create');
 };

 return (
 <div className="min-h-screen relative transition-colors duration-500">
  <div className="absolute inset-0 bg-slate-950 transition-opacity duration-500 -z-10"/>
 
 {toastMessage && (
 <div className="fixed top-4 right-4 z-50 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl animate-[slide-up_0.3s_ease-out] flex items-center">
 <svg className="w-5 h-5 text-green-400 mr-3"fill="none"stroke="currentColor"viewBox="0 0 24 24"><path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
 {toastMessage}
 </div>
 )}

      <Header isAuthenticated={isAuthenticated} userRole={userRole} handleLogout={handleLogout} onSearch={setSearchQuery} />

 <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
 <Suspense fallback={
  <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
  <svg className="animate-spin h-10 w-10 text-indigo-500 mb-4"xmlns="http://www.w3.org/2000/svg"fill="none"viewBox="0 0 24 24">
  <circle className="opacity-25"cx="12"cy="12"r="10"stroke="currentColor"strokeWidth="4"></circle>
  <path className="opacity-75"fill="currentColor"d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
  <p className="text-slate-400 font-medium">Loading page...</p>
  </div>
 }>
 <Routes>
 <Route path="/admin"element={userRole ==='SUPER_ADMIN'? <AdminDashboard /> : <Navigate to="/"/>} />
 <Route path="/partner"element={userRole ==='PARTNER'? <PartnerDashboard /> : <Navigate to="/"/>} />
 <Route path="/auth"element={<AuthPage setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} showToast={showToast} />} />
 <Route path="/venues/create"element={userRole !=='CUSTOMER'&& isAuthenticated ? <CreateVenuePage showToast={showToast} loadVenues={loadVenues} /> : <Navigate to="/"/>} />
 <Route path="/venues/:id/edit"element={userRole !=='CUSTOMER'&& isAuthenticated ? <EditVenuePage showToast={showToast} loadVenues={loadVenues} /> : <Navigate to="/"/>} />
 <Route path="/venues/:id/book"element={isAuthenticated ? <BookingPage showToast={showToast} /> : <Navigate to="/auth"/>} />
 <Route path="/venue/:id"element={
 <VenueDetails 
 onBook={(v) => {
 if (!isAuthenticated) navigate('/auth', { state: { from:`/venues/${v.id}/book`} });
 else navigate(`/venues/${v.id}/book`, { state: { venue: v } });
 }} 
 />
 } />
 <Route path="/about"element={<AboutUs />} />
 <Route path="/careers"element={<Careers />} />
 <Route path="/press"element={<Press />} />
 <Route path="/partner-with-us"element={<PartnerWithUs />} />
 <Route path="/help"element={<HelpCenter />} />
 <Route path="/contact"element={<ContactUs />} />
 <Route path="/privacy"element={<PrivacyPolicy />} />
 <Route path="/terms"element={<TermsOfService />} />
 <Route path="/profile"element={isAuthenticated ? <ProfilePage /> : <Navigate to="/auth"/>} />
 <Route path="/"element={
 <>
  <div className="mb-10 text-center animate-fade-in">
  <h2 className="text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight mb-4">
  Find the Perfect Space
  </h2>
  <p className="text-lg text-slate-400 max-w-2xl mx-auto">
  Discover and book unique venues for your next event, meeting, or celebration.
  </p>
  </div>

 <div className="flex flex-col lg:flex-row gap-8 items-start">
  <div className="w-full hidden lg:hidden justify-between items-center mb-2">
  <h3 className="text-lg font-bold text-slate-100">Venues</h3>
 </div>

 <div className={`w-full lg:w-1/4 shrink-0 transition-all duration-300 ${isFiltersOpen ?'block':'hidden'}`}>
 <VenueFilters onApplyFilters={setActiveFilters} />
 </div>

 <div className={`w-full transition-all duration-300 ${isFiltersOpen ? 'lg:w-3/4' : 'lg:w-full'}`}>
  {error ? (
  <div className="bg-red-900/20 border border-red-800/50 text-red-400 p-6 rounded-xl flex items-center justify-center max-w-2xl mx-auto animate-[slide-up_0.3s]">
  <svg className="w-6 h-6 mr-3 shrink-0 text-red-500"fill="none"stroke="currentColor"viewBox="0 0 24 24"><path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
  <div>
  <h3 className="font-semibold text-lg text-red-300">Error Loading Venues</h3>
  <p className="text-red-400/80">{error}</p>
  </div>
  </div>
  ) : loading ? (
  <div className="flex flex-col items-center justify-center py-20">
  <svg className="animate-spin h-10 w-10 text-indigo-500 mb-4"xmlns="http://www.w3.org/2000/svg"fill="none"viewBox="0 0 24 24">
  <circle className="opacity-25"cx="12"cy="12"r="10"stroke="currentColor"strokeWidth="4"></circle>
  <path className="opacity-75"fill="currentColor"d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
  <p className="text-slate-400 font-medium">Loading amazing venues...</p>
  </div>
  ) : venues.length === 0 ? (
  <div className="text-center py-20 bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-800">
  <svg className="w-16 h-16 text-slate-700 mx-auto mb-4"fill="none"stroke="currentColor"viewBox="0 0 24 24"><path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
  <h3 className="text-xl font-semibold text-slate-300 mb-2">No venues found</h3>
  <p className="text-slate-500 mb-6">Try adjusting your filters or create a new venue.</p>
  {userRole !=='CUSTOMER'&& (
  <button onClick={handleCreateVenueClick} className="btn-primary">Add a Venue</button>
  )}
  </div>
 ) : (
 <div>
  <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
  <div className="flex items-center space-x-3 flex-wrap gap-y-3">
    <button 
      onClick={() => setIsFiltersOpen(!isFiltersOpen)}
      className="flex items-center space-x-2 text-indigo-400 bg-indigo-900/30 px-4 py-2 rounded-lg font-medium hover:bg-indigo-900/50 transition-colors"
    >
      <svg className="w-5 h-5"fill="none"stroke="currentColor"viewBox="0 0 24 24"><path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
      <span>{isFiltersOpen ?'Hide Filters':'Show Filters'}</span>
    </button>

    <label htmlFor="sort" className="text-slate-400 text-sm font-medium ml-2">Sort by:</label>
    <select
      id="sort"
      value={sortOption}
      onChange={(e) => setSortOption(e.target.value)}
      className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 transition-colors cursor-pointer outline-none"
    >
      <option value="newest">Newest First</option>
      <option value="price_asc">Lowest Price</option>
      <option value="price_desc">Highest Price</option>
      <option value="capacity_asc">Smallest Capacity</option>
      <option value="capacity_desc">Largest Capacity</option>
    </select>
  </div>
  <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1 relative shadow-inner">
  <button 
  onClick={() => startTransition(() => setListLayout('grid'))}
  className={`p-1.5 sm:p-2 rounded-md transition-all ${listLayout ==='grid'?'bg-slate-800 shadow-sm text-indigo-400':'text-slate-500 hover:text-slate-300'}`}
  title="Grid View"
  >
  <svg className="w-4 h-4 sm:w-5 sm:h-5"fill="none"stroke="currentColor"viewBox="0 0 24 24"><path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
  </button>
  <button 
  onClick={() => startTransition(() => setListLayout('list'))}
  className={`p-1.5 sm:p-2 rounded-md transition-all ${listLayout ==='list'?'bg-slate-800 shadow-sm text-indigo-400':'text-slate-500 hover:text-slate-300'}`}
  title="List View"
  >
  <svg className="w-4 h-4 sm:w-5 sm:h-5"fill="none"stroke="currentColor"viewBox="0 0 24 24"><path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M4 6h16M4 12h16M4 18h16"></path></svg>
  </button>
  <button 
  onClick={() => startTransition(() => setListLayout('map'))}
  className={`p-1.5 sm:p-2 rounded-md transition-all ${listLayout ==='map'?'bg-slate-800 shadow-sm text-indigo-400':'text-slate-500 hover:text-slate-300'}`}
  title="Map View"
  >
  <svg className="w-4 h-4 sm:w-5 sm:h-5"fill="none"stroke="currentColor"viewBox="0 0 24 24"><path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
  </button>
  </div>
  </div>
 {isPending && <div className="text-center text-sm text-slate-500 py-2">Updating layout...</div>}
 {listLayout ==='map'? (
 <div className="w-full h-[600px] mt-4 z-0">
 <VenueMap venues={venues} />
 </div>
 ) : (
 <>
 <div className={`mt-6 ${listLayout ==='grid'? `grid grid-cols-1 sm:grid-cols-2 ${isFiltersOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6` :'flex flex-col space-y-4'}`}>
 {venues.map((venue, index) => {
   if (venues.length === index + 1) {
     return (
       <div ref={lastVenueElementRef} key={venue.id} className="animate-[slide-up_0.4s_ease-out_both]"style={{ animationDelay:`${(index % 20) * 50}ms`}}>
         <VenueCard venue={venue} layout={listLayout} />
       </div>
     );
   } else {
     return (
       <div key={venue.id} className="animate-[slide-up_0.4s_ease-out_both]"style={{ animationDelay:`${(index % 20) * 50}ms`}}>
         <VenueCard venue={venue} layout={listLayout} />
       </div>
     );
   }
 })}
 </div>
 {isFetchingMore && (
   <div className="flex justify-center mt-8 py-4">
     <svg className="animate-spin h-8 w-8 text-indigo-500"xmlns="http://www.w3.org/2000/svg"fill="none"viewBox="0 0 24 24">
       <circle className="opacity-25"cx="12"cy="12"r="10"stroke="currentColor"strokeWidth="4"></circle>
       <path className="opacity-75"fill="currentColor"d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
     </svg>
   </div>
 )}
 {hasMore && !isFetchingMore && autoScrollCount >= 3 && (
   <div className="flex justify-center mt-8 py-4">
     <button 
       onClick={() => {
         setPage(prev => prev + 1);
         setAutoScrollCount(0);
       }}
       className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors"
     >
       Load More
     </button>
   </div>
 )}
 </>
 )}
 </div>
 )}
 </div>
 </div>
 </>
 } />
 </Routes>
 </Suspense>
 </main>

      <Footer />
    </div>
  );
}

export default App;
