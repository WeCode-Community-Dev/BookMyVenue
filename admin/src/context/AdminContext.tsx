import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  Customer,
  VenueOwner,
  Venue,
  Booking,
  ComplaintReport,
  PlatformSettings,
  SystemNotification,
  Banner,
  Promotion,
  Amenity
} from '../data/mockStore';

import {
  initialCustomers,
  initialOwners,
  initialVenues,
  initialBookings,
  initialReports,
  initialBanners,
  initialPromotions,
  initialNotifications,
  defaultSettings,
  initialAmenities
} from '../data/mockStore';
import {
  fetchAdminDirectoryData,
  fetchAdminVenuesData,
  hasDirectoryApiConfig,
  hasVenuesApiConfig,
  updateVenueOwnerApprovalStatus,
  fetchAmenitiesApi,
  createAmenityApi,
  deleteAmenityApi,
  hasAmenitiesApiConfig,
  updateVenueStatusApi,
  fetchBookingsApi,
  hasBookingsApiConfig
} from '../api/adminApi';

interface ApiResourceState {
  loading: boolean;
  error: string | null;
  usingMockData: boolean;
}

interface AdminContextProps {
  customers: Customer[];
  owners: VenueOwner[];
  venues: Venue[];
  bookings: Booking[];
  reports: ComplaintReport[];
  settings: PlatformSettings;
  notifications: SystemNotification[];
  banners: Banner[];
  promotions: Promotion[];
  amenities: Amenity[];
  apiState: {
    users: ApiResourceState;
    venues: ApiResourceState;
    amenities: ApiResourceState;
    bookings: ApiResourceState;
  };
  refreshUsers: () => Promise<void>;
  refreshVenues: () => Promise<void>;
  refreshAmenities: () => Promise<void>;
  refreshBookings: () => Promise<void>;
  createAmenity: (name: string) => Promise<void>;
  deleteAmenity: (id: string) => Promise<void>;
  
  // Handlers for Customers
  blockCustomer: (id: string) => void;
  unblockCustomer: (id: string) => void;
  deleteCustomer: (id: string) => void;
  
  // Handlers for Owners
  approveOwnerKYC: (id: string) => Promise<VenueOwner['kycStatus']>;
  rejectOwnerKYC: (id: string) => Promise<VenueOwner['kycStatus']>;
  blockOwner: (id: string) => void;
  unblockOwner: (id: string) => void;
  
  // Handlers for Venues
  approveVenue: (id: string) => Promise<void>;
  rejectVenue: (id: string, reason?: string) => Promise<void>;
  blockVenue: (id: string, reason?: string) => Promise<void>;
  unblockVenue: (id: string) => Promise<void>;
  toggleFeaturedVenue: (id: string) => void;
  editVenueDetails: (id: string, updated: Partial<Venue>) => void;
  deleteVenue: (id: string) => void;
  loadMoreVenues: (limit?: number) => Promise<boolean>;
  hasMoreVenues: boolean;
  venuesLimit: number;
  setVenuesLimit: (limit: number) => void;
  
  // Handlers for Bookings
  cancelBooking: (id: string) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  
  // Handlers for Reports
  resolveReport: (id: string) => void;
  rejectReport: (id: string) => void;
  
  // Handlers for Settings
  updateSettings: (newSettings: PlatformSettings) => void;
  
  // Handlers for Notifications
  sendNotification: (title: string, message: string, sentTo: SystemNotification['sentTo'], type?: SystemNotification['type']) => void;
  
  // Handlers for CMS
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  toggleBannerActive: (id: string) => void;
  deleteBanner: (id: string) => void;
  addPromotion: (promo: Omit<Promotion, 'id'>) => void;
  togglePromotionActive: (id: string) => void;
  deletePromotion: (id: string) => void;

