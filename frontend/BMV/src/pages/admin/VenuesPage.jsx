import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../../modules/admin/services/adminService";
import {
  AdminPageHeader,
  AdminTable,
  LinkButton,
  StatusBadge,
} from "../../components/admin/AdminCard";

function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const loadVenues = () => {
    setLoading(true);
    adminService
      .getVenues()
      .then(setVenues)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVenues();
  }, []);

  const handleBlock = async (id) => {
    if (!window.confirm("Block this venue?")) return;
    setActionId(id);
    try {
      await adminService.blockVenue(id);
      loadVenues();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleUnblock = async (id) => {
    setActionId(id);
    try {
      await adminService.unblockVenue(id);
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
        title="All Venues"
        subtitle={`${venues.length} venues on the platform`}
        action={<LinkButton to="/admin/venues/new">+ Create venue</LinkButton>}
      />
      {error && <p className="text-rose-600 mb-4 text-sm">{error}</p>}

      {venues.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-16 bg-white rounded-2xl border border-slate-100">
          No venues yet.
        </p>
      ) : (
        <AdminTable columns={["Name", "Location", "Owner", "Status", "Active", "Price/Day", "Actions"]}>
          {venues.map((v) => (
            <tr key={v.id} className="hover:bg-slate-50/50">
              <td className="px-4 py-3 font-medium">{v.name}</td>
              <td className="px-4 py-3">{v.location}</td>
              <td className="px-4 py-3">{v.owner_name || "-"}</td>
              <td className="px-4 py-3">
                <StatusBadge status={v.approval_status} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={v.is_active ? "active" : "inactive"} />
              </td>
              <td className="px-4 py-3">₹{v.price_per_day}</td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <Link to={`/admin/venues/${v.id}/edit`} className="text-blue-600 hover:underline text-xs font-medium">
                    Edit
                  </Link>
                  {v.is_active ? (
                    <button
                      onClick={() => handleBlock(v.id)}
                      disabled={actionId === v.id}
                      className="text-rose-600 hover:underline text-xs font-medium"
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnblock(v.id)}
                      disabled={actionId === v.id}
                      className="text-emerald-600 hover:underline text-xs font-medium"
                    >
                      Unblock
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}

export default VenuesPage;
