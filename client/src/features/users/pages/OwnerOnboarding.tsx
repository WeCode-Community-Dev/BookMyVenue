import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi, type ProfileResponse } from '@/features/profile/services/profile.api';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useAppStore } from '@/store/app.store';
import { toast } from 'sonner';
import {
  Building,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  CreditCard,
  Camera,
  FileText,
  Loader2,
  LogOut,
  RefreshCw,
} from 'lucide-react';

export default function OwnerOnboarding() {
  const navigate = useNavigate();
  const handleLogout = useLogout();
  const user = useAppStore((state) => state.user);
  const setOwner = useAppStore((state) => state.setOwner);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ownerData, setOwnerData] = useState<ProfileResponse['data']['owner'] | null>(null);

  // Form steps state
  const [step, setStep] = useState(1);

  // Verification Details Form State
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  // Files State
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [idProofName, setIdProofName] = useState('');
  const [idProofPreview, setIdProofPreview] = useState('');

  // Input refs
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const idProofInputRef = useRef<HTMLInputElement>(null);

  const fetchStatus = async (showToast = false) => {
    try {
      if (showToast) setLoading(true);
      const res = await profileApi.getProfile();
      if (res.success) {
        setOwnerData(res.data.owner || null);
        setOwner(res.data.owner || null);

        // Pre-fill if owner details already exist (e.g. in rejected state)
        if (res.data.owner) {
          if (res.data.owner.verificationStatus === 'approved') {
            navigate('/owner/dashboard', { replace: true });
            return;
          }

          setStreet(res.data.owner.address?.street || '');
          setCity(res.data.owner.address?.city || '');
          setStateName(res.data.owner.address?.state || '');
          setPincode(res.data.owner.address?.pincode || '');

          setAccountHolderName(res.data.owner.bankDetails?.accountHolderName || '');
          setAccountNumber(res.data.owner.bankDetails?.accountNumber || '');
          setIfscCode(res.data.owner.bankDetails?.ifscCode || '');
          setProfileImagePreview(res.data.owner.profileImage || '');

          if (res.data.owner.idProof) {
            const parts = res.data.owner.idProof.split('/');
            setIdProofName(parts[parts.length - 1] || 'Current ID Proof Document');
            const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(res.data.owner.idProof);
            if (isImage) {
              setIdProofPreview(res.data.owner.idProof);
            } else {
              setIdProofPreview('');
            }
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to fetch verification status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdProofFile(file);
      setIdProofName(file.name);
      if (file.type.startsWith('image/')) {
        setIdProofPreview(URL.createObjectURL(file));
      } else {
        setIdProofPreview('');
      }
    }
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      // Must upload ID proof if not already uploaded
      if (!idProofFile && !idProofName) {
        toast.error('Please upload an ID Proof document (PDF, JPG, or PNG).');
        return false;
      }
      return true;
    }
    if (currentStep === 2) {
      if (!street.trim() || !city.trim() || !stateName.trim() || !pincode.trim()) {
        toast.error('Please fill out all address fields.');
        return false;
      }
      return true;
    }
    if (currentStep === 3) {
      if (!accountHolderName.trim() || !accountNumber.trim() || !ifscCode.trim()) {
        toast.error('Please fill out all bank account details.');
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('street', street);
      formData.append('city', city);
      formData.append('state', stateName);
      formData.append('pincode', pincode);
      formData.append('accountHolderName', accountHolderName);
      formData.append('accountNumber', accountNumber);
      formData.append('ifscCode', ifscCode);

      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }
      if (idProofFile) {
        formData.append('idProof', idProofFile);
      }

      const res = await profileApi.updateProfile(formData);
      if (res.success) {
        toast.success('Onboarding details submitted successfully!');
        setOwnerData(res.data.owner || null);
        setOwner(res.data.owner || null);
        // Reset file uploads
        setProfileImageFile(null);
        setIdProofFile(null);
        // Shift step or reload status which updates view to pending
        await fetchStatus();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit onboarding details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-foreground/75 font-semibold text-sm">Verifying account credentials...</p>
      </div>
    );
  }

  // 1. PENDING STATUS SCREEN
  if (ownerData && ownerData.verificationStatus === 'pending') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-3xl border border-border bg-surface p-8 shadow-xl text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-warning/10 p-5 text-warning animate-pulse">
              <Clock size={40} className="stroke-[1.5]" />
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
              Verification Under Review
            </h2>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Hello, <span className="font-semibold text-foreground">{user?.fullName}</span>. Your
              onboarding information has been received and is currently under review by our
              administrator.
            </p>
          </div>

          <div className="border-t border-border pt-6 space-y-4 text-left text-xs text-foreground/75">
            <p className="font-bold text-foreground text-center mb-2 uppercase tracking-wide">
              Submitted Details
            </p>
            <div className="grid grid-cols-3 gap-2 py-1">
              <span className="font-semibold text-foreground/50">Address:</span>
              <span className="col-span-2 truncate">
                {ownerData.address.street}, {ownerData.address.city}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1">
              <span className="font-semibold text-foreground/50">Account Name:</span>
              <span className="col-span-2 truncate">{ownerData.bankDetails.accountHolderName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1">
              <span className="font-semibold text-foreground/50">Account No:</span>
              <span className="col-span-2 truncate">
                ••••{ownerData.bankDetails.accountNumber.slice(-4)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
            <button
              onClick={() => fetchStatus(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-accent transition cursor-pointer shadow-sm"
            >
              <RefreshCw size={16} />
              Check Status
            </button>
            <button
              onClick={() => navigate('/owner/dashboard')}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-sm font-semibold text-foreground hover:bg-surface transition cursor-pointer"
            >
              <Building size={16} />
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. ONBOARDING WIZARD FORM (NOT SUBMITTED OR REJECTED STATES)
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Mini header */}
      <header className="border-b border-border bg-surface/85 backdrop-blur-xs px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Building className="text-primary w-6 h-6" />
          <span className="font-bold text-foreground text-base tracking-tight">
            BookMyVenue Owner Onboarding
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-3.5 py-2 border border-border rounded-xl text-xs font-semibold hover:bg-muted/30 text-foreground cursor-pointer transition-colors"
        >
          <LogOut size={14} />
          Logout
        </button>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="w-full max-w-4xl min-h-[580px] flex flex-col justify-between space-y-8 rounded-3xl border border-border bg-surface p-10 sm:p-12 md:p-14 shadow-xl">
          <div className="space-y-8">
            {/* Rejection Alert */}
            {ownerData?.verificationStatus === 'rejected' && (
              <div className="p-5 rounded-2xl border border-error/20 bg-error/5 text-error-foreground flex gap-4 animate-in fade-in duration-200">
                <XCircle className="w-6 h-6 text-error shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <h4 className="font-bold text-sm">Onboarding Details Rejected</h4>
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                    Your verification was rejected by the administrator. Please update the incorrect
                    details below and resubmit.
                  </p>
                  {ownerData.rejectionReason && (
                    <p className="text-xs font-bold text-error bg-error/10 p-3 rounded-lg border border-error/25 mt-2">
                      Rejection Reason: {ownerData.rejectionReason}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Heading */}
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Complete Your Onboarding
              </h2>
              <p className="mt-2 text-sm text-foreground/60">
                Submit your verification files and bank settings to start listing venues and
                receiving bookings.
              </p>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between py-1 px-2 border-b border-border/50 pb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center transition-all ${
                      step === s
                        ? 'bg-primary text-white scale-110 shadow-md shadow-primary/25'
                        : step > s
                          ? 'bg-success/15 text-success border border-success/30'
                          : 'bg-muted/30 text-foreground/50 border border-border'
                    }`}
                  >
                    {step > s ? <CheckCircle size={15} className="stroke-[2.5]" /> : s}
                  </div>
                  <span
                    className={`hidden sm:inline-block text-xs sm:text-sm font-semibold ${
                      step === s ? 'text-primary' : 'text-foreground/45'
                    }`}
                  >
                    {s === 1 ? 'ID Verification' : s === 2 ? 'Business Address' : 'Payout Settings'}
                  </span>
                  {s < 3 && <div className="hidden sm:block w-12 h-px bg-border mx-2" />}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between mt-4">
            <div className="space-y-8 flex-1 py-4">
              {/* STEP 1: VERIFICATION FILES */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Upload Verification Documents
                    </h3>
                    <p className="text-xs sm:text-sm text-foreground/50 mt-1">
                      Please upload an ID proof and optional business logo.
                    </p>
                  </div>

                  <div className="grid gap-8 grid-cols-1 md:grid-cols-2 pt-2">
                    {/* Profile Image (Business Logo or Photo) */}
                    <div className="space-y-3 p-6 rounded-2xl border border-border bg-muted/10 flex flex-col justify-between">
                      <label className="text-sm font-bold text-foreground/80">
                        Owner Profile Image / Logo
                      </label>
                      <div className="flex items-center gap-5 mt-2">
                        <div className="w-20 h-20 rounded-xl border border-border overflow-hidden bg-muted/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                          {profileImagePreview ? (
                            <img
                              src={profileImagePreview}
                              alt="Owner Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building className="w-8 h-8 text-foreground/30" />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => profileImageInputRef.current?.click()}
                          className="px-4 py-2.5 border border-border bg-background hover:bg-muted/30 text-xs sm:text-sm font-semibold rounded-xl text-foreground cursor-pointer flex items-center gap-2 transition"
                        >
                          <Camera size={14} />
                          Choose Photo
                        </button>
                        <input
                          type="file"
                          ref={profileImageInputRef}
                          onChange={handleProfileImageChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                      <p className="text-[10.5px] text-foreground/40 mt-3">
                        Used as your public profile photo or corporate logo.
                      </p>
                    </div>

                    {/* ID Proof upload */}
                    <div className="space-y-3 p-6 rounded-2xl border border-border bg-muted/10 flex flex-col justify-between">
                      <label className="text-sm font-bold text-foreground/80">
                        ID Proof Document *
                      </label>
                      <div className="flex flex-col gap-4 mt-2">
                        {idProofPreview ? (
                          <div className="w-full h-32 rounded-xl border border-border overflow-hidden bg-background flex items-center justify-center shadow-xs">
                            <img
                              src={idProofPreview}
                              alt="ID Proof Preview"
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                        ) : idProofName ? (
                          <div className="w-full h-32 rounded-xl border border-border bg-background flex flex-col items-center justify-center gap-2 shadow-xs">
                            <FileText className="w-10 h-10 text-primary animate-pulse" />
                            <span className="text-xs font-semibold text-foreground/70 truncate px-4 max-w-xs">
                              {idProofName}
                            </span>
                            {ownerData?.idProof && (
                              <a
                                href={ownerData.idProof}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-primary hover:underline font-semibold"
                              >
                                View Document
                              </a>
                            )}
                          </div>
                        ) : null}
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => idProofInputRef.current?.click()}
                            className="px-4 py-2.5 bg-primary/10 text-primary hover:bg-primary/20 text-xs sm:text-sm font-semibold rounded-xl cursor-pointer flex items-center gap-2 transition"
                          >
                            <Upload size={14} />
                            Upload Document
                          </button>
                          <input
                            type="file"
                            ref={idProofInputRef}
                            onChange={handleIdProofChange}
                            accept="image/*,application/pdf"
                            className="hidden"
                          />
                          {idProofName ? (
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-foreground/75 truncate max-w-[200px]">
                              <FileText size={14} className="text-primary flex-shrink-0" />
                              <span className="truncate">{idProofName}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-foreground/40">
                              No document uploaded.
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-[10.5px] text-foreground/40 mt-3">
                        Accepts PDF, JPG, PNG (Aadhaar, Passport, etc.). Max 5MB.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: BUSINESS ADDRESS */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <MapPin size={18} className="text-primary" />
                      Business Address Details
                    </h3>
                    <p className="text-xs sm:text-sm text-foreground/50 mt-1">
                      Physical location of your corporate operations or billing entity.
                    </p>
                  </div>

                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 pt-2">
                    <div className="space-y-1.5 md:col-span-2">
                      <label htmlFor="street" className="text-xs font-semibold text-foreground/70">
                        Street Address
                      </label>
                      <input
                        id="street"
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="123 Main St, Suite 400"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground focus:outline-none focus:border-primary transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="city" className="text-xs font-semibold text-foreground/70">
                        City
                      </label>
                      <input
                        id="city"
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="New York"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground focus:outline-none focus:border-primary transition-all duration-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="stateName"
                          className="text-xs font-semibold text-foreground/70"
                        >
                          State
                        </label>
                        <input
                          id="stateName"
                          type="text"
                          required
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                          placeholder="NY"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground focus:outline-none focus:border-primary transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="pincode"
                          className="text-xs font-semibold text-foreground/70"
                        >
                          Pincode
                        </label>
                        <input
                          id="pincode"
                          type="text"
                          required
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="10001"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground focus:outline-none focus:border-primary transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYOUT SETTINGS */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <CreditCard size={18} className="text-primary" />
                      Payout Bank Account
                    </h3>
                    <p className="text-xs sm:text-sm text-foreground/50 mt-1">
                      Please provide checking or savings details for booking payouts.
                    </p>
                  </div>

                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 pt-2">
                    <div className="space-y-1.5 md:col-span-2">
                      <label
                        htmlFor="accountHolderName"
                        className="text-xs font-semibold text-foreground/70"
                      >
                        Account Holder Name
                      </label>
                      <input
                        id="accountHolderName"
                        type="text"
                        required
                        value={accountHolderName}
                        onChange={(e) => setAccountHolderName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground focus:outline-none focus:border-primary transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="accountNumber"
                        className="text-xs font-semibold text-foreground/70"
                      >
                        Account Number
                      </label>
                      <input
                        id="accountNumber"
                        type="text"
                        required
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="000123456789"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground focus:outline-none focus:border-primary transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="ifscCode"
                        className="text-xs font-semibold text-foreground/70"
                      >
                        IFSC / Routing Code
                      </label>
                      <input
                        id="ifscCode"
                        type="text"
                        required
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value)}
                        placeholder="ABCD0123456"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground focus:outline-none focus:border-primary transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={saving}
                  className="px-5 py-2.5 border border-border text-xs sm:text-sm font-semibold rounded-xl text-foreground hover:bg-muted/30 disabled:opacity-50 cursor-pointer transition-colors animate-in"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-primary hover:bg-accent text-xs sm:text-sm font-semibold text-white rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-primary hover:bg-accent text-xs sm:text-sm font-semibold text-white rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Verification Details'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
