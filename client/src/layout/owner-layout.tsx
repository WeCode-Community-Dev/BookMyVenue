import { Outlet } from "react-router-dom";
import { AppShell } from "@/components/app-shell";

const OwnerLayout = () => {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};

export default OwnerLayout;
