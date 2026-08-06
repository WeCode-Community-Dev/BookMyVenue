import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminNavbar";

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="ml-64 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}