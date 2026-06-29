import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services';
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi';
import {
  MdLocationOn,
  MdKeyboardArrowDown,
  MdPerson,
  MdVpnKey,
  MdLogout,
  MdClose,
  MdVisibility,
  MdVisibilityOff,
  MdAddCircleOutline
} from 'react-icons/md';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, isAuthenticated, logout, isAdmin, isVenueOwner } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Modals States
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Password Visibility States
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Forms States
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  // Fetch Live Profile Info
  const fetchProfileDetails = async () => {
    try {
      const res = await userService.getMe();
      setProfileForm({
        name: res.data.name || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
      });
    } catch {
      toast.error('Failed to load profile details');
    }
  };

  const handleOpenProfile = () => {
    fetchProfileDetails();
    setShowProfileModal(true);
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const handleOpenPassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setShowPasswordModal(true);
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile({
        name: profileForm.name,
        phone: profileForm.phone,
      });
      toast.success('Contact information saved successfully.');
      setShowProfileModal(false);
    } catch {
      toast.error('Failed to save profile settings');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error('Please enter all password fields');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }
    try {
      await userService.updatePassword(currentPassword, newPassword);
      toast.success('Password updated successfully.');
      setShowPasswordModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  // Dynamic Password Strength Meter
  const checkPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-200 w-0' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score, label: 'Weak', color: 'bg-rose-500 w-1/3' };
    if (score === 2 || score === 3) return { score, label: 'Medium', color: 'bg-amber-500 w-2/3' };
    return { score, label: 'Strong', color: 'bg-emerald-500 w-full' };
  };

  const strength = checkPasswordStrength(newPassword);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 bg-white/95 border-b border-slate-200/80 shadow-sm backdrop-blur-md">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight" onClick={() => setMenuOpen(false)}>
            <MdLocationOn className="text-2xl text-primary animate-pulse" />
            <span className="text-slate-900">Book<span className="text-primary font-black">My</span>Venue</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">

            {isAuthenticated ? (
              <>

                {/* Interactive Profile Dropdown */}
                <div className="relative pl-4 border-l border-slate-200" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-3 cursor-pointer select-none group text-left focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-sm transition-transform group-hover:scale-105">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-900 leading-tight flex items-center gap-0.5 group-hover:text-primary transition-colors">
                        {user?.name}
                        <MdKeyboardArrowDown className={`text-sm transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                      </span>
                      <span className="text-[10px] text-slate-500 capitalize font-medium">{user?.role?.replace('_', ' ')}</span>
                    </div>
                  </button>

                  {/* Dropdown Card */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 text-slate-800 animate-fade-in">
                      <div className="px-4 py-3 border-b border-slate-50 flex flex-col">
                        <span className="text-xs font-bold text-slate-900 truncate">{user?.name}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{user?.role?.replace('_', ' ')}</span>
                      </div>

                      <button
                        onClick={handleOpenProfile}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors flex items-center gap-2.5"
                      >
                        <MdPerson className="text-base text-slate-400" /> Profile Details
                      </button>

                      <button
                        onClick={handleOpenPassword}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors flex items-center gap-2.5"
                      >
                        <MdVpnKey className="text-base text-slate-400" /> Change Password
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2.5 border-t border-slate-50 mt-1.5"
                      >
                        <MdLogout className="text-base" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary transition-all duration-200">
                  Sign In
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-bold rounded-lg bg-primary hover:bg-primary-dark text-white shadow-sm shadow-primary/15 transition-all duration-200 hover:scale-[1.02]">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-2xl text-slate-800 hover:text-primary transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <HiX /> : <HiOutlineMenuAlt3 />}
          </button>
        </div>

        {/* Mobile Links Dropdown */}
        {menuOpen && (
          <div className="absolute top-[65px] left-0 right-0 bg-white border-b border-slate-200 p-6 flex flex-col gap-4 md:hidden shadow-lg animate-fade-in text-slate-800">

            {isAuthenticated ? (
              <>

                {/* Profile links for mobile */}
                <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    onClick={handleOpenProfile}
                    className="text-sm font-semibold text-slate-600 hover:text-primary flex items-center gap-2 text-left"
                  >
                    <MdPerson className="text-lg" /> Profile Details
                  </button>
                  <button
                    onClick={handleOpenPassword}
                    className="text-sm font-semibold text-slate-600 hover:text-primary flex items-center gap-2 text-left"
                  >
                    <MdVpnKey className="text-lg" /> Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full mt-2 py-2.5 text-center text-xs font-bold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <MdLogout className="text-base" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                <Link to="/login" className="w-full py-2.5 text-center text-sm font-semibold text-slate-600 bg-slate-50 rounded-lg border border-slate-200" onClick={() => setMenuOpen(false)}>
                  Sign In
                </Link>
                <Link to="/register" className="w-full py-2.5 text-center text-sm font-bold rounded-lg bg-primary text-white" onClick={() => setMenuOpen(false)}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* ========================================================================= */}
      {/* 🚀 GLOBAL PROFILE POPUP MODAL */}
      {/* ========================================================================= */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] p-4 animate-fade-in text-slate-800">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.15)] border border-slate-200 flex flex-col gap-4 relative">

            {/* Close Button */}
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors text-xl"
            >
              <MdClose />
            </button>

            <div>
              <h3 className="text-lg font-black text-slate-950 tracking-tight">Edit Contact Information</h3>
              <p className="text-slate-500 text-xs mt-1">Keep your active contact details up to date for platform communications.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={profileForm.name}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email (Locked)</label>
                <input
                  type="email"
                  className="w-full py-2.5 px-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 text-sm focus:outline-none cursor-not-allowed"
                  value={profileForm.email}
                  disabled
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone number</label>
                <input
                  type="text"
                  className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={profileForm.phone}
                  onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚀 GLOBAL CHANGE PASSWORD POPUP MODAL */}
      {/* ========================================================================= */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] p-4 animate-fade-in text-slate-800">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.15)] border border-slate-200 flex flex-col gap-4 relative">

            {/* Close Button */}
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors text-xl"
            >
              <MdClose />
            </button>

            <div>
              <h3 className="text-lg font-black text-slate-950 tracking-tight">Change Password</h3>
              <p className="text-slate-500 text-xs mt-1">Regularly modify your platform password to prevent unauthorized account manipulation.</p>
            </div>

            <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    className="w-full py-2.5 pl-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none text-lg cursor-pointer"
                  >
                    {showCurrent ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    className="w-full py-2.5 pl-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none text-lg cursor-pointer"
                  >
                    {showNew ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>

                {/* Dynamic Password Strength progress bar */}
                {newPassword && (
                  <div className="mt-2 flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[9px] font-bold uppercase text-slate-500 tracking-wider">
                      <span>Password Strength:</span>
                      <span className={`${strength.label === 'Strong' ? 'text-emerald-600' :
                        strength.label === 'Medium' ? 'text-amber-500' : 'text-rose-500'
                        }`}>{strength.label}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
                      <div className={`h-full transition-all duration-300 ${strength.color}`} />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    className="w-full py-2.5 pl-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none text-lg cursor-pointer"
                  >
                    {showConfirm ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow transition-colors"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  );
}
