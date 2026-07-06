import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserAsync } from "../../modules/auth/authSlice";
import {
  IconBookings,
  IconDashboard,
  IconLogout,
  IconPending,
  IconUsers,
  IconVenue,
} from "./AdminIcons";

const links = [
  { to: "/admin", label: "Dashboard", end: true, Icon: IconDashboard },
  { to: "/admin/pending", label: "Pending", Icon: IconPending },
  { to: "/admin/venues", label: "Venues", Icon: IconVenue },
  { to: "/admin/bookings", label: "Bookings", Icon: IconBookings },
  { to: "/admin/users", label: "Users", Icon: IconUsers },
];

function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUserAsync());
    navigate("/admin/login");
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex bg-[#f0f2f5]">
      <aside className="w-[72px] bg-white border-r border-slate-100 flex flex-col items-center py-5 gap-2 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold mb-4">
          BMV
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {links.map(({ to, label, end, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={label}
              className={({ isActive }) =>
                `w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                }`
              }
            >
              <Icon />
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          title="Logout"
          className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
        >
          <IconLogout />
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 backdrop-blur border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Superadmin</p>
            <p className="text-sm font-medium text-slate-700">{user?.name || user?.email}</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2 text-sm text-slate-600">
            <span className="text-blue-600 font-medium">{today}</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
