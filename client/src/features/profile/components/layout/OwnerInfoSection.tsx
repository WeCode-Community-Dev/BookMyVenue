import React from 'react';
import { MapPin, CreditCard } from 'lucide-react';
import IdProofUpload from '../ui/IdProofUpload';

interface OwnerInfoSectionProps {
  street: string;
  setStreet: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  state: string;
  setState: (val: string) => void;
  pincode: string;
  setPincode: (val: string) => void;
  accountHolderName: string;
  setAccountHolderName: (val: string) => void;
  accountNumber: string;
  setAccountNumber: (val: string) => void;
  ifscCode: string;
  setIfscCode: (val: string) => void;
  idProofName: string;
  idProofPreview: string;
  idProofOpen: boolean;
  setIdProofOpen: (open: boolean) => void;
  idProofInputRef: React.RefObject<HTMLInputElement | null>;
  onIdProofChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OwnerInfoSection: React.FC<OwnerInfoSectionProps> = ({
  street,
  setStreet,
  city,
  setCity,
  state,
  setState,
  pincode,
  setPincode,
  accountHolderName,
  setAccountHolderName,
  accountNumber,
  setAccountNumber,
  ifscCode,
  setIfscCode,
  idProofName,
  idProofPreview,
  idProofOpen,
  setIdProofOpen,
  idProofInputRef,
  onIdProofChange,
}) => {
  return (
    <div className="space-y-8 border-t border-border pt-10">
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">Venue Owner Information</h3>
        <p className="text-sm text-foreground/50 mt-1.5">
          Submit documents, business address and bank details for revenue payouts.
        </p>
      </div>

      {/* ID Proof upload */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        <IdProofUpload
          idProofName={idProofName}
          idProofPreview={idProofPreview}
          idProofOpen={idProofOpen}
          setIdProofOpen={setIdProofOpen}
          idProofInputRef={idProofInputRef}
          onIdProofChange={onIdProofChange}
        />
      </div>

      {/* Address Section */}
      <div className="space-y-4 border-t border-border pt-6">
        <h4 className="text-sm sm:text-base font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2">
          <MapPin size={14} className="text-primary" />
          Business / Contact Address
        </h4>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="street" className="text-xs font-semibold text-foreground/60">
              Street Address
            </label>
            <input
              id="street"
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="123 Main St, Suite 400"
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm sm:text-base text-foreground focus:outline-none focus:border-primary transition-all duration-200"
            />
          </div>

          <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="city" className="text-xs font-semibold text-foreground/60">
                City
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="New York"
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm sm:text-base text-foreground focus:outline-none focus:border-primary transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="state" className="text-xs font-semibold text-foreground/60">
                State / Region
              </label>
              <input
                id="state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="NY"
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm sm:text-base text-foreground focus:outline-none focus:border-primary transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="pincode" className="text-xs font-semibold text-foreground/60">
                Pincode
              </label>
              <input
                id="pincode"
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="10001"
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm sm:text-base text-foreground focus:outline-none focus:border-primary transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bank details Section */}
      <div className="space-y-4 border-t border-border pt-6">
        <h4 className="text-sm sm:text-base font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2">
          <CreditCard size={14} className="text-primary" />
          Payout Bank Account Details
        </h4>

        <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="accountHolderName" className="text-xs font-semibold text-foreground/60">
              Account Holder Name
            </label>
            <input
              id="accountHolderName"
              type="text"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm sm:text-base text-foreground focus:outline-none focus:border-primary transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="accountNumber" className="text-xs font-semibold text-foreground/60">
              Account Number
            </label>
            <input
              id="accountNumber"
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="000123456789"
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm sm:text-base text-foreground focus:outline-none focus:border-primary transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="ifscCode" className="text-xs font-semibold text-foreground/60">
              IFSC / Routing Code
            </label>
            <input
              id="ifscCode"
              type="text"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value)}
              placeholder="ABCD0123456"
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm sm:text-base text-foreground focus:outline-none focus:border-primary transition-all duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerInfoSection;
