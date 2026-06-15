import clsx from "clsx";

export const profileDropdownStyle = {
    wrapper: clsx(
        "absolute",
        "right-0",
        "top-[60px]",
        "z-50",
        "w-[280px]",
        "overflow-hidden",
        "rounded-2xl",
        "border",
        "border-dropdown-border",
        "bg-dropdown-bg",
        "text-dropdown-text",
        "shadow-xl",
    ),

    userInfo: clsx(
        "bg-gradient-to-r",
        "from-teal-600",
        "to-teal-500",
        "p-4",
        "text-white",
    ),

    userInfoContainer: clsx(
        "flex",
        "items-center",
        "gap-3",
    ),

    avatar: clsx(
        "h-12",
        "w-12",
        "rounded-full",
        "border-2",
        "border-white",
        "object-cover",
    ),

    userName: clsx(
        "font-semibold",
    ),

    userRole: clsx(
        "text-sm",
        "text-teal-50",
    ),

    menuContainer: clsx(
        "py-2",
    ),

    menuItem: clsx(
        "flex",
        "w-full",
        "items-center",
        "gap-3",
        "px-4",
        "py-3",
        "text-sm",
        "text-dropdown-item-text",
        "transition",
        "hover:bg-dropdown-item-hover-bg",
        "cursor-pointer",
    ),

    menuItemIcon: clsx(
        "h-5",
        "w-5",
        "text-dropdown-icon",
    ),

    divider: clsx(
        "mx-3",
        "h-px",
        "bg-dropdown-divider",
    ),

    supportContainer: clsx(
        "py-2",
    ),

    logoutContainer: clsx(
        "py-2",
    ),

    logoutItem: clsx(
        "flex",
        "w-full",
        "items-center",
        "gap-3",
        "px-4",
        "py-3",
        "text-sm",
        "text-dropdown-logout-text",
        "transition",
        "hover:bg-dropdown-logout-hover-bg",
        "cursor-pointer",
    ),

    logoutIcon: clsx(
        "h-5",
        "w-5",
    ),
};
