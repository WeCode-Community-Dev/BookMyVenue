import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../../modules/admin/services/adminService";
import {
  AdminPageHeader,
  AdminTable,
  LinkButton,
  StatusBadge,
} from "../../components/admin/AdminCard";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const loadUsers = () => {
    setLoading(true);
    adminService
      .getUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (user) => {
    if (!window.confirm(`Deactivate ${user.email}?`)) return;
    setActionId(user.id);
    try {
      await adminService.deleteUser(user.id);
      loadUsers();
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
        title="Users"
        subtitle={`${users.length} registered accounts`}
        action={<LinkButton to="/admin/users/new">+ Create user</LinkButton>}
      />
      {error && <p className="text-rose-600 mb-4 text-sm">{error}</p>}

      <AdminTable columns={["Name", "Email", "Phone", "Role", "Status", "Actions"]}>
        {users.map((u) => (
          <tr key={u.id} className="hover:bg-slate-50/50">
            <td className="px-4 py-3 font-medium">{u.name || "-"}</td>
            <td className="px-4 py-3">{u.email}</td>
            <td className="px-4 py-3">{u.phone_number || "-"}</td>
            <td className="px-4 py-3 capitalize">{u.role}</td>
            <td className="px-4 py-3">
              <StatusBadge status={u.is_active ? "active" : "inactive"} />
            </td>
            <td className="px-4 py-3">
              {u.role !== "admin" ? (
                <div className="flex gap-3">
                  <Link to={`/admin/users/${u.id}/edit`} className="text-blue-600 hover:underline text-xs font-medium">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(u)}
                    disabled={actionId === u.id}
                    className="text-rose-600 hover:underline text-xs font-medium"
                  >
                    Deactivate
                  </button>
                </div>
              ) : (
                <span className="text-slate-300 text-xs">—</span>
              )}
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}

export default UsersPage;
