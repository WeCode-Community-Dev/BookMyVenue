import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUserAsync, updateProfileAsync } from "../modules/auth/authSlice";

function ProfilePage() {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone_number: "", password: "" });
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    dispatch(fetchCurrentUserAsync());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone_number: user.phone_number || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccess("");
    const payload = {
      name: form.name,
      phone_number: form.phone_number,
    };
    if (form.password) {
      payload.password = form.password;
    }
    const result = await dispatch(updateProfileAsync(payload));
    if (updateProfileAsync.fulfilled.match(result)) {
      setSuccess("Profile updated successfully.");
      setEditing(false);
      setForm((prev) => ({ ...prev, password: "" }));
    } else {
      setLocalError(result.payload || "Could not update profile");
    }
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">My Profile</h1>
        <p className="text-sm text-slate-400 mt-0.5">Account details and preferences</p>
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
                onClick={() => setEditing(true)}
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
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-500 mb-1">Email</label>
              <input
                value={user?.email || ""}
                disabled
                className="w-full border border-slate-100 rounded-xl px-4 py-2.5 text-sm bg-slate-50 text-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-500 mb-1">Phone</label>
              <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-500 mb-1">New password (optional)</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              />
            </div>
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
                onClick={() => setEditing(false)}
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
        <h2 className="font-semibold text-slate-800">My bookings</h2>
        <p className="text-sm text-slate-400 mt-1">View bookings, payments, and cancellations</p>
      </Link>
    </div>
  );
}

export default ProfilePage;
