import { useState } from "react";
import { ChevronDown, User, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/AuthSlice";
import { ROLES } from "@/constants/Roles";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

const AdminHeader = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = async () => {
        try {
            await dispatch(logout({role: ROLES.ADMIN})).unwrap()
            toast('Admin logged out successfully')
            navigate(ROUTES.ADMIN.LOGIN)
        } catch (error) {
            toast.error(error)
        }
    }

    return (

        <header className="h-20 bg-white border-b border-gray-400 flex items-center justify-end px-6 shadow-sm">

            <div className="relative">

                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >

                    <User size={25} />

                    <span className="font-medium">

                        Admin User

                    </span>

                    <ChevronDown size={25} />

                </button>

                {

                    showDropdown && (

                        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg">

                            <button
                                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600"
                                onClick={handleLogout}
                            >

                                <LogOut size={18} />

                                Logout

                            </button>

                        </div>

                    )

                }

            </div>

        </header>

    );

};

export default AdminHeader;