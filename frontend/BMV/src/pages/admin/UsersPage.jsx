import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../../modules/admin/services/adminService";
import {
  AdminPageHeader,
  AdminTable,
  LinkButton,
  StatusBadge,
} from "../../components/admin/AdminCard";

const ROLE_FILTERS = [
  { key: "", label: "All" },
  { key: "user", label: "Users" },
  { key: "host", label: "Owners / Hosts" },
];

const STATUS_FILTERS = [
  { key: "", label: "Any status" },
  { key: "true", label: "Active" },
  { key: "false", label: "Inactive" },
];

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadUsers = () => {
    setLoading(true);
    const params = { limit: 100 };
    if (roleFilter) params.role = roleFilter;
    if (statusFilter !== "") params.is_active = statusFilter === "true";
    adminService
      .getUsers(params)
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter, statusFilter]);

  const handleDeactivate = async (user) => {
    if (!window.confirm(`Deactivate ${user.email}?`)) return;
    setActionId(user.id);
    try {
      await adminService.deactivateUser(user.id);
      loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleActivate = async (user) => {
    setActionId(user.id);
    try {
      await adminService.activateUser(user.id);
      loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  };

  const displayRole = (u) => {
    if (u.role === "owner" || u.role === "host" || u.is_venue_owner) return "Host";
    return u.role;
  };

  return (
    <div>
      <AdminPageHeader
        title="Users & Owners"
        subtitle="Create, edit, activate, and deactivate customer and host accounts"
        action={<LinkButton to="/admin/users/new">+ Create account</LinkButton>}
      />
      {error && <p className="text-rose-600 mb-4 text-sm">{error}</p>}

      <div className="flex flex-wrap gap-2 mb-4">
        {ROLE_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setRoleFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${
              roleFilter === f.key
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200 text-slate-600"
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="w-px bg-slate-200 mx-1" />
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setStatusFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${
              statusFilter === f.key
                ? "bg-slate-800 text-white"
                : "bg-white border border-slate-200 text-slate-600"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <AdminTable columns={["Name", "Email", "Phone", "Role", "Owner profile", "Status", "Actions"]}>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-slate-50/50">
              <td className="px-4 py-3 font-medium">{u.name || "-"}</td>
              <td className="px-4 py-3">{u.email}</td>
              <td className="px-4 py-3">{u.phone_number || "-"}</td>
              <td className="px-4 py-3 capitalize">{displayRole(u)}</td>
              <td className="px-4 py-3 text-xs text-slate-500">
                {u.is_venue_owner ? u.business_name || "Yes" : "—"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={u.is_active ? "active" : "inactive"} />
              </td>
              <td className="px-4 py-3">
                {u.role !== "admin" ? (
                  <div className="flex gap-3">
                    <Link
                      to={`/admin/users/${u.id}/edit`}
                      className="text-blue-600 hover:underline text-xs font-medium"
                    >
                      Edit
                    </Link>
                    {u.is_active ? (
                      <button
                        onClick={() => handleDeactivate(u)}
                        disabled={actionId === u.id}
                        className="text-rose-600 hover:underline text-xs font-medium"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(u)}
                        disabled={actionId === u.id}
                        className="text-emerald-600 hover:underline text-xs font-medium"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-300 text-xs">—</span>
                )}
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}

export default UsersPage;
