import React from 'react';
import { User as UserIcon, Phone, Mail, Building } from 'lucide-react';
import AvatarUpload from '../ui/AvatarUpload';

interface PersonalInfoSectionProps {
  fullName: string;
  setFullName: (val: string) => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  email?: string;
  role?: string;
  avatarPreview: string;
  avatarInputRef: React.RefObject<HTMLInputElement | null>;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  fullName,
  setFullName,
  phoneNumber,
  setPhoneNumber,
  email,
  role,
  avatarPreview,
  avatarInputRef,
  onAvatarChange,
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">Personal Information</h3>
        <p className="text-sm text-foreground/50 mt-1.5">
          Configure your primary contact and identification data.
        </p>
      </div>

      {/* Avatar Upload */}
      <AvatarUpload
        avatarPreview={avatarPreview}
        avatarInputRef={avatarInputRef}
        onAvatarChange={onAvatarChange}
      />

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        {/* Full Name */}
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-semibold text-foreground/80">
            Full Name
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-foreground/40" />
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-surface text-sm sm:text-base text-foreground focus:outline-none focus:border-primary transition-all duration-200 shadow-xs"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="text-sm font-semibold text-foreground/80">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-foreground/40" />
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-surface text-sm sm:text-base text-foreground focus:outline-none focus:border-primary transition-all duration-200 shadow-xs"
            />
          </div>
        </div>

        {/* Email (Read Only) */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-foreground/80">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-foreground/40" />
            <input
              id="email"
              type="email"
              disabled
              value={email || ''}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-muted/20 text-sm sm:text-base text-foreground/60 cursor-not-allowed"
            />
          </div>
          <span className="text-xs text-foreground/40">Registered email cannot be modified.</span>
        </div>

        {/* Role (Read Only) */}
        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-semibold text-foreground/80">
            User Role
          </label>
          <div className="relative">
            <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-foreground/40" />
            <input
              id="role"
              type="text"
              disabled
              value={role?.toUpperCase() || 'USER'}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-muted/20 text-sm sm:text-base text-foreground/60 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
