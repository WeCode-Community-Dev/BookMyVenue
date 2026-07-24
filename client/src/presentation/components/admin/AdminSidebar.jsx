import { LogOut } from "lucide-react";
import { ADMIN_MENU } from "@/constants/adminMenu";
import SidebarItem from "./SidebarItem";
import logo from "@/assets/images/logo.jpeg"

const AdminSidebar = () => {

    return (

        <aside className="w-70 min-h-screen bg-slate-900 text-white flex flex-col">

            {/* Logo */}

 <div className="p-6 border-b border-slate-700">
    <div className="flex items-center gap-3">

        <img
            src={logo}
            alt="Book My Venue"
            className="h-16 w-16 rounded-full object-cover"
        />

        <div>
            <h1 className="text-xl font-bold text-[#FE9A00] leading-tight">
                Book My Venue
            </h1>

            <p className="text-sm text-gray-400 mt-1">
                ADMIN PANEL
            </p>
        </div>

    </div>
</div>

            {/* Navigation */}

            <nav className="flex-1 p-4 space-y-2">

                {ADMIN_MENU.map((menu) => (

                    <SidebarItem

                        key={menu.path}

                        menu={menu}

                    />

                ))}

            </nav>

            {/* Logout */}

            <div className="p-4 border-t border-slate-700">

                <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-amber-600 hover:text-white transition-all">

                    <LogOut size={20} />

                    Logout

                </button>

            </div>

        </aside>

    );

};

export default AdminSidebar;