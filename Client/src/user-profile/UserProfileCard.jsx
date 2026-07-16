import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Edit2, Check, X, Camera } from 'lucide-react';

const AVATAR_OPTIONS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
];

export default function UserProfileCard({ user, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (url) => {
    setFormData((prev) => ({ ...prev, avatar: url }));
    setShowAvatarSelector(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
    setShowAvatarSelector(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)]">
      {/* Profile Header Background */}
      <div className="h-32 bg-gradient-to-r from-slate-900 to-slate-800 relative">
        <div className="absolute top-4 right-4">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 active:scale-95"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="px-6 pb-8 pt-0 relative">
        {/* Avatar Area */}
        <div className="flex flex-col items-center -mt-16 mb-6 relative">
          <div className="relative group">
            <img
              src={formData.avatar || AVATAR_OPTIONS[0]}
              alt={formData.name}
              className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-md bg-slate-100"
            />
            {isEditing && (
              <button
                type="button"
                onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                className="absolute bottom-1 right-1 bg-ticket-orange hover:bg-ticket-orange/90 text-white p-2 rounded-full shadow-md transition-all active:scale-95"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Avatar Selector Dropdown */}
          {isEditing && showAvatarSelector && (
            <div className="absolute top-16 z-20 bg-white border border-slate-200 rounded-2xl p-3 shadow-xl flex gap-2.5 mt-2 animate-fade-in">
              {AVATAR_OPTIONS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAvatarSelect(url)}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${
                    formData.avatar === url ? 'border-ticket-orange shadow-md' : 'border-transparent'
                  }`}
                >
                  <img src={url} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {!isEditing ? (
            <>
              <h2 className="text-2xl font-bold text-slate-800 mt-4 tracking-tight">{user.name}</h2>
              <span className="mt-1.5 px-3 py-1 bg-ticket-orange/10 border border-ticket-orange/20 text-ticket-orange text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                <Shield className="w-3 h-3" /> {user.role}
              </span>
              <p className="mt-4 text-sm text-slate-500 text-center max-w-sm font-medium leading-relaxed">
                "{user.bio}"
              </p>
            </>
          ) : (
            <span className="mt-3 text-xs text-slate-400 font-medium">Click the camera icon to change avatar</span>
          )}
        </div>

        <hr className="border-slate-100 my-6" />

        {/* View / Edit Mode Form */}
        {!isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-slate-200/50 flex items-center justify-center text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Full Name</div>
                <div className="text-sm font-bold text-slate-700">{user.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-slate-200/50 flex items-center justify-center text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</div>
                <div className="text-sm font-bold text-slate-700">{user.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-slate-200/50 flex items-center justify-center text-slate-500">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Number</div>
                <div className="text-sm font-bold text-slate-700">{user.phone}</div>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="text-[11px] text-slate-400 font-medium">Member since {user.memberSince}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ticket-orange focus:ring-2 focus:ring-ticket-orange/20 transition-all outline-none text-slate-700 font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ticket-orange focus:ring-2 focus:ring-ticket-orange/20 transition-all outline-none text-slate-700 font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ticket-orange focus:ring-2 focus:ring-ticket-orange/20 transition-all outline-none text-slate-700 font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ticket-orange focus:ring-2 focus:ring-ticket-orange/20 transition-all outline-none text-slate-700 font-medium text-sm resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-ticket-yellow hover:bg-ticket-yellow/90 text-slate-900 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 shadow-md shadow-ticket-yellow/10 active:scale-95"
              >
                <Check className="w-4 h-4" /> Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
