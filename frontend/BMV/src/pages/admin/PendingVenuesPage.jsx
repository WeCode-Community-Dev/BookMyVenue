import { useEffect, useState } from "react";
import { adminService } from "../../modules/admin/services/adminService";
import { AdminCard, AdminPageHeader } from "../../components/admin/AdminCard";

function PendingVenuesPage() {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const loadVenues = () => {
    setLoading(true);
    adminService
      .getPendingVenues()
      .then(setVenues)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVenues();
  }, []);

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      await adminService.approveVenue(id);
      loadVenues();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Rejection reason (optional):") || "";
    setActionId(id);
    try {
      await adminService.rejectVenue(id, reason);
      loadVenues();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Pending Venues"
        subtitle={`${venues.length} awaiting review`}
      />
      {error && <p className="text-rose-600 mb-4 text-sm">{error}</p>}

      {venues.length === 0 ? (
        <AdminCard>
          <p className="text-slate-400 text-sm text-center py-8">No pending venues. All caught up!</p>
        </AdminCard>
      ) : (
        <div className="grid gap-4">
          {venues.map((v) => (
            <AdminCard key={v.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-800">{v.name}</h3>
                  <p className="text-sm text-slate-400 mt-0.5">{v.location}</p>
                  <div className="flex gap-4 mt-2 text-xs text-slate-500">
                    <span>Owner: {v.owner_name || "-"}</span>
                    <span>₹{v.price_per_day}/day</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(v.id)}
                    disabled={actionId === v.id}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(v.id)}
                    disabled={actionId === v.id}
                    className="px-4 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}

export default PendingVenuesPage;
