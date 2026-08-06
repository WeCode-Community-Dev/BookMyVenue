import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUserAsync, updateProfileAsync } from "../modules/auth/authSlice";

function ProfilePage() {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState("");

  const isGoogleOnly = Boolean(user && !user.has_password);
  const canChangeCredentials = Boolean(user?.has_password);

  useEffect(() => {
    dispatch(fetchCurrentUserAsync());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const cancelEdit = () => {
    setEditing(false);
    setLocalError("");
    setSuccess("");
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccess("");

    const emailChanged = form.email.trim().toLowerCase() !== (user?.email || "").toLowerCase();
    const passwordChanging = Boolean(form.new_password);

    if (isGoogleOnly && (emailChanged || passwordChanging)) {
      setLocalError("Email and password changes are not available for Google-only accounts.");
      return;
    }

    if (passwordChanging && form.new_password !== form.confirm_password) {
      setLocalError("New password and confirmation do not match.");
      return;
    }

    if ((emailChanged || passwordChanging) && !form.current_password) {
      setLocalError("Current password is required to change email or password.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      phone_number: form.phone_number.trim(),
    };

    if (emailChanged) {
      payload.email = form.email.trim();
      payload.current_password = form.current_password;
    }

    if (passwordChanging) {
      payload.new_password = form.new_password;
      payload.current_password = form.current_password;
    }

    const result = await dispatch(updateProfileAsync(payload));
    if (updateProfileAsync.fulfilled.match(result)) {
      setSuccess("Profile updated successfully.");
      setEditing(false);
      setForm((prev) => ({
        ...prev,
        current_password: "",
        new_password: "",
        confirm_password: "",
      }));
    } else {
      setLocalError(result.payload || "Could not update profile");
    }
  };

  const inputCls =
    "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30";
  const disabledCls =
    "w-full border border-slate-100 rounded-xl px-4 py-2.5 text-sm bg-slate-50 text-slate-400";

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">My Profile</h1>
        <p className="text-sm text-slate-400 mt-0.5">Manage your account details and bookings</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        {!user && isLoading ? (
          <div className="h-32 bg-slate-50 rounded-xl animate-pulse" />
        ) : !editing ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center text-xl font-bold">
                {(user?.name || user?.email || "?").charAt(0).toUpperCase()}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSuccess("");
                  setLocalError("");
                  setEditing(true);
                }}
                className="text-sm text-rose-800 hover:underline"
              >
                Edit profile
              </button>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-slate-400">Name</dt>
                <dd className="font-medium text-slate-800 mt-0.5">{user?.name || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Email</dt>
                <dd className="font-medium text-slate-800 mt-0.5">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Phone</dt>
                <dd className="font-medium text-slate-800 mt-0.5">{user?.phone_number || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Account type</dt>
                <dd className="font-medium text-slate-800 mt-0.5 capitalize">{user?.role}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Sign-in method</dt>
                <dd className="font-medium text-slate-800 mt-0.5 capitalize">
                  {user?.auth_provider || "email"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Member since</dt>
                <dd className="font-medium text-slate-800 mt-0.5">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-500 mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-500 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={!canChangeCredentials}
                className={!canChangeCredentials ? disabledCls : inputCls}
              />
              {!canChangeCredentials && (
                <p className="text-xs text-slate-400 mt-1">
                  Email cannot be changed for Google sign-in accounts.
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-slate-500 mb-1">Phone</label>
              <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            {canChangeCredentials && (
              <>
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    Change email or password
                  </p>
                  <p className="text-xs text-slate-400 mb-3">
                    Current password is required only when changing email or password.
                  </p>
                  <label className="block text-sm text-slate-500 mb-1">Current password</label>
                  <input
                    name="current_password"
                    type="password"
                    value={form.current_password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">New password</label>
                  <input
                    name="new_password"
                    type="password"
                    value={form.new_password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current"
                    minLength={8}
                    autoComplete="new-password"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Confirm new password</label>
                  <input
                    name="confirm_password"
                    type="password"
                    value={form.confirm_password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current"
                    minLength={8}
                    autoComplete="new-password"
                    className={inputCls}
                  />
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-rose-900 hover:bg-rose-950 text-white px-5 py-2 rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="text-sm text-slate-500 hover:text-slate-700 px-3"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {(localError || error) && (
          <p className="text-sm text-rose-600 bg-rose-50 px-3 py-2 rounded-xl mt-4">
            {localError || error}
          </p>
        )}
        {success && (
          <p className="text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl mt-4">{success}</p>
        )}
      </div>

      <Link
        to="/order-history"
        className="block bg-white rounded-2xl border border-slate-100 p-5 hover:border-rose-200 hover:shadow-sm transition-all max-w-3xl"
      >
        <h2 className="font-semibold text-slate-800">Order history</h2>
        <p className="text-sm text-slate-400 mt-1">
          View bookings, payments, cancellations, and leave reviews
        </p>
      </Link>
    </div>
  );
}

export default ProfilePage;
