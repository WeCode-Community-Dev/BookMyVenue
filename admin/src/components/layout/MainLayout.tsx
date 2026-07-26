import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { ModalRoot } from "@/components/common/ModalRoot";

export function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 bg-[#18181b] overflow-y-auto p-4">
        <div className="bg-content-card-bg rounded-tl-3xl rounded-xl shadow-lg min-h-full p-8 ">
          <Outlet />
        </div>
      </main>
      <ModalRoot />
    </div>
  );
}
