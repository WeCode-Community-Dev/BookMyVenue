import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUp, ArrowDown } from "lucide-react";
import { getAdminVenues, getAdminVenuesCount } from "../../services/admin.service.js";

const PAGE_LIMIT = 10;

// The two review queues. `key` is the ?activeTab= URL value; `status` is the API
// status it maps to. Order matters: the first tab is the default.
const TABS = [
  { key: "new", label: "New Venues", status: "PENDING", emptyText: "No venues waiting for approval." },
  { key: "edits", label: "Venue Edits", status: "CHANGES_PENDING", emptyText: "No venue edits waiting for approval." },
];

const DEFAULT_TAB = TABS[0].key;

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

export function AdminVenueApprovals() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active tab and sort direction live in the URL (?activeTab=&sortOrder=), so a
  // refresh or a back-navigation from a detail page restores the same queue AND
  // sort. Both fall back to their defaults.
  const urlTab = searchParams.get("activeTab");
  const activeTab = TABS.some((t) => t.key === urlTab) ? urlTab : DEFAULT_TAB;
  const urlSort = searchParams.get("sortOrder");
  const sortOrder = urlSort === "asc" || urlSort === "desc" ? urlSort : "desc";

  const [tabState, setTabState] = useState(initTabState);

  function setTab(key, patch) {
    setTabState((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  // Populate both tab count badges up front, independent of which tab's rows are
  // loaded, so the counts show on initial render (like the venue owner table).
  async function fetchCounts() {
    const results = await Promise.allSettled(
      TABS.map((t) => getAdminVenuesCount({ status: t.status }))
    );
    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        setTab(TABS[i].key, { total: result.value });
      }
    });
  }

  async function fetchTab(tabKey, page = 1, order = sortOrder) {
    const tab = TABS.find((t) => t.key === tabKey);
    setTab(tabKey, { loading: true, error: "" });
    try {
      const res = await getAdminVenues({ status: tab.status, sortOrder: order, page, limit: PAGE_LIMIT });
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

  // On mount: load the active tab's rows and both tabs' count badges.
  useEffect(() => {
    fetchCounts();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTab(activeTab, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleTabChange(key) {
    if (key === activeTab) return;
    // Preserve the current sort when switching tabs.
    setSearchParams({ activeTab: key, sortOrder });
    fetchTab(key, 1);
  }

  function handlePageChange(page) {
    fetchTab(activeTab, page);
  }

  // Flip sort direction (persisted in the URL) and refetch the active tab in the
  // new order. The other tab picks up the order when it's next opened (it always
  // refetches on switch).
  function toggleSort() {
    const next = sortOrder === "desc" ? "asc" : "desc";
    setSearchParams({ activeTab, sortOrder: next });
    fetchTab(activeTab, 1, next);
  }

  const current = tabState[activeTab];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Venue Approvals</h1>
        <p className="mt-2 text-gray-500">Review and approve submitted venues.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition -mb-px ${
              activeTab === tab.key
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs text-gray-400">({tabState[tab.key].total})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6 flex justify-end">
        <input
          type="text"
          placeholder="Search venues..."
          className="w-80 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-red-500"
        />
      </div>

      {current.loading && (
        <p className="py-10 text-center text-sm text-gray-400">Loading venues...</p>
      )}
      {!current.loading && current.error && (
        <p className="py-10 text-center text-sm text-red-500">{current.error}</p>
      )}

      {!current.loading && !current.error && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-6 py-4">Venue Name</th>
                <th className="px-6 py-4">Venue Owner</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">
                  <button
                    onClick={toggleSort}
                    className="flex items-center gap-1 font-medium text-gray-600 hover:text-gray-900"
                  >
                    Submitted On
                    {sortOrder === "desc" ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                  </button>
                </th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {current.venues.map((venue) => (
                <tr key={venue._id} className="border-t border-gray-100">
                  <td className="px-6 py-4 font-medium text-gray-900">{venue.name}</td>
                  <td className="px-6 py-4 text-gray-600">{venue.venueOwner?.name || "—"}</td>
                  <td className="px-6 py-4 text-gray-600">{venue.city || venue.district || "—"}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(venue.updatedAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => navigate(`/admin/venues/${venue._id}`)}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}

              {current.venues.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    {TABS.find((t) => t.key === activeTab).emptyText}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {current.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 border-t border-gray-100 py-4">
              <button
                onClick={() => handlePageChange(current.page - 1)}
                disabled={current.page === 1}
                className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {current.page} of {current.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(current.page + 1)}
                disabled={current.page === current.totalPages}
                className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
