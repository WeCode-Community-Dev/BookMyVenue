import { Outlet } from "react-router-dom";
import Navbar from "../../components/user/Navbar.jsx";

// Shared chrome for all user-facing routes: the navbar plus the routed page.
export function UserLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
}
