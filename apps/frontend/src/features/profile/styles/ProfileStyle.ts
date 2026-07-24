import clsx from "clsx";

export const profileStyle = {
    profileWrapper: clsx(
        "space-y-6",
        "p-4",
        "md:p-6",
        "xl:p-8",
    ),

    actionCardsGrid: clsx(
        "grid",
        "gap-6",
        "sm:grid-cols-2",
        "xl:grid-cols-3",
    ),

    sectionWrapper: clsx(
        "rounded-xl",
        "border",
        "border-slate-200",
        "bg-white",
        "p-5",
        "md:p-6",
    ),

    sectionHeader: clsx(
        "mb-6",
        "flex",
        "flex-col",
        "gap-3",
        "sm:flex-row",
        "sm:items-center",
        "sm:justify-between",
    ),

    sectionTitle: clsx(
        "text-xl",
        "font-semibold",
        "text-slate-900",
    ),

    sectionSubtitle: clsx(
        "mt-1",
        "text-sm",
        "text-slate-500",
    ),

    sectionLinkBtn: clsx(
        "text-sm",
        "font-medium",
        "text-teal-600",
        "hover:text-teal-700",
    ),

    statsGrid: clsx(
        "grid",
        "gap-4",
        "sm:grid-cols-2",
        "xl:grid-cols-4",
    ),

    savedVenuesGrid: clsx(
        "grid",
        "gap-5",
        "sm:grid-cols-2",
        "xl:grid-cols-4",
    ),

    dividerWrapper: clsx(
        "relative",
        "my-8",
        "flex",
        "items-center",
        "justify-center",
    ),

    dividerLine: clsx(
        "absolute",
        "left-0",
        "right-0",
        "h-px",
        "bg-gradient-to-r",
        "from-transparent",
        "via-teal-200",
        "to-transparent",
    ),

    dividerBadge: clsx(
        "relative",
        "z-10",
        "rounded-full",
        "bg-teal-600",
        "px-5",
        "py-2",
        "text-xs",
        "font-semibold",
        "text-white",
        "shadow-sm",
    ),

    mainColumnsGrid: clsx(
        "grid",
        "gap-6",
        "lg:grid-cols-2",
    ),

    statsColumnsGrid: clsx(
        "mt-6",
        "grid",
        "gap-6",
        "lg:grid-cols-2",
    ),
};