  // Dynamic Dashboard Stats
  stats: {
    totalUsers: number;
    totalVenueOwners: number;
    totalVenues: number;
    totalBookings: number;
    todayBookingsCount: number;
    upcomingBookingsCount: number;
    revenueOverview: {
      totalBookingRevenue: number;
      totalCommissionRevenue: number;
      pendingPayouts: number;
      completedPayouts: number;
    };
    pendingVenueApprovals: number;
    activeVenuesCount: number;
    blockedVenuesCount: number;
  };
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

const applyCommissionRate = (bookings: Booking[], commissionPercentage: number) =>
  bookings.map((booking) => ({
    ...booking,
    commissionAmount: Number((booking.amount * (commissionPercentage / 100)).toFixed(2))
  }));

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [owners, setOwners] = useState<VenueOwner[]>(initialOwners);
  const [venues, setVenues] = useState<Venue[]>(hasVenuesApiConfig ? [] : initialVenues);
  const [bookings, setBookings] = useState<Booking[]>(hasBookingsApiConfig ? [] : initialBookings);
  const [reports, setReports] = useState<ComplaintReport[]>(initialReports);
  const [settings, setSettings] = useState<PlatformSettings>(defaultSettings);
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [amenities, setAmenities] = useState<Amenity[]>(initialAmenities);
  const [usersApiState, setUsersApiState] = useState<ApiResourceState>({
    loading: hasDirectoryApiConfig,
    error: null,
    usingMockData: !hasDirectoryApiConfig
  });
  const [venuesApiState, setVenuesApiState] = useState<ApiResourceState>({
    loading: hasVenuesApiConfig,
    error: null,
    usingMockData: !hasVenuesApiConfig
  });
  const [amenitiesApiState, setAmenitiesApiState] = useState<ApiResourceState>({
    loading: hasAmenitiesApiConfig,
    error: null,
    usingMockData: !hasAmenitiesApiConfig
  });
  const [bookingsApiState, setBookingsApiState] = useState<ApiResourceState>({
    loading: hasBookingsApiConfig,
    error: null,
    usingMockData: !hasBookingsApiConfig
  });

  const refreshUsers = useCallback(async () => {
    if (!hasDirectoryApiConfig) {
      setUsersApiState({
        loading: false,
        error: null,
        usingMockData: true
      });
      return;
    }

    setUsersApiState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    try {
      const directoryData = await fetchAdminDirectoryData();

      if (directoryData.customers) {
        setCustomers(directoryData.customers);
      }
      if (directoryData.owners) {
        setOwners(directoryData.owners);
      }

      setUsersApiState({
        loading: false,
        error: null,
        usingMockData: false
      });
    } catch (error) {
      setUsersApiState({
        loading: false,
        error: error instanceof Error ? error.message : 'Unable to load users from API.',
        usingMockData: true
      });
    }
  }, []);

  const [venuesLimit, setVenuesLimit] = useState(20);
  const [hasMoreVenues, setHasMoreVenues] = useState(true);

  const refreshVenues = useCallback(async () => {
    if (!hasVenuesApiConfig) {
      setVenuesApiState({
        loading: false,
        error: null,
        usingMockData: true
      });
      setHasMoreVenues(false);
      return;
    }

    setVenuesApiState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    try {
      const venuesData = await fetchAdminVenuesData(0, venuesLimit);
      setVenues(venuesData.venues);
      setHasMoreVenues(venuesData.venues.length === venuesLimit);
      setVenuesApiState({
        loading: false,
        error: null,
        usingMockData: false
      });
    } catch (error) {
      setVenuesApiState({
        loading: false,
        error: error instanceof Error ? error.message : 'Unable to load venues from API.',
        usingMockData: true
      });
      setHasMoreVenues(false);
    }
  }, [venuesLimit]);

  const loadMoreVenues = async (customLimit?: number) => {
    if (!hasVenuesApiConfig || venuesApiState.loading || !hasMoreVenues) {
      return false;
    }

    setVenuesApiState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    const currentLimit = customLimit ?? venuesLimit;
    const currentSkip = venues.length;

    try {
      const venuesData = await fetchAdminVenuesData(currentSkip, currentLimit);
      const fetchedCount = venuesData.venues.length;
      
      if (fetchedCount > 0) {
        setVenues(prev => {
          const existingIds = new Set(prev.map(v => v.id));
          const uniqueNew = venuesData.venues.filter(v => !existingIds.has(v.id));
          return [...prev, ...uniqueNew];
        });
      }

      const moreAvailable = fetchedCount === currentLimit;
      setHasMoreVenues(moreAvailable);
      
      setVenuesApiState({
        loading: false,
        error: null,
        usingMockData: false
      });

      return moreAvailable;
    } catch (error) {
      setVenuesApiState({
        loading: false,
        error: error instanceof Error ? error.message : 'Unable to load more venues from API.',
        usingMockData: false
      });
      return false;
    }
  };

