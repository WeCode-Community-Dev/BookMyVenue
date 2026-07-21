import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUserAsync } from "../modules/auth/authSlice";

function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">BookMyVenue</h1>
          <p className="text-sm text-slate-400">
            {user?.name ? `Welcome, ${user.name}` : "Welcome back"}
          </p>
        </div>
        <button
          onClick={() => dispatch(logoutUserAsync())}
          className="text-sm text-slate-500 hover:text-rose-600"
        >
          Logout
        </button>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/order-history"
            className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md hover:border-blue-100 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M4 11h16M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="font-semibold text-slate-800">Order History</h2>
            <p className="text-sm text-slate-400 mt-1">View all your bookings and payments</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
