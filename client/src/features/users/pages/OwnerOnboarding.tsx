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
  const setAuth = useAppStore((state) => state.setAuth);

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
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [idProofName, setIdProofName] = useState('');
  const [idProofPreview, setIdProofPreview] = useState('');

  // Validation Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Input refs
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

  const validateFile = (file: File, allowedTypes: string[], maxSizeMB: number): string | null => {
    const isTypeValid = allowedTypes.some((type) => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type);
      }
      return file.type.toLowerCase().startsWith(type.replace('*', ''));
    });

    if (!isTypeValid) {
      const readableFormats = allowedTypes
        .map((t) => t.replace('image/', '').replace('application/', '').replace('.', '').toUpperCase())
        .join(', ');
      return `Invalid file type. Allowed formats: ${readableFormats}.`;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size exceeds the maximum limit of ${maxSizeMB}MB.`;
    }

    return null;
  };

  const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFile(
        file,
        ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', '.jpg', '.jpeg', '.png', '.webp', '.pdf'],
        5
      );
      if (error) {
        setErrors((prev) => ({ ...prev, idProof: error }));
        toast.error(error);
        if (idProofInputRef.current) idProofInputRef.current.value = '';
        return;
      }
      setErrors((prev) => {
        const next = { ...prev };
        delete next.idProof;
        return next;
      });
      setIdProofFile(file);
      setIdProofName(file.name);
      if (file.type.startsWith('image/')) {
        setIdProofPreview(URL.createObjectURL(file));
      } else {
        setIdProofPreview('');
      }
    }
  };

  const handleFieldChange = (field: string, setter: (val: string) => void, value: string) => {
    setter(value);
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (targetStep: number): boolean => {
    const newErrors: Record<string, string> = { ...errors };

    if (targetStep === 1) {
      delete newErrors.idProof;

      if (!idProofFile && !idProofName) {
        newErrors.idProof = 'Please upload an ID Proof document (PDF, JPG, PNG, or WEBP).';
      } else if (idProofFile) {
        const fileErr = validateFile(
          idProofFile,
          ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', '.jpg', '.jpeg', '.png', '.webp', '.pdf'],
          5
        );
        if (fileErr) newErrors.idProof = fileErr;
      }
    }

    if (targetStep === 2) {
      delete newErrors.street;
      delete newErrors.city;
      delete newErrors.stateName;
      delete newErrors.pincode;

      if (!street.trim()) {
        newErrors.street = 'Street address is required.';
      } else if (street.trim().length < 3) {
        newErrors.street = 'Street address must be at least 3 characters long.';
      }

      if (!city.trim()) {
        newErrors.city = 'City is required.';
      } else if (!/^[a-zA-Z\s.-]{2,50}$/.test(city.trim())) {
        newErrors.city = 'City must contain valid letters (min 2 characters).';
      }

      if (!stateName.trim()) {
        newErrors.stateName = 'State is required.';
      } else if (!/^[a-zA-Z\s.-]{2,50}$/.test(stateName.trim())) {
        newErrors.stateName = 'State must contain valid letters (min 2 characters).';
      }

      if (!pincode.trim()) {
        newErrors.pincode = 'Pincode is required.';
      } else if (!/^\d{5,6}$/.test(pincode.trim())) {
        newErrors.pincode = 'Pincode must be a valid 5 or 6 digit postal code.';
      }
    }

    if (targetStep === 3) {
      delete newErrors.accountHolderName;
      delete newErrors.accountNumber;
      delete newErrors.ifscCode;

      if (!accountHolderName.trim()) {
        newErrors.accountHolderName = 'Account holder name is required.';
      } else if (accountHolderName.trim().length < 3) {
        newErrors.accountHolderName = 'Account holder name must be at least 3 characters long.';
      } else if (!/^[a-zA-Z\s'.]{3,50}$/.test(accountHolderName.trim())) {
        newErrors.accountHolderName = 'Account holder name must contain only letters and spaces.';
      }

      if (!accountNumber.trim()) {
        newErrors.accountNumber = 'Account number is required.';
      } else if (!/^\d{9,18}$/.test(accountNumber.trim())) {
        newErrors.accountNumber = 'Account number must be between 9 and 18 digits.';
      }

      if (!ifscCode.trim()) {
        newErrors.ifscCode = 'IFSC / Routing code is required.';
      } else if (!/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(ifscCode.trim())) {
        newErrors.ifscCode = 'IFSC code must be valid (e.g., SBIN0001234 - 4 letters, 0, 6 digits/letters).';
      }
    }

    setErrors(newErrors);

    const stepFields: Record<number, string[]> = {
      1: ['idProof'],
      2: ['street', 'city', 'stateName', 'pincode'],
      3: ['accountHolderName', 'accountNumber', 'ifscCode'],
    };

    const firstStepError = stepFields[targetStep]?.map((f) => newErrors[f]).find(Boolean);
    if (firstStepError) {
      toast.error(firstStepError);
      return false;
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

    if (step < 3) {
      handleNext();
      return;
    }

    if (!validateStep(3)) {
      return;
    }

    if (!validateStep(1)) {
      setStep(1);
      return;
    }

    if (!validateStep(2)) {
      setStep(2);
      return;
    }

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

      if (idProofFile) {
        formData.append('idProof', idProofFile);
      }

      const res = await profileApi.updateProfile(formData);
      if (res.success) {
        toast.success('Onboarding details submitted successfully!');
        setOwnerData(res.data.owner || null);
        setOwner(res.data.owner || null);
        if (res.data.user) {
          setAuth(res.data.user);
        }
        // Reset file uploads
        setIdProofFile(null);
        setErrors({});
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
                {ownerData?.address?.street || 'N/A'}, {ownerData?.address?.city || ''}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1">
              <span className="font-semibold text-foreground/50">Account Name:</span>
              <span className="col-span-2 truncate">{ownerData?.bankDetails?.accountHolderName || 'N/A'}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1">
              <span className="font-semibold text-foreground/50">Account No:</span>
              <span className="col-span-2 truncate">
                {ownerData?.bankDetails?.accountNumber
                  ? `••••${ownerData.bankDetails.accountNumber.slice(-4)}`
                  : '••••••••'}
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
                      Upload Verification Document
                    </h3>
                    <p className="text-xs sm:text-sm text-foreground/50 mt-1">
                      Please upload a valid government-issued ID proof document.
                    </p>
                  </div>

                  <div className="pt-2">
                    {/* ID Proof upload */}
                    <div className={`space-y-4 p-8 rounded-2xl border bg-muted/10 flex flex-col justify-between transition-all ${
                      errors.idProof ? 'border-error ring-1 ring-error/30' : 'border-border'
                    }`}>
                      <label className="text-sm font-bold text-foreground/80">
                        ID Proof Document *
                      </label>
                      <div className="flex flex-col gap-4">
                        {idProofPreview ? (
                          <div className="w-full h-40 rounded-xl border border-border overflow-hidden bg-background flex items-center justify-center shadow-xs">
                            <img
                              src={idProofPreview}
                              alt="ID Proof Preview"
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                        ) : idProofName ? (
                          <div className="w-full h-40 rounded-xl border border-border bg-background flex flex-col items-center justify-center gap-2 shadow-xs">
                            <FileText className="w-12 h-12 text-primary animate-pulse" />
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
                            className="px-5 py-3 bg-primary/10 text-primary hover:bg-primary/20 text-xs sm:text-sm font-semibold rounded-xl cursor-pointer flex items-center gap-2 transition"
                          >
                            <Upload size={16} />
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
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-foreground/75 truncate max-w-[280px]">
                              <FileText size={14} className="text-primary flex-shrink-0" />
                              <span className="truncate">{idProofName}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-foreground/40">
                              No document selected.
                            </span>
                          )}
                        </div>
                      </div>
                      {errors.idProof ? (
                        <p className="text-xs text-error mt-2 font-medium">{errors.idProof}</p>
                      ) : (
                        <p className="text-[11px] text-foreground/50 mt-2">
                          Accepts PDF, JPG, PNG, WEBP (Aadhaar, Passport, Driving License, etc.). Max 5MB.
                        </p>
                      )}
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
                        Street Address *
                      </label>
                      <input
                        id="street"
                        type="text"
                        value={street}
                        onChange={(e) => handleFieldChange('street', setStreet, e.target.value)}
                        placeholder="123 Main St, Suite 400"
                        className={`w-full px-4 py-3 rounded-xl border bg-surface text-sm text-foreground focus:outline-none transition-all duration-200 ${
                          errors.street
                            ? 'border-error focus:border-error ring-1 ring-error/30'
                            : 'border-border focus:border-primary'
                        }`}
                      />
                      {errors.street && (
                        <p className="text-xs text-error mt-1 font-medium">{errors.street}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="city" className="text-xs font-semibold text-foreground/70">
                        City *
                      </label>
                      <input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => handleFieldChange('city', setCity, e.target.value)}
                        placeholder="New York"
                        className={`w-full px-4 py-3 rounded-xl border bg-surface text-sm text-foreground focus:outline-none transition-all duration-200 ${
                          errors.city
                            ? 'border-error focus:border-error ring-1 ring-error/30'
                            : 'border-border focus:border-primary'
                        }`}
                      />
                      {errors.city && (
                        <p className="text-xs text-error mt-1 font-medium">{errors.city}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="stateName"
                          className="text-xs font-semibold text-foreground/70"
                        >
                          State *
                        </label>
                        <input
                          id="stateName"
                          type="text"
                          value={stateName}
                          onChange={(e) => handleFieldChange('stateName', setStateName, e.target.value)}
                          placeholder="NY"
                          className={`w-full px-4 py-3 rounded-xl border bg-surface text-sm text-foreground focus:outline-none transition-all duration-200 ${
                            errors.stateName
                              ? 'border-error focus:border-error ring-1 ring-error/30'
                              : 'border-border focus:border-primary'
                          }`}
                        />
                        {errors.stateName && (
                          <p className="text-xs text-error mt-1 font-medium">{errors.stateName}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="pincode"
                          className="text-xs font-semibold text-foreground/70"
                        >
                          Pincode *
                        </label>
                        <input
                          id="pincode"
                          type="text"
                          value={pincode}
                          onChange={(e) => handleFieldChange('pincode', setPincode, e.target.value)}
                          placeholder="10001"
                          className={`w-full px-4 py-3 rounded-xl border bg-surface text-sm text-foreground focus:outline-none transition-all duration-200 ${
                            errors.pincode
                              ? 'border-error focus:border-error ring-1 ring-error/30'
                              : 'border-border focus:border-primary'
                          }`}
                        />
                        {errors.pincode && (
                          <p className="text-xs text-error mt-1 font-medium">{errors.pincode}</p>
                        )}
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
                        Account Holder Name *
                      </label>
                      <input
                        id="accountHolderName"
                        type="text"
                        value={accountHolderName}
                        onChange={(e) =>
                          handleFieldChange('accountHolderName', setAccountHolderName, e.target.value)
                        }
                        placeholder="John Doe"
                        className={`w-full px-4 py-3 rounded-xl border bg-surface text-sm text-foreground focus:outline-none transition-all duration-200 ${
                          errors.accountHolderName
                            ? 'border-error focus:border-error ring-1 ring-error/30'
                            : 'border-border focus:border-primary'
                        }`}
                      />
                      {errors.accountHolderName && (
                        <p className="text-xs text-error mt-1 font-medium">
                          {errors.accountHolderName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="accountNumber"
                        className="text-xs font-semibold text-foreground/70"
                      >
                        Account Number *
                      </label>
                      <input
                        id="accountNumber"
                        type="text"
                        value={accountNumber}
                        onChange={(e) =>
                          handleFieldChange('accountNumber', setAccountNumber, e.target.value)
                        }
                        placeholder="000123456789"
                        className={`w-full px-4 py-3 rounded-xl border bg-surface text-sm text-foreground focus:outline-none transition-all duration-200 ${
                          errors.accountNumber
                            ? 'border-error focus:border-error ring-1 ring-error/30'
                            : 'border-border focus:border-primary'
                        }`}
                      />
                      {errors.accountNumber && (
                        <p className="text-xs text-error mt-1 font-medium">{errors.accountNumber}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="ifscCode"
                        className="text-xs font-semibold text-foreground/70"
                      >
                        IFSC / Routing Code *
                      </label>
                      <input
                        id="ifscCode"
                        type="text"
                        value={ifscCode}
                        onChange={(e) => handleFieldChange('ifscCode', setIfscCode, e.target.value)}
                        placeholder="ABCD0123456"
                        className={`w-full px-4 py-3 rounded-xl border bg-surface text-sm text-foreground focus:outline-none transition-all duration-200 ${
                          errors.ifscCode
                            ? 'border-error focus:border-error ring-1 ring-error/30'
                            : 'border-border focus:border-primary'
                        }`}
                      />
                      {errors.ifscCode && (
                        <p className="text-xs text-error mt-1 font-medium">{errors.ifscCode}</p>
                      )}
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
