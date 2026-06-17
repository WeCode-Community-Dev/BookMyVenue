import clsx from "clsx";

export const sideBarStyle = {
    aside: clsx(
        "sticky",
        "top-[72px]",
        "hidden",
        "h-[calc(100vh-72px)]",
        "w-[240px]",
        "flex-col",
        "border-r",
        "border-sidebar-border",
        "bg-sidebar",
        "md:flex"
    ),
    scrollableContent: clsx(
        "flex-1",
        "overflow-y-auto",
        "px-3",
        "py-5"
    ),
    nav: clsx("space-y-1"),
    menuItemButton: clsx(
        "flex",
        "w-full",
        "items-center",
        "justify-start",
        "gap-4",
        "rounded-xl",
        "px-4",
        "py-4",
        "text-left",
        "transition"
    ),
    menuItemActive: clsx(
        "bg-sidebar-accent",
        "text-sidebar-accent-foreground"
    ),
    menuItemInactive: clsx(
        "text-sidebar-foreground",
        "hover:bg-sidebar-accent",
        "hover:text-sidebar-accent-foreground"
    ),
    menuItemIcon: clsx(
        "h-5",
        "w-5",
        "shrink-0"
    ),
    menuItemLabel: clsx(
        "text-[12px]",
        "font-medium"
    ),
    ctaCard: clsx(
        "mt-5",
        "overflow-hidden",
        "rounded-lg",
        "border",
        "border-border",
        "bg-card"
    ),
    ctaImageWrapper: clsx(
        "px-3",
        "pt-3"
    ),
    ctaImage: clsx(
        "mx-auto",
        "h-[140px]",
        "w-auto",
        "object-contain",
        "lg:h-[170px]"
    ),
    ctaContent: clsx("px-4"),
    ctaTitle: clsx(
        "text-sm",
        "font-semibold",
        "leading-tight",
        "text-sidebar-foreground"
    ),
    ctaDescription: clsx(
        "mt-2",
        "text-xs",
        "leading-relaxed",
        "text-muted-foreground"
    ),
    ctaButtonWrapper: clsx("p-4"),
    ctaButton: clsx(
        "w-full",
        "rounded-md",
        "bg-teal-700",
        "py-2",
        "text-xs",
        "font-medium",
        "text-white",
        "transition",
        "hover:bg-teal-800"
    ),
    footer: clsx(
        "border-t",
        "border-sidebar-border",
        "p-4"
    ),
    footerButton: clsx(
        "flex",
        "w-full",
        "items-center",
        "justify-center",
        "gap-2",
        "rounded-xl",
        "border",
        "border-sidebar-border",
        "px-4",
        "py-3",
        "text-sm",
        "font-medium",
        "text-sidebar-foreground",
        "transition",
        "hover:bg-sidebar-accent",
        "hover:text-sidebar-accent-foreground"
    ),
    footerButtonIcon: clsx(
        "h-4",
        "w-4"
    )
};
