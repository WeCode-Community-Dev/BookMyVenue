import { NavLink } from "react-router-dom";

const SidebarItem = ({ menu }) => {

    const Icon = menu.icon;

    return (

        <NavLink

            to={menu.path}

            className={({ isActive }) =>

                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200

                ${

                    isActive

                        ? "bg-orange-500 text-white"

                        : "text-gray-300 hover:bg-gray-800 hover:text-white"

                }`

            }

        >

            <Icon size={20} />

            <span>{menu.title}</span>

        </NavLink>

    );

};

export default SidebarItem;