import clsx from "clsx";

export const ownerStyle = {
    pageWrapper: clsx(
        "p-4",
        "md:p-6",
        "xl:p-8",
    ),
    welcomeSection: clsx(
        "mb-6",
        "xl:mb-8",
    ),
    welcomeHeading: clsx(
        "text-2xl",
        "font-bold",
        "text-slate-900",
        "sm:text-3xl",
        "xl:text-4xl",
    ),
    welcomeSubtitle: clsx(
        "mt-2",
        "text-sm",
        "text-slate-500",
        "sm:text-base",
    ),
    statsGrid: clsx(
        "grid",
        "grid-cols-1",
        "gap-4",
        "sm:grid-cols-2",
        "xl:grid-cols-4",
    ),
    mainLayout: clsx(
        "mt-8",
        "grid",
        "gap-6",
        "xl:grid-cols-[minmax(0,1fr)_300px]",
    ),
    leftSection: clsx(
        "rounded-2xl",
        "border",
        "border-slate-200",
        "bg-white",
        "p-4",
        "md:p-6",
    ),
    sectionHeaderWrapper: clsx(
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
        "md:text-2xl",
    ),
    viewAllButton: clsx(
        "text-sm",
        "font-medium",
        "text-teal-600",
        "hover:text-teal-700",
    ),
    venueCardsGrid: clsx(
        "grid",
        "gap-6",
        "[grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]",
    ),
    recentBookingsWrapper: clsx(
        "mt-8",
        "overflow-x-auto",
    ),
    rightSidebar: clsx(
        "space-y-6",
    ),
};