  const refreshAmenities = useCallback(async () => {
    if (!hasAmenitiesApiConfig) {
      setAmenitiesApiState({
        loading: false,
        error: null,
        usingMockData: true
      });
      return;
    }

    setAmenitiesApiState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    try {
      const data = await fetchAmenitiesApi();
      setAmenities(data);
      setAmenitiesApiState({
        loading: false,
        error: null,
        usingMockData: false
      });
    } catch (error) {
      setAmenitiesApiState({
        loading: false,
        error: error instanceof Error ? error.message : 'Unable to load amenities from API.',
        usingMockData: true
      });
    }
  }, []);

  const refreshBookings = useCallback(async () => {
    if (!hasBookingsApiConfig) {
      setBookingsApiState({
        loading: false,
        error: null,
        usingMockData: true
      });
      return;
    }

    setBookingsApiState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    try {
      const data = await fetchBookingsApi(settings.commissionPercentage);
      setBookings(data);
      setBookingsApiState({
        loading: false,
        error: null,
        usingMockData: false
      });
    } catch (error) {
      setBookingsApiState({
        loading: false,
        error: error instanceof Error ? error.message : 'Unable to load bookings from API.',
        usingMockData: true
      });
    }
  }, [settings.commissionPercentage]);

  useEffect(() => {
    if (!hasDirectoryApiConfig) {
      return;
    }

    fetchAdminDirectoryData()
      .then((directoryData) => {
        if (directoryData.customers) {
          setCustomers(directoryData.customers);
        }
        if (directoryData.owners) {
          setOwners(directoryData.owners);
        }

        setUsersApiState({
          loading: false,
          error: null,
          usingMockData: false
        });
      })
      .catch((error: unknown) => {
        setUsersApiState({
          loading: false,
          error: error instanceof Error ? error.message : 'Unable to load users from API.',
          usingMockData: true
        });
      });
  }, []);

  useEffect(() => {
    if (!hasVenuesApiConfig) {
      return;
    }

    fetchAdminVenuesData()
      .then((venuesData) => {
        setVenues(venuesData.venues);
        setVenuesApiState({
          loading: false,
          error: null,
          usingMockData: false
        });
      })
      .catch((error: unknown) => {
        setVenuesApiState({
          loading: false,
          error: error instanceof Error ? error.message : 'Unable to load venues from API.',
          usingMockData: true
        });
      });
  }, []);

  useEffect(() => {
    if (!hasAmenitiesApiConfig) {
      return;
    }

    fetchAmenitiesApi()
      .then((data) => {
        setAmenities(data);
        setAmenitiesApiState({
          loading: false,
          error: null,
          usingMockData: false
        });
      })
      .catch((error: unknown) => {
        setAmenitiesApiState({
          loading: false,
          error: error instanceof Error ? error.message : 'Unable to load amenities from API.',
          usingMockData: true
        });
      });
  }, []);

  useEffect(() => {
    if (!hasBookingsApiConfig) {
      return;
    }

    refreshBookings();
  }, [refreshBookings]);


