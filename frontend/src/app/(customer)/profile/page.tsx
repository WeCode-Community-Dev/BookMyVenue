'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/axios';
import { User, Phone, CheckCircle, AlertCircle, Save, Loader2 } from 'lucide-react';

export default function CustomerProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState(''); // readonly display

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      router.push('/login');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      fetchUserProfile(user.id || user._id);
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  const fetchUserProfile = async (userId: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await api.get(`/users/${userId}`);
      const userData = response.data;
      setName(userData.name || '');
      setPhoneNumber(userData.phoneNumber || '');
      setEmail(userData.email || '');
    } catch (err: any) {
      console.error('Failed to fetch user profile:', err);
      setErrorMsg('Failed to load profile details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Name is required.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMsg('Phone number is required.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await api.patch('/users/profile', {
        name,
        phoneNumber,
      });

      const updatedUser = response.data;
      
      // Update local storage so other pages/header display the new name immediately
      const localUserStr = localStorage.getItem('user');
      if (localUserStr) {
        const localUserObj = JSON.parse(localUserStr);
        const mergedUser = { ...localUserObj, name: updatedUser.name, phoneNumber: updatedUser.phoneNumber };
        localStorage.setItem('user', JSON.stringify(mergedUser));
        setCurrentUser(mergedUser);
      }

      setSuccessMsg('Profile details updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to update profile details.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!isClient || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-650 border-t-transparent animate-spin"></div>
          <p className="text-slate-650 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Premium Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">BookMyVenue</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200 px-3 py-2 rounded-xl"
            >
              Dashboard
            </Link>
            <Link 
              href="/bookings" 
              className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200 px-3 py-2 rounded-xl"
            >
              Bookings
            </Link>
            <Link 
              href="/profile" 
              className="text-indigo-600 font-semibold text-sm transition-colors duration-200 px-3 py-2 rounded-xl"
            >
              Profile
            </Link>
            
            {/* User welcome message */}
            <span className="hidden md:inline-block text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              👋 Hi, <span className="text-slate-800 font-bold">{currentUser.name}</span>
            </span>

            <button 
              onClick={handleLogout}
              className="bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-semibold text-sm transition-all duration-200 px-4 py-2 rounded-xl border border-rose-200 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-850 tracking-tight">Account Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Update your personal account details below.</p>
        </div>

        {/* Feedback Banners */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-250 text-emerald-700 text-sm font-semibold flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-250 text-rose-700 text-sm font-semibold flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[280px]">
            <Loader2 className="w-8 h-8 text-indigo-650 animate-spin" />
            <p className="mt-4 text-slate-500 text-sm font-medium">Fetching profile details...</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Branding Header Strip */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-650 px-8 py-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-extrabold text-2xl uppercase border border-white/10 shadow-inner">
                  {name.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg leading-tight">{name}</h3>
                  <span className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">Customer</span>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                
                {/* Email (Readonly) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-3 rounded-2xl border border-slate-205 bg-slate-50 text-slate-500 text-xs font-semibold cursor-not-allowed outline-none"
                  />
                  <p className="text-[10px] text-slate-400 font-semibold mt-1.5">Registered account email cannot be changed.</p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-450 mb-2">Full Name</label>
                  <div className="relative flex items-center">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-450">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="pl-11 pr-4 py-3 w-full border border-slate-200 rounded-2xl text-xs bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-650 focus:bg-white transition-all h-[44px] font-semibold"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-450 mb-2">Phone Number</label>
                  <div className="relative flex items-center">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-455">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number"
                      required
                      className="pl-11 pr-4 py-3 w-full border border-slate-200 rounded-2xl text-xs bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-650 focus:bg-white transition-all h-[44px] font-semibold"
                    />
                  </div>
                </div>

              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-6 mt-4">
                <Link
                  href="/"
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-700 text-xs font-bold rounded-xl transition-all h-10 flex items-center justify-center cursor-pointer"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all h-10 flex items-center justify-center cursor-pointer shadow-md shadow-indigo-100 disabled:opacity-70 gap-1.5"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-white font-bold text-sm">
              BookMyVenue
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}