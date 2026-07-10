import React, { useEffect, useState, useRef } from 'react';
import { useAppStore } from '@/store/app.store';
import { profileApi, type ProfileResponse } from '../services/profile.api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import ProfileHeader from '../components/layout/ProfileHeader';
import VerificationBanner from '../components/layout/VerificationBanner';
import PersonalInfoSection from '../components/layout/PersonalInfoSection';
import OwnerInfoSection from '../components/layout/OwnerInfoSection';

const UserProfile = () => {
  const currentUser = useAppStore((state) => state.user);
  const setAuth = useAppStore((state) => state.setAuth);
  const setOwner = useAppStore((state) => state.setOwner);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileResponse['data'] | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Owner states
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  // File states
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [idProofPreview, setIdProofPreview] = useState<string>('');

  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [idProofName, setIdProofName] = useState<string>('');
  const [idProofOpen, setIdProofOpen] = useState<boolean>(false);

  // Input refs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const idProofInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await profileApi.getProfile();
      if (res.success) {
        setProfileData(res.data);
        setOwner(res.data.owner || null);

        // Initialize form fields
        setFullName(res.data.user.fullName || '');
        setPhoneNumber(res.data.user.phoneNumber || '');

        // Revoke any previous object URLs to prevent leaks
        setAvatarPreview((prev) => {
          if (prev && prev.startsWith('blob:')) {
            URL.revokeObjectURL(prev);
          }
          return res.data.user.avatar || '';
        });

        if (res.data.owner) {
          setIdProofPreview((prev) => {
            if (prev && prev.startsWith('blob:')) {
              URL.revokeObjectURL(prev);
            }
            return res.data.owner?.idProof || '';
          });
          setStreet(res.data.owner.address?.street || '');
          setCity(res.data.owner.address?.city || '');
          setState(res.data.owner.address?.state || '');
          setPincode(res.data.owner.address?.pincode || '');

          setAccountHolderName(res.data.owner.bankDetails?.accountHolderName || '');
          setAccountNumber(res.data.owner.bankDetails?.accountNumber || '');
          setIfscCode(res.data.owner.bankDetails?.ifscCode || '');
          if (res.data.owner.idProof) {
            const parts = res.data.owner.idProof.split('/');
            setIdProofName(parts[parts.length - 1] || 'Current ID Proof');
          }
        } else {
          setIdProofPreview('');
          setIdProofName('');
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    // Cleanup object URLs on unmount
    return () => {
      setAvatarPreview((prev) => {
        if (prev && prev.startsWith('blob:')) {
          URL.revokeObjectURL(prev);
        }
        return '';
      });
      setIdProofPreview((prev) => {
        if (prev && prev.startsWith('blob:')) {
          URL.revokeObjectURL(prev);
        }
        return '';
      });
    };
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview((prev) => {
        if (prev && prev.startsWith('blob:')) {
          URL.revokeObjectURL(prev);
        }
        return URL.createObjectURL(file);
      });
    }
  };

  const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdProofFile(file);
      setIdProofName(file.name);
      setIdProofPreview((prev) => {
        if (prev && prev.startsWith('blob:')) {
          URL.revokeObjectURL(prev);
        }
        return URL.createObjectURL(file);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('phoneNumber', phoneNumber);

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      if (currentUser?.role === 'owner') {
        formData.append('street', street);
        formData.append('city', city);
        formData.append('state', state);
        formData.append('pincode', pincode);
        formData.append('accountHolderName', accountHolderName);
        formData.append('accountNumber', accountNumber);
        formData.append('ifscCode', ifscCode);
        if (idProofFile) {
          formData.append('idProof', idProofFile);
        }
      }

      const res = await profileApi.updateProfile(formData);
      if (res.success) {
        toast.success('Profile updated successfully!');
        setProfileData(res.data);
        setOwner(res.data.owner || null);

        // Update globally stored user details
        setAuth({
          ...currentUser,
          _id: res.data.user._id,
          fullName: res.data.user.fullName,
          email: res.data.user.email,
          role: res.data.user.role,
          avatar: res.data.user.avatar,
        });

        // Clear local file states
        setAvatarFile(null);
        setIdProofFile(null);

        // Revoke the preview URLs we had created if they were blob URLs
        if (avatarPreview && avatarPreview.startsWith('blob:')) {
          URL.revokeObjectURL(avatarPreview);
        }
        if (idProofPreview && idProofPreview.startsWith('blob:')) {
          URL.revokeObjectURL(idProofPreview);
        }

        // Set backend avatar/idProof URLs
        setAvatarPreview(res.data.user.avatar || '');
        if (res.data.owner?.idProof) {
          setIdProofPreview(res.data.owner.idProof);
          const parts = res.data.owner.idProof.split('/');
          setIdProofName(parts[parts.length - 1] || 'Current ID Proof');
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-foreground/70 font-medium">Loading profile details...</p>
      </div>
    );
  }

  const user = profileData?.user;
  const owner = profileData?.owner;

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Page Title */}
      <ProfileHeader />

      {/* Verification Banner for Owners */}
      <VerificationBanner role={user?.role} owner={owner} />

      {/* Outer Layout Box */}
      <div className="bg-surface rounded-3xl border border-border shadow-md overflow-hidden min-h-150 w-full">
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-8 sm:p-12 md:p-14 flex flex-col justify-between">
          <div className="space-y-12">
            {/* 1. PERSONAL INFO SECTION */}
            <PersonalInfoSection
              fullName={fullName}
              setFullName={setFullName}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              email={user?.email}
              role={user?.role}
              avatarPreview={avatarPreview}
              avatarInputRef={avatarInputRef}
              onAvatarChange={handleAvatarChange}
            />

            {/* 2. OWNER INFO SECTION */}
            {user?.role === 'owner' && (
              <OwnerInfoSection
                street={street}
                setStreet={setStreet}
                city={city}
                setCity={setCity}
                state={state}
                setState={setState}
                pincode={pincode}
                setPincode={setPincode}
                accountHolderName={accountHolderName}
                setAccountHolderName={setAccountHolderName}
                accountNumber={accountNumber}
                setAccountNumber={setAccountNumber}
                ifscCode={ifscCode}
                setIfscCode={setIfscCode}
                idProofName={idProofName}
                idProofPreview={idProofPreview}
                idProofOpen={idProofOpen}
                setIdProofOpen={setIdProofOpen}
                idProofInputRef={idProofInputRef}
                onIdProofChange={handleIdProofChange}
              />
            )}
          </div>

          {/* Form Actions */}
          <div className="mt-12 pt-6 border-t border-border flex items-center justify-end gap-4 font-sans">
            <button
              type="button"
              onClick={fetchProfile}
              disabled={saving}
              className="px-5 py-2.5 border border-border text-xs sm:text-sm font-semibold rounded-xl text-foreground hover:bg-muted/30 disabled:opacity-50 cursor-pointer"
            >
              Reset Changes
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-primary hover:bg-accent text-xs sm:text-sm font-semibold text-white rounded-xl shadow-md transition-all duration-200 disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
