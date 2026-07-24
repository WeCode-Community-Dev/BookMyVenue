import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getAdminUsers, activateAdminUser, deactivateAdminUser, } from "../../services/adminService";
import { useAuth } from "../../context/AuthContext";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminSearchInput from "../../components/admin/AdminSearchInput";
import AdminFilterSelect from "../../components/admin/AdminFilterSelect";
import AdminTable from "../../components/admin/AdminTable";
import AdminPagination from "../../components/admin/AdminPagination";
import ConfirmModal from "../../components/common/ConfirmModal";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import StatusBadge from "../../components/profile/StatusBadge";
import { formatRoles } from "../../utils/adminFormat";

const ROLE_OPTIONS = [
  { value: "", label: "All roles" },
  { value: "customer", label: "Customer" },
  { value: "provider", label: "Provider" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminUsers({
        page,
        limit,
        search: debouncedSearch,
        role,
        isActive,
      });

      if (data.success) {
        setUsers(data.data ?? []);
        setCount(data.count ?? 0);
      } else {
        setUsers([]);
        setCount(0);
        setError(data.message || "Failed to load users.");
      }
    } catch (err) {
      setUsers([]);
      setCount(0);
      setError(
        err.response?.data?.message ||
        "Unable to load users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, role, isActive]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async () => {
    if (!confirmAction) return;

    try {
      setActionLoading(true);
      const { user, action } = confirmAction;
      const data =
        action === "activate"
          ? await activateAdminUser(user._id)
          : await deactivateAdminUser(user._id);

      if (data.success) {
        toast.success(data.message || "User status updated.");
        setConfirmAction(null);
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to update user.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Unable to update user. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Users"
        description="Manage marketplace users and account status."
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <AdminSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search name, email, or phone"
          className="lg:flex-1"
        />
        <div className="flex flex-wrap gap-3">
          <AdminFilterSelect
            label="Role"
            value={role}
            onChange={(value) => {
              setRole(value);
              setPage(1);
            }}
            options={ROLE_OPTIONS}
          />
          <AdminFilterSelect
            label="Status"
            value={isActive}
            onChange={(value) => {
              setIsActive(value);
              setPage(1);
            }}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>

      {loading && <Loader label="Loading users..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={fetchUsers} />
      )}

      {!loading && !error && users.length === 0 && (
        <EmptyState
          title="No users found"
          description="Try adjusting your search or filters."
        />
      )}

      {!loading && !error && users.length > 0 && (
        <AdminTable>
          <div className="hidden border-b border-gray-100 bg-gray-50/80 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500 md:grid md:grid-cols-[1.2fr_1fr_1fr_auto_auto] md:gap-3">
            <span>Name</span>
            <span>Email</span>
            <span>Roles</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-gray-100">
            {users.map((user) => {
              const isSelf =
                currentUser?._id === user._id ||
                currentUser?.id === user._id;

              return (
                <div
                  key={user._id}
                  className="flex flex-col gap-3 px-4 py-3 md:grid md:grid-cols-[1.2fr_1fr_1fr_auto_auto] md:items-center md:gap-3"
                >
                  <div>
                    <Link
                      to={`/admin/users/${user._id}`}
                      className="text-sm font-medium text-gray-900 hover:text-red-600"
                    >
                      {user.name}
                    </Link>
                    <p className="text-xs text-gray-500 md:hidden">
                      {user.email}
                    </p>
                  </div>
                  <p className="hidden truncate text-sm text-gray-600 md:block">
                    {user.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatRoles(user.roles)}
                  </p>
                  <StatusBadge
                    label={user.isActive ? "Active" : "Inactive"}
                    tone={user.isActive ? "success" : "danger"}
                  />
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <Link
                      to={`/admin/users/${user._id}`}
                      className="inline-flex min-h-8 items-center rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      View
                    </Link>
                    {user.isActive ? (
                      <button
                        type="button"
                        disabled={isSelf || actionLoading}
                        onClick={() =>
                          setConfirmAction({ user, action: "deactivate" })
                        }
                        className="inline-flex min-h-8 items-center rounded-lg border border-red-200 bg-red-50/50 px-3 text-xs font-medium text-red-800 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() =>
                          setConfirmAction({ user, action: "activate" })
                        }
                        className="inline-flex min-h-8 items-center rounded-lg border border-emerald-200 bg-emerald-50/50 px-3 text-xs font-medium text-emerald-800 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <AdminPagination
            page={page}
            limit={limit}
            count={count}
            onPageChange={setPage}
          />
        </AdminTable>
      )}

      <ConfirmModal
        open={Boolean(confirmAction)}
        title={
          confirmAction?.action === "activate"
            ? "Activate user"
            : "Deactivate user"
        }
        message={
          confirmAction
            ? `Are you sure you want to ${confirmAction.action} ${confirmAction.user.name}?`
            : ""
        }
        confirmLabel={
          confirmAction?.action === "activate" ? "Activate" : "Deactivate"
        }
        isLoading={actionLoading}
        onConfirm={handleToggleStatus}
        onCancel={() => setConfirmAction(null)}
      />
    </>
  );
};

export default AdminUsers;
