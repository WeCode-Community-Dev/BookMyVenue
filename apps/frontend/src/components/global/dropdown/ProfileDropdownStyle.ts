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
        "justify-between",
        "px-4",
        "py-3",
        "text-sm",
        "text-dropdown-item-text",
        "transition",
        "hover:bg-dropdown-item-hover-bg",
        "cursor-pointer",
    ),

    menuItemLeft: clsx(
        "flex",
        "items-center",
        "gap-3",
    ),

    menuItemRight: clsx(
        "flex",
        "items-center",
        "gap-1.5",
        "text-xs",
        "text-dropdown-icon",
    ),

    menuItemIcon: clsx(
        "h-5",
        "w-5",
        "text-dropdown-icon",
    ),

    languageChevron: clsx(
        "h-4",
        "w-4",
        "text-dropdown-icon",
        "transition-transform",
        "duration-200",
    ),

    languageSubmenu: clsx(
        "bg-slate-50/60",
        "dark:bg-slate-900/40",
        "py-1",
        "border-y",
        "border-dropdown-divider/60",
    ),

    languageSubItem: clsx(
        "flex",
        "w-full",
        "items-center",
        "justify-between",
        "pl-12",
        "pr-4",
        "py-2.5",
        "text-sm",
        "transition",
        "hover:bg-dropdown-item-hover-bg",
        "cursor-pointer",
    ),

    languageSubItemActive: clsx(
        "text-teal-600",
        "dark:text-teal-400",
        "font-medium",
        "bg-teal-50/50",
        "dark:bg-teal-950/20",
    ),

    languageSubItemInactive: clsx(
        "text-dropdown-item-text",
    ),

    languageCheckIcon: clsx(
        "h-4",
        "w-4",
        "text-teal-600",
        "dark:text-teal-400",
        "shrink-0",
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
