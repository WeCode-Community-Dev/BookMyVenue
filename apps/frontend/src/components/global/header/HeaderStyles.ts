import clsx from "clsx";

export const headerStyle = {
    headerWrapper: clsx(
        "sticky",
        "top-0",
        "z-40",
        "h-[72px]",
        "border-b",
        "border-border",
        "bg-background",
        "text-foreground",
    ),

    container: clsx(
        "grid",
        "h-full",
        "grid-cols-[1fr_auto]",
        "items-center",
        "px-4",
        "md:px-6",
        "lg:grid-cols-[1fr_auto_1fr]",
    ),

    leftSection: clsx("flex", "items-center", "gap-3"),

    menuBtn: clsx(
        "rounded-lg",
        "p-2",
        "text-muted-foreground",
        "transition",
        "hover:bg-muted",
        "lg:hidden",
    ),

    divider: clsx("hidden", "h-6", "w-px", "bg-border", "md:block"),

    logoContainer: clsx(
        "relative",
        "h-10",
        "w-[140px]",
        "sm:w-[170px]",
        "md:h-12",
        "md:w-[200px]",
        "lg:w-[220px]",
    ),

    navBar: clsx("hidden", "items-center", "justify-center", "gap-10", "lg:flex"),

    navBtnActive: clsx(
        "relative",
        "text-[12px]",
        "font-semibold",
        "text-foreground",
    ),

    activeIndicator: clsx(
        "absolute",
        "-bottom-[26px]",
        "left-0",
        "h-[3px]",
        "w-full",
        "rounded-full",
        "bg-teal-700",
    ),

    navBtn: clsx(
        "text-[12px]",
        "font-semibold",
        "text-muted-foreground",
        "transition",
        "hover:text-foreground",
    ),

    navBtnRelative: clsx(
        "relative",
        "text-[12px]",
        "font-semibold",
        "text-muted-foreground",
        "transition",
        "hover:text-foreground",
    ),

    offersBadge: clsx(
        "absolute",
        "-right-4",
        "-top-2",
        "flex",
        "h-5",
        "min-w-[20px]",
        "items-center",
        "justify-center",
        "rounded-full",
        "px-1",
        "text-[10px]",
        "font-bold",
        "text-white",
    ),

    rightSection: clsx(
        "flex",
        "items-center",
        "justify-end",
        "gap-2",
        "md:gap-4",
    ),

    notificationBtn: clsx(
        "relative",
        "rounded-lg",
        "p-2",
        "transition",
        "hover:bg-muted",
    ),

    notificationBadge: clsx(
        "absolute",
        "right-1",
        "top-1",
        "hidden",
        "h-4",
        "w-4",
        "items-center",
        "justify-center",
        "rounded-full",
        "text-[9px]",
        "font-bold",
        "text-white",
        "sm:flex",
    ),

    profileContainer: clsx("relative"),

    profileBtn: clsx(
        "h-11",
        "cursor-pointer",
        "flex",
        "items-center",
        "gap-2",
        "rounded-full",
        "border",
        "border-border",
        "px-3",
        "py-1",
        "transition",
        "hover:bg-muted",
    ),

    avatar: clsx(
        "h-8",
        "w-8",
        "rounded-full",
        "object-cover",
        "md:h-9",
        "md:w-9",
    ),

    chevron: clsx(
        "hidden",
        "h-4",
        "w-4",
        "text-muted-foreground",
        "transition-transform",
        "duration-200",
        "sm:block",
    ),

    mobileDrawerOverlayWrapper: clsx("fixed", "inset-0", "z-50", "lg:hidden"),

    mobileDrawerBackdrop: clsx(
        "absolute",
        "inset-0",
        "bg-black/40",
        "transition-opacity",
    ),

    mobileDrawerPanel: clsx(
        "absolute",
        "left-0",
        "top-0",
        "h-full",
        "w-[280px]",
        "bg-background",
        "shadow-xl",
        "transition-transform",
        "duration-300",
    ),

    mobileDrawerHeader: clsx(
        "flex",
        "items-center",
        "justify-between",
        "border-b",
        "border-border",
        "p-4",
    ),

    mobileDrawerTitle: clsx("font-semibold", "text-foreground"),

    mobileDrawerCloseBtn: clsx("rounded-lg", "p-2", "hover:bg-muted"),

    mobileDrawerMenu: clsx("flex", "flex-col", "p-4", "items-start"),

    mobileDrawerMenuItem: clsx(
        "rounded-lg",
        "px-3",
        "py-3",
        "text-left",
        "font-medium",
        "text-foreground/80",
        "hover:bg-muted",
    ),

    mobileDrawerDivider: clsx("my-3", "border-border"),
};
