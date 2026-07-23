import { OwnerShell } from '@/app/layout/owner-shell';
import { OwnerVenueForm } from '@/features/owner/components/owner-venue-form';
import { useCreateVenueMutation } from '@/features/venues/api/venues-api';

export function OwnerVenueNewRoute() {
  const [createVenue, { isLoading }] = useCreateVenueMutation();

  return (
    <OwnerShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-brand-text">New venue</h1>
          <p className="mt-2 text-brand-muted">Fill in the details customers will see on the listing.</p>
        </div>
        <OwnerVenueForm mode="create" isSaving={isLoading} onSave={(payload) => createVenue(payload).unwrap()} />
      </div>
    </OwnerShell>
  );
}

export default OwnerVenueNewRoute;