  // CUSTOMERS HANDLERS
  const blockCustomer = (id: string) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: 'blocked' } : c));
    sendNotification('Security Action: Customer Blocked', `Customer ${id} has been blocked by administrator.`, 'all', 'report');
  };

  const unblockCustomer = (id: string) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: 'active' } : c));
    sendNotification('Security Action: Customer Unblocked', `Customer ${id} has been unblocked by administrator.`, 'all', 'report');
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  // OWNERS HANDLERS
  const applyOwnerKycStatus = (id: string, kycStatus: VenueOwner['kycStatus']) => {
    setOwners(prev => prev.map(o => o.id === id ? { ...o, kycStatus, status: kycStatus === 'verified' ? 'active' : o.status } : o));
  };

  const approveOwnerKYC = async (id: string) => {
    const update = await updateVenueOwnerApprovalStatus(id, 0);
    applyOwnerKycStatus(update.ownerId, update.approvalStatus);
    sendNotification('KYC Verification Successful', `KYC and business proof for owner ${update.ownerId} have been verified.`, 'owners', 'approval');
    return update.approvalStatus;
  };

  const rejectOwnerKYC = async (id: string) => {
    const update = await updateVenueOwnerApprovalStatus(id, 1);
    applyOwnerKycStatus(update.ownerId, update.approvalStatus);
    sendNotification('KYC Verification Rejected', `KYC documents for owner ${update.ownerId} did not satisfy requirements.`, 'owners', 'approval');
    return update.approvalStatus;
  };

  const blockOwner = (id: string) => {
    setOwners(prev => prev.map(o => o.id === id ? { ...o, status: 'blocked' } : o));
    // When owner is blocked, block all their venues too
    setVenues(prev => prev.map(v => v.ownerId === id ? { ...v, status: 'blocked' } : v));
    sendNotification('Owner Blocked', `Venue owner ${id} and all their associated venues have been suspended.`, 'all', 'report');
  };

  const unblockOwner = (id: string) => {
    setOwners(prev => prev.map(o => o.id === id ? { ...o, status: 'active' } : o));
    // Restore their approved venues
    setVenues(prev => prev.map(v => v.ownerId === id && v.status === 'blocked' ? { ...v, status: 'approved' } : v));
    sendNotification('Owner Restored', `Venue owner ${id} has been active again.`, 'all', 'report');
  };

  // VENUES HANDLERS
  const approveVenue = async (id: string) => {
    if (!hasVenuesApiConfig) {
      setVenues(prev => prev.map(v => {
        if (v.id === id) {
          setOwners(prevOwners => prevOwners.map(o => o.id === v.ownerId ? { ...o, venuesCount: o.venuesCount + 1 } : o));
          return { ...v, status: 'approved', verification_status: 'approved' };
        }
        return v;
      }));
      sendNotification('Venue Listing Approved (Mock)', `Venue listing ${id} has been approved in mock mode.`, 'all', 'approval');
      return;
    }

    try {
      await updateVenueStatusApi(id, 'approved');
      setVenues(prev => prev.map(v => {
        if (v.id === id) {
          setOwners(prevOwners => prevOwners.map(o => o.id === v.ownerId ? { ...o, venuesCount: o.venuesCount + 1 } : o));
          return { ...v, status: 'approved', verification_status: 'approved' };
        }
        return v;
      }));
      sendNotification('Venue Listing Approved', `Venue listing ${id} has been successfully verified and published.`, 'all', 'approval');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to approve venue.');
    }
  };

  const rejectVenue = async (id: string, reason?: string) => {
    const finalReason = reason || 'Venue details or documentation do not meet requirements.';
    if (!hasVenuesApiConfig) {
      setVenues(prev => prev.map(v => v.id === id ? { ...v, status: 'blocked', verification_status: 'rejected', rejection_reason: finalReason } : v));
      sendNotification('Venue Listing Rejected (Mock)', `Venue application ${id} was rejected in mock mode.`, 'owners', 'approval');
      return;
    }

    try {
      await updateVenueStatusApi(id, 'rejected', finalReason);
      setVenues(prev => prev.map(v => v.id === id ? { ...v, status: 'blocked', verification_status: 'rejected', rejection_reason: finalReason } : v));
      sendNotification('Venue Listing Rejected', `Venue application ${id} was rejected during compliance audit.`, 'owners', 'approval');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to reject venue.');
    }
  };

  const blockVenue = async (id: string, reason?: string) => {
    const finalReason = reason || 'Suspended by administrative decision.';
    if (!hasVenuesApiConfig) {
      setVenues(prev => prev.map(v => v.id === id ? { ...v, status: 'blocked', verification_status: 'suspended', rejection_reason: finalReason } : v));
      sendNotification('Venue Listing Suspended (Mock)', `Venue listing ${id} was suspended in mock mode.`, 'all', 'report');
      return;
    }

    try {
      await updateVenueStatusApi(id, 'suspended', finalReason);
      setVenues(prev => prev.map(v => v.id === id ? { ...v, status: 'blocked', verification_status: 'suspended', rejection_reason: finalReason } : v));
      sendNotification('Venue Listing Suspended', `Venue listing ${id} has been suspended/blocked.`, 'all', 'report');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to suspend venue.');
    }
  };

  const unblockVenue = async (id: string) => {
    if (!hasVenuesApiConfig) {
      setVenues(prev => prev.map(v => v.id === id ? { ...v, status: 'approved', verification_status: 'approved', rejection_reason: undefined } : v));
      sendNotification('Venue Listing Restored (Mock)', `Venue listing ${id} restored in mock mode.`, 'all', 'approval');
      return;
    }

    try {
      await updateVenueStatusApi(id, 'approved');
      setVenues(prev => prev.map(v => v.id === id ? { ...v, status: 'approved', verification_status: 'approved', rejection_reason: undefined } : v));
      sendNotification('Venue Listing Restored', `Venue listing ${id} has been restored/approved.`, 'all', 'approval');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to restore venue.');
    }
  };

  const toggleFeaturedVenue = (id: string) => {
    setVenues(prev => prev.map(v => v.id === id ? { ...v, featured: !v.featured } : v));
  };

  const editVenueDetails = (id: string, updated: Partial<Venue>) => {
    setVenues(prev => prev.map(v => v.id === id ? { ...v, ...updated } as Venue : v));
  };

  const deleteVenue = (id: string) => {
    setVenues(prev => {
      const v = prev.find(item => item.id === id);
      if (v && v.status === 'approved') {
        setOwners(prevOwners => prevOwners.map(o => o.id === v.ownerId ? { ...o, venuesCount: Math.max(0, o.venuesCount - 1) } : o));
      }
      return prev.filter(item => item.id !== id);
    });
  };

  // BOOKINGS HANDLERS
  const cancelBooking = (id: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        // Change owners revenue and customers spent if completed
        if (b.status === 'completed') {
          setOwners(prevOwners => prevOwners.map(o => o.id === b.ownerId ? { ...o, revenueGenerated: Math.max(0, o.revenueGenerated - b.amount) } : o));
          setCustomers(prevCust => prevCust.map(c => c.id === b.customerId ? { ...c, totalSpent: Math.max(0, c.totalSpent - b.amount) } : c));
        }
        return { ...b, status: 'cancelled', paymentStatus: 'refunded' };
      }
      return b;
    }));
    sendNotification('Booking Cancelled & Refunded', `Booking ${id} was cancelled. Refund of 100% processed according to policy.`, 'all', 'booking');
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        let paymentStatus = b.paymentStatus;
        if (status === 'completed') {
          paymentStatus = 'paid';
          // Update owner revenue & customer spent if not already updated
          if (b.status !== 'completed') {
            setOwners(prevOwners => prevOwners.map(o => o.id === b.ownerId ? { ...o, revenueGenerated: o.revenueGenerated + b.amount, totalBookings: o.totalBookings + 1 } : o));
            setCustomers(prevCust => prevCust.map(c => c.id === b.customerId ? { ...c, totalSpent: c.totalSpent + b.amount, bookingsCount: c.bookingsCount + 1 } : c));
            setVenues(prevVenues => prevVenues.map(v => v.id === b.venueId ? { ...v, revenue: v.revenue + b.amount, bookingCount: v.bookingCount + 1 } : v));
          }
        } else if (status === 'failed') {
          paymentStatus = 'failed';
        }
        return { ...b, status, paymentStatus };
      }
      return b;
    }));
  };

  // REPORTS HANDLERS
  const resolveReport = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
  };

  const rejectReport = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };

  // SETTINGS HANDLERS
  const updateSettings = (newSettings: PlatformSettings) => {
    setSettings(newSettings);
    setBookings(prevBookings => applyCommissionRate(prevBookings, newSettings.commissionPercentage));
    sendNotification('Platform Settings Updated', `Commission rates and tax rules have been modified by the admin.`, 'all', 'broadcast');
  };

  // SYSTEM NOTIFICATIONS
  const sendNotification = (title: string, message: string, sentTo: SystemNotification['sentTo'], type: SystemNotification['type'] = 'broadcast') => {
    const newNotif: SystemNotification = {
      id: `NT-${Date.now().toString().slice(-4)}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      sentTo
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // CMS HANDLERS
  const addBanner = (banner: Omit<Banner, 'id'>) => {
    const newBanner: Banner = {
      id: `BAN-${Date.now().toString().slice(-4)}`,
      ...banner
    };
    setBanners(prev => [...prev, newBanner]);
  };

  const toggleBannerActive = (id: string) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  const addPromotion = (promo: Omit<Promotion, 'id'>) => {
    const newPromo: Promotion = {
      id: `PROM-${Date.now().toString().slice(-4)}`,
      ...promo
    };
    setPromotions(prev => [...prev, newPromo]);
  };

  const togglePromotionActive = (id: string) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const deletePromotion = (id: string) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
  };

  // AMENITIES HANDLERS
  const createAmenity = async (name: string) => {
    if (!name.trim()) return;

    if (!hasAmenitiesApiConfig) {
      const newAmenity: Amenity = {
        id: `MOCK-${Date.now().toString().slice(-4)}`,
        name: name.trim()
      };
      setAmenities(prev => [...prev, newAmenity]);
      sendNotification('Amenity Created (Mock)', `Amenity "${name}" created in mock storage.`, 'all', 'broadcast');
      return;
    }

    try {
      const created = await createAmenityApi(name.trim());
      setAmenities(prev => [...prev, created]);
      sendNotification('Amenity Created', `Amenity "${name}" created successfully.`, 'all', 'broadcast');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create amenity via API.');
    }
  };

  const deleteAmenity = async (id: string) => {
    if (!hasAmenitiesApiConfig) {
      setAmenities(prev => prev.filter(a => a.id !== id));
      sendNotification('Amenity Deleted (Mock)', `Amenity with ID ${id} deleted from mock storage.`, 'all', 'broadcast');
      return;
    }

    try {
      await deleteAmenityApi(id);
      setAmenities(prev => prev.filter(a => a.id !== id));
      sendNotification('Amenity Deleted', `Amenity was deleted successfully.`, 'all', 'broadcast');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete amenity via API.');
    }
  };


  // DYNAMIC STATS CALCULATOR
  const activeBookings = bookings.filter(b => b.status !== 'failed' && b.status !== 'cancelled');
  const totalBookingRevenue = activeBookings.reduce((sum, b) => sum + b.amount, 0);
  const totalCommissionRevenue = activeBookings.reduce((sum, b) => sum + b.commissionAmount, 0);
  
  // Payout stats (simplified simulation): 
  // Payout is completed if the booking status is completed, and pending if booking status is upcoming (and paid)
  const pendingPayouts = bookings
    .filter(b => b.status === 'upcoming' && b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + (b.amount - b.commissionAmount), 0);

  const completedPayouts = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + (b.amount - b.commissionAmount), 0);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayBookingsCount = bookings.filter(b => b.bookingDate === todayStr || b.eventDate === todayStr).length;
  const upcomingBookingsCount = bookings.filter(b => b.status === 'upcoming').length;

  const stats = {
    totalUsers: customers.length,
    totalVenueOwners: owners.length,
    totalVenues: venues.length,
    totalBookings: bookings.length,
    todayBookingsCount,
    upcomingBookingsCount,
    revenueOverview: {
      totalBookingRevenue,
      totalCommissionRevenue,
      pendingPayouts,
      completedPayouts
    },
    pendingVenueApprovals: venues.filter(v => v.status === 'pending').length,
    activeVenuesCount: venues.filter(v => v.status === 'approved').length,
    blockedVenuesCount: venues.filter(v => v.status === 'blocked').length
  };

  return (
    <AdminContext.Provider
      value={{
        customers,
        owners,
        venues,
        bookings,
        reports,
        settings,
        notifications,
        banners,
        promotions,
        amenities,
        apiState: {
          users: usersApiState,
          venues: venuesApiState,
          amenities: amenitiesApiState,
          bookings: bookingsApiState
        },
        refreshUsers,
        refreshVenues,
        refreshAmenities,
        refreshBookings,
        blockCustomer,
        unblockCustomer,
        deleteCustomer,
        approveOwnerKYC,
        rejectOwnerKYC,
        blockOwner,
        unblockOwner,
        approveVenue,
        rejectVenue,
        blockVenue,
        unblockVenue,
        toggleFeaturedVenue,
        editVenueDetails,
        deleteVenue,
        loadMoreVenues,
        hasMoreVenues,
        venuesLimit,
        setVenuesLimit,
        cancelBooking,
        updateBookingStatus,
        resolveReport,
        rejectReport,
        updateSettings,
        sendNotification,
        addBanner,
        toggleBannerActive,
        deleteBanner,
        addPromotion,
        togglePromotionActive,
        deletePromotion,
        createAmenity,
        deleteAmenity,
        stats

      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
