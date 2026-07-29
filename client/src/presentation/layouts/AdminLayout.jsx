import { Outlet } from "react-router-dom";
import AdminSidebar from "@/presentation/components/admin/AdminSidebar";
import AdminHeader from "@/presentation/components/admin/AdminHeader";

const AdminLayout = () => {

    return (

        <div className="flex min-h-screen bg-gray-100">

            {/* Sidebar */}

            <AdminSidebar />

            {/* Main Content */}

            <div className="flex-1 flex flex-col">

                <AdminHeader />

                <main className="flex-1 p-6">

                    <Outlet />

                </main>

            </div>

        </div>

    );

};

export default AdminLayout;