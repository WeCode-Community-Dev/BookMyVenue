import { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ProtectedNavbar, OwnerSidebar } from '@/shared/components/layout';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { Toaster } from 'sonner';
import { profileApi } from '@/features/profile/services/profile.api';
import { useAppStore } from '@/store/app.store';
import { Loader2, AlertTriangle, Clock, XCircle, ArrowRight } from 'lucide-react';

export default function OwnerLayout() {
  const [checking, setChecking] = useState(true);
  const owner = useAppStore((state) => state.owner);
  const setOwner = useAppStore((state) => state.setOwner);

  useEffect(() => {
    let active = true;
    const checkVerification = async () => {
      try {
        const res = await profileApi.getProfile();
        if (!active) return;
        if (res.success) {
          setOwner(res.data.owner || null);
        }
      } catch (err) {
        console.error('OwnerLayout verification check failed:', err);
      } finally {
        if (active) {
          setChecking(false);
        }
      }
    };

    checkVerification();
    return () => {
      active = false;
    };
  }, [setOwner]);

  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-foreground/75 font-semibold text-sm">Verifying owner credentials...</p>
      </div>
    );
  }

  let banner = null;

  if (!owner) {
    banner = (
      <div className="bg-warning/10 border-b border-warning/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-warning font-sans">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div className="text-sm">
            <span className="font-bold">Onboarding Required:</span> Please complete your venue owner
            onboarding to start listing and managing venues.
          </div>
        </div>
        <Link
          to="/owner/onboarding"
          className="inline-flex items-center gap-1.5 text-xs font-bold bg-warning text-black px-4 py-2 rounded-xl hover:bg-warning/95 transition shrink-0 self-start sm:self-auto shadow-sm"
        >
          Complete Onboarding
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  } else if (owner.verificationStatus === 'pending') {
    banner = (
      <div className="bg-warning/10 border-b border-warning/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-warning font-sans">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 shrink-0 animate-pulse" />
          <div className="text-sm">
            <span className="font-bold">Verification Under Review:</span> Your details are being
            verified by our team. You can view the dashboard but cannot create or manage venues yet.
          </div>
        </div>
        <Link
          to="/owner/onboarding"
          className="inline-flex items-center gap-1.5 text-xs font-bold border border-warning/30 hover:bg-warning/10 px-4 py-2 rounded-xl transition shrink-0 self-start sm:self-auto text-warning"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  } else if (owner.verificationStatus === 'rejected') {
    banner = (
      <div className="bg-error/10 border-b border-error/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-error font-sans">
        <div className="flex items-center gap-3">
          <XCircle className="w-5 h-5 shrink-0" />
          <div className="text-sm">
            <span className="font-bold">Verification Rejected:</span> Your owner details were
            rejected.{' '}
            {owner.rejectionReason && (
              <span className="italic text-foreground/80 font-medium">
                Reason: "{owner.rejectionReason}"
              </span>
            )}
          </div>
        </div>
        <Link
          to="/owner/onboarding"
          className="inline-flex items-center gap-1.5 text-xs font-bold bg-error text-white px-4 py-2 rounded-xl hover:bg-error/95 transition shrink-0 self-start sm:self-auto shadow-sm"
        >
          Update Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Toaster richColors position="top-right" />
      <div className="flex min-h-screen">
        <OwnerSidebar />

        {/* Content panel */}
        <div className="flex flex-1 flex-col lg:pl-64">
          <ProtectedNavbar />

          {banner}

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
