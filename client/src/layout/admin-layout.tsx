import { Outlet } from "react-router-dom";
import { AppShell } from "@/components/app-shell";

const AdminLayout = () => {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};

export default AdminLayout;
