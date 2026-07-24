import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getAdminUserById, activateAdminUser, deactivateAdminUser, } from "../../services/adminService";
import { useAuth } from "../../context/AuthContext";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminDetailRow from "../../components/admin/AdminDetailRow";
import ConfirmModal from "../../components/common/ConfirmModal";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import StatusBadge from "../../components/profile/StatusBadge";
import { formatRoleLabel } from "../../utils/adminFormat";

const AdminUserDetail = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminUserById(id);

      if (data.success) {
        setUserData(data.data);
      } else {
        setUserData(null);
        setError(data.message || "User not found.");
      }
    } catch (err) {
      setUserData(null);
      setError(
        err.response?.data?.message ||
        "Unable to load user. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!confirmAction || !userData?.user) return;

    try {
      setActionLoading(true);
      const data =
        confirmAction === "activate"
          ? await activateAdminUser(id)
          : await deactivateAdminUser(id);

      if (data.success) {
        toast.success(data.message || "User status updated.");
        setConfirmAction(null);
        fetchUser();
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

  const user = userData?.user;
  const isSelf =
    currentUser?._id === user?._id || currentUser?.id === user?._id;

  return (
    <>
      <div className="mb-4">
        <Link
          to="/admin/users"
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          ← Back to users
        </Link>
      </div>

      {loading && <Loader label="Loading user..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={fetchUser} />
      )}

      {!loading && !error && user && (
        <>
          <AdminPageHeader
            title={user.name}
            description={user.email}
          >
            {user.isActive ? (
              <button
                type="button"
                disabled={isSelf || actionLoading}
                onClick={() => setConfirmAction("deactivate")}
                className="inline-flex min-h-9 items-center rounded-lg border border-red-200 bg-red-50/50 px-4 text-sm font-medium text-red-800 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Deactivate
              </button>
            ) : (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setConfirmAction("activate")}
                className="inline-flex min-h-9 items-center rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 text-sm font-medium text-emerald-800 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Activate
              </button>
            )}
          </AdminPageHeader>

          <div className="grid gap-5 lg:grid-cols-2">
            <section className="rounded-xl border border-gray-200/80 bg-white p-5 ring-1 ring-gray-100/80">
              <h2 className="text-base font-semibold text-gray-900">Profile</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <AdminDetailRow label="Phone" value={user.phone || "—"} />
                <AdminDetailRow label="City" value={user.city || "—"} />
                <AdminDetailRow label="State" value={user.state || "—"} />
                <AdminDetailRow
                  label="Email verified"
                  value={user.isEmailVerified ? "Yes" : "No"}
                />
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-gray-500">Status</dt>
                  <dd>
                    <StatusBadge
                      label={user.isActive ? "Active" : "Inactive"}
                      tone={user.isActive ? "success" : "danger"}
                    />
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Roles</dt>
                  <dd className="mt-1 flex flex-wrap gap-2">
                    {(user.roles ?? []).map((role) => (
                      <span
                        key={role}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${role === "admin"
                            ? "bg-violet-50 text-violet-700"
                            : role === "provider"
                              ? "bg-red-50 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {formatRoleLabel(role)}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-xl border border-gray-200/80 bg-white p-5 ring-1 ring-gray-100/80">
              <h2 className="text-base font-semibold text-gray-900">
                Activity summary
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <AdminDetailRow
                  label="Bookings"
                  value={userData.bookingCount ?? 0}
                />
                <AdminDetailRow
                  label="Venues owned"
                  value={userData.venueCount ?? 0}
                />
              </dl>
            </section>
          </div>
        </>
      )}

      <ConfirmModal
        open={Boolean(confirmAction)}
        title={
          confirmAction === "activate" ? "Activate user" : "Deactivate user"
        }
        message={
          user
            ? `Are you sure you want to ${confirmAction} ${user.name}?`
            : ""
        }
        confirmLabel={confirmAction === "activate" ? "Activate" : "Deactivate"}
        isLoading={actionLoading}
        onConfirm={handleToggleStatus}
        onCancel={() => setConfirmAction(null)}
      />
    </>
  );
};

export default AdminUserDetail;
