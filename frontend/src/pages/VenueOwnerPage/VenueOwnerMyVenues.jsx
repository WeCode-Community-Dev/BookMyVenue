import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from "lucide-react";
import {
  getVenueOwnerVenues,
  getVenueOwnerVenuesCount,
  createDraftVenue,
  reEditRejectedVenue,
  submitVenue,
  setVenueVisibility,
  deleteVenue,
} from "../../services/venueOwner.service.js";
import VenueTable from '../../components/venueOwner/VenueTable.jsx';
import DashboardTabs, { TABS, getEmptyTabText } from '../../components/venueOwner/DashboardTabs.jsx';
import { showInfo } from '../../utils/toastBus';

const PAGE_LIMIT = 10;

function initTabState() {
  return Object.fromEntries(
    TABS.map((t, i) => [
      t.key,
      {
        venues: [],
        page: 1,
        totalPages: 1,
        total: 0,
        loading: i === 0,
        error: "",
      },
    ])
  );
}

export function VenueOwnerMyVenues() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [tabState, setTabState] = useState(initTabState);
  const [creating, setCreating] = useState(false);

  function setTab(key, patch) {
    setTabState(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  async function fetchCounts() {
    const results = await Promise.allSettled(
      TABS.map(t => getVenueOwnerVenuesCount({ status: t.statuses.join(',') }))
    );
    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        setTab(TABS[i].key, { total: result.value });
      }
    });
  }

  async function fetchTab(tabKey, page = 1) {
    const tab = TABS.find(t => t.key === tabKey);
    setTab(tabKey, { loading: true, error: '' });
    try {
      const res = await getVenueOwnerVenues({ status: tab.statuses.join(','), page, limit: PAGE_LIMIT });
      setTab(tabKey, {
        venues: res.data,
        page: res.pagination.page,
        totalPages: res.pagination.totalPages,
        total: res.pagination.total,
        loading: false,
      });
    } catch (err) {
      setTab(tabKey, { loading: false, error: err.message });
    }
  }

  useEffect(() => {
    fetchCounts();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTab(TABS[0].key, 1);
  }, []);

  function handleTabChange(key) {
    setActiveTab(key);
    // Only fetch if not yet loaded for this tab
    if (tabState[key].venues.length === 0 && !tabState[key].loading) {
      fetchTab(key, 1);
    }
  }

  function handlePageChange(page) {
    fetchTab(activeTab, page);
  }

  // Create an empty DRAFT, then go straight to the edit form for it. The form
  // autosaves field changes, so no data is collected before the redirect.
  // (The api client toasts the error on failure.)
  async function handleAddVenue() {
    if (creating) return;
    setCreating(true);
    try {
      const venue = await createDraftVenue();
      navigate(`/venue-owner/venues/edit/${venue._id}`);
    } catch {
      setCreating(false);
    }
  }

  async function handleAction(action, venue) {
    try {
      if (action === 'edit') {
        navigate(`/venue-owner/venues/edit/${venue._id}`);
        return;
      }
      if (action === 'reEdit') {
        // Flip the rejected venue back to a draft state, then edit it. The doc id
        // is unchanged (flipped in place), so we navigate to the same edit route.
        const editable = await reEditRejectedVenue(venue._id);
        navigate(`/venue-owner/venues/edit/${editable._id}`);
        return;
      }
      if (action === 'submit') await submitVenue(venue._id);
      if (action === 'disable') await setVenueVisibility(venue._id, false);
      if (action === 'enable') await setVenueVisibility(venue._id, true);
      if (action === 'delete') {
        const isEdit = venue.status === 'EDIT_DRAFT';
        const confirmMsg = isEdit
          ? `Discard your in-progress edits to "${venue.name}"? The live listing stays unchanged.`
          : `Delete "${venue.name}"? This cannot be undone.`;
        if (!window.confirm(confirmMsg)) return;
        await deleteVenue(venue._id);
        showInfo(isEdit ? 'Edits discarded' : 'Venue deleted');
      }
      // Refresh counts + current tab after mutation
      fetchCounts();
      fetchTab(activeTab, tabState[activeTab].page);
    } catch {
      // The api client already surfaces the error as a toast; nothing to add here.
    }
  }

  const current = tabState[activeTab];
  const counts = Object.fromEntries(TABS.map(t => [t.key, tabState[t.key].total]));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Venues</h1>
        <button
          onClick={handleAddVenue}
          disabled={creating}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
          <Plus size={16} />
          {creating ? 'Creating…' : 'Add Venue'}
        </button>
      </div>

      <DashboardTabs activeTab={activeTab} counts={counts} onTabChange={handleTabChange} />

      <div className="flex justify-end">
        <input
          placeholder="Search venues..."
          className="w-80 rounded-lg border border-gray-300 px-4 py-2"
        />
      </div>

      {current.loading && <p className="py-10 text-center text-gray-400 text-sm">Loading venues...</p>}
      {!current.loading && current.error && <p className="py-10 text-center text-red-500 text-sm">{current.error}</p>}
      {
        !current.loading && !current.error && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <VenueTable
              venues={current.venues}
              onAction={handleAction}
              emptyText={getEmptyTabText(activeTab)}
            />
            {current.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => handlePageChange(current.page - 1)}
                  disabled={current.page === 1}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {current.page} of {current.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(current.page + 1)}
                  disabled={current.page === current.totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )
      }

    </div >
  );
}
