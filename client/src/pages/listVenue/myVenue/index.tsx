import { Link } from 'react-router';
import { MdAddBusiness } from 'react-icons/md';
import { useApiQuery } from '@/hooks/useApi';
import { API_ENDPOINTS } from '@/constants';
import type { MyVenue } from '@/types/venue.types';
import VenueCard from './components/VenueCard';
import { Button } from '@/components/ui/button';
import VenueCardSkeleton from '@/components/common/VenueCardSkeleton';

interface MyVenuesResponse {
  count: number;
  venues: MyVenue[];
}

const MyVenues = () => {
  const { data, isLoading, isError, refetch } = useApiQuery<MyVenuesResponse>(
    'my-venues',
    {
      url: API_ENDPOINTS.MY_VENUES,
      method: 'GET',
    },
    {
      refetchOnMount: 'always',
    }
  );

  return (
    <section className="animate-slide-in-right">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">My Venues</h1>
          <p className="mt-1 md:mt-2 text-sm md:text-base text-[var(--text-secondary)]">
            Manage your listed venues and check their approval status.
          </p>
        </div>

        {data?.venues && data.venues.length > 0 && (
          <Button
            className="w-full md:w-auto bg-[var(--bg-green)] text-white hover:bg-[var(--bg-green)]/90"
            asChild
          >
            <Link to="/list-venue/add-venue">Add New Venue</Link>
          </Button>
        )}
      </div>

      {isLoading && <VenueCardSkeleton count={3} />}

      {isError && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-2xl p-8 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            Failed to load your venues. Please try again.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {data && data.venues.length === 0 && (
        <div className="bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-[var(--bg-primary)] rounded-full flex items-center justify-center mb-6 text-[var(--bg-green)]">
            <MdAddBusiness size={40} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">No venues yet</h2>
          <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-8">
            You haven't listed any venues yet. Start earning by listing your space for events,
            weddings, and parties.
          </p>
          <Button
            size="lg"
            className="bg-[var(--bg-green)] text-white hover:bg-[var(--bg-green)]/90 rounded-xl"
            asChild
          >
            <Link to="/list-venue/add-venue">List Your First Venue</Link>
          </Button>
        </div>
      )}

      {data && data.venues.length > 0 && (
        <div className="space-y-8">
          {(() => {
            const flagged = data.venues.filter((v) => v.status !== 'Approved');
            const approved = data.venues.filter((v) => v.status === 'Approved');
            return (
              <>
                {flagged.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-lg font-bold text-[var(--text-primary)]">
                        Needs Attention
                      </h2>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                        {flagged.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {flagged.map((venue) => (
                        <VenueCard key={venue._id} venue={venue} />
                      ))}
                    </div>
                  </section>
                )}
                {approved.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-lg font-bold text-[var(--text-primary)]">
                        Active Venues
                      </h2>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                        {approved.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {approved.map((venue) => (
                        <VenueCard key={venue._id} venue={venue} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            );
          })()}
        </div>
      )}
    </section>
  );
};

export default MyVenues;
