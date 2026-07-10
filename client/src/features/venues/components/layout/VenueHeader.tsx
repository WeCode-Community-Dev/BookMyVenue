import { useAppStore } from '@/store/app.store';
import { Building2, Plus } from 'lucide-react';

type Props = {
  onAddClick: () => void;
};

const VenueHeader = ({ onAddClick }: Props) => {
  const owner = useAppStore((state) => state.owner);
  const isApproved = owner?.verificationStatus === 'approved';

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-3 text-primary">
          <Building2 size={24} className="stroke-[1.5]" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">My Venues</h1>
          <p className="text-sm text-muted mt-0.5">Manage and monitor your venue listings</p>
        </div>
      </div>

      <button
        onClick={onAddClick}
        disabled={!isApproved}
        title={
          !isApproved
            ? 'You must complete your verification onboarding before creating venues.'
            : ''
        }
        className={`
          inline-flex items-center justify-center gap-2
          rounded-xl bg-primary px-5 py-2.5
          text-sm font-semibold text-white
          shadow-lg shadow-primary/20
          transition-all duration-200
          ${!isApproved ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent active:scale-95 cursor-pointer'}
        `}
      >
        <Plus size={18} />
        Add Venue
      </button>
    </div>
  );
};

export default VenueHeader;
