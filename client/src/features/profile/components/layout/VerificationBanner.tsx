import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import type { ProfileResponse } from '../../services/profile.api';

interface VerificationBannerProps {
  role?: 'user' | 'owner' | 'admin';
  owner?: ProfileResponse['data']['owner'];
}

const VerificationBanner: React.FC<VerificationBannerProps> = ({ role, owner }) => {
  if (role !== 'owner') return null;

  return (
    <div className="mb-8">
      {!owner ? (
        <div className="flex gap-4 p-6 rounded-2xl border border-warning/30 bg-warning/5 text-warning-foreground">
          <Clock className="w-6 h-6 shrink-0 text-warning" />
          <div>
            <h4 className="font-semibold text-base">Onboarding Required</h4>
            <p className="mt-1.5 text-sm sm:text-base text-foreground/75 leading-relaxed">
              You are registered as a Venue Owner. Please complete the **Venue Owner Info** section
              below to submit your details for verification. Once approved, you can start listing
              venues.
            </p>
          </div>
        </div>
      ) : owner.verificationStatus === 'pending' ? (
        <div className="flex gap-4 p-6 rounded-2xl border border-warning/30 bg-warning/5 text-warning-foreground">
          <Clock className="w-6 h-6 shrink-0 text-warning" />
          <div>
            <h4 className="font-semibold text-base">Verification Pending</h4>
            <p className="mt-1.5 text-sm sm:text-base text-foreground/75 leading-relaxed">
              Your owner profile is currently pending administrator verification. We will verify
              your ID proof and bank details shortly.
            </p>
          </div>
        </div>
      ) : owner.verificationStatus === 'approved' ? (
        <div className="flex gap-4 p-6 rounded-2xl border border-success/30 bg-success/5 text-success-foreground">
          <CheckCircle className="w-6 h-6 shrink-0 text-success" />
          <div>
            <h4 className="font-semibold text-base">Verification Approved</h4>
            <p className="mt-1.5 text-sm sm:text-base text-foreground/75 leading-relaxed">
              Congratulations! Your owner profile has been fully verified and approved. You have
              full access to listing and managing venues.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 p-6 rounded-2xl border border-error/30 bg-error/5 text-error-foreground">
          <XCircle className="w-6 h-6 shrink-0 text-error" />
          <div>
            <h4 className="font-semibold text-base">Verification Rejected</h4>
            <p className="mt-1.5 text-sm sm:text-base text-foreground/75 leading-relaxed">
              Your verification details were rejected. Please review the reason below, update your
              details, and resubmit for approval.
            </p>
            {owner.rejectionReason && (
              <div className="mt-4 p-4 rounded-xl bg-error/10 border border-error/20 text-xs sm:text-sm font-semibold text-error">
                Reason: {owner.rejectionReason}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationBanner;
