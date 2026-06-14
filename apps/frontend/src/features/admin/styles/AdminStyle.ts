import clsx from "clsx";

export const adminStyle = {
    pageWrapper: clsx(
        "space-y-6",
        "p-4",
        "md:p-6",
        "xl:p-8",
    ),

    headerTitle: clsx(
        "text-3xl",
        "font-bold",
        "text-slate-900",
    ),

    headerSubtitle: clsx(
        "mt-2",
        "text-slate-500",
    ),

    statsGrid: clsx(
        "grid",
        "gap-6",
        "sm:grid-cols-2",
        "xl:grid-cols-4",
    ),

    approvalsSection: clsx(
        "rounded-2xl",
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
        "gap-4",
        "md:flex-row",
        "md:items-center",
        "md:justify-between",
    ),

    sectionHeaderTitleWrapper: clsx(
        "flex",
        "items-center",
        "gap-3",
    ),

    sectionTitle: clsx(
        "text-2xl",
        "font-semibold",
        "text-slate-900",
    ),

    badge: clsx(
        "rounded-full",
        "bg-orange-100",
        "px-2.5",
        "py-1",
        "text-xs",
        "font-semibold",
        "text-orange-700",
    ),

    sectionSubtitle: clsx(
        "mt-1",
        "text-sm",
        "text-slate-500",
    ),

    refreshBtn: clsx(
        "flex",
        "items-center",
        "gap-2",
        "rounded-lg",
        "border",
        "border-slate-200",
        "px-4",
        "py-2",
        "text-sm",
        "font-medium",
        "text-teal-600",
        "hover:bg-slate-50",
    ),

    approvalsGrid: clsx(
        "grid",
        "gap-6",
        "md:grid-cols-2",
        "xl:grid-cols-4",
    ),
};
