import clsx from "clsx";

export const bookingsListStyle = {
    pageWrapper: clsx(
        "min-h-screen",
        "bg-[#F8FAFC]",
        "py-8",
        "px-4",
        "sm:px-6",
        "lg:px-8"
    ),
    container: clsx(
        "mx-auto",
        "max-w-4xl",
        "space-y-6"
    ),
    header: clsx("space-y-1"),
    title: clsx(
        "text-2xl",
        "font-bold",
        "text-slate-900"
    ),
    subtitle: clsx(
        "text-sm",
        "text-slate-500"
    ),
    cardList: clsx("space-y-4"),
    card: clsx(
        "rounded-2xl",
        "border",
        "border-slate-200",
        "bg-white",
        "p-6",
        "shadow-sm",
        "transition-all",
        "hover:shadow-md"
    ),
    cardHeader: clsx(
        "flex",
        "flex-col",
        "gap-4",
        "sm:flex-row",
        "sm:items-start",
        "sm:justify-between"
    ),
    venueInfo: clsx(
        "flex",
        "items-start",
        "gap-4"
    ),
    imageWrapper: clsx(
        "h-16",
        "w-20",
        "shrink-0",
        "overflow-hidden",
        "rounded-xl",
        "border",
        "border-slate-100"
    ),
    image: clsx(
        "h-full",
        "w-full",
        "object-cover"
    ),
    venueDetails: clsx("space-y-1"),
    venueName: clsx(
        "font-bold",
        "text-slate-900",
        "hover:text-teal-700",
        "transition-colors"
    ),
    venueAddress: clsx(
        "flex",
        "items-center",
        "gap-1",
        "text-xs",
        "text-slate-400"
    ),
    statusBadge: clsx(
        "inline-flex",
        "items-center",
        "gap-1",
        "rounded-full",
        "px-2.5",
        "py-1",
        "text-xs",
        "font-semibold"
    ),
    statusConfirmed: clsx(
        "bg-emerald-50",
        "text-emerald-700"
    ),
    statusPending: clsx(
        "bg-amber-50",
        "text-amber-700"
    ),
    statusCancelled: clsx(
        "bg-red-50",
        "text-red-700"
    ),
    statusExpired: clsx(
        "bg-slate-100",
        "text-slate-600"
    ),
    divider: clsx(
        "my-4",
        "border-t",
        "border-slate-100"
    ),
    slotsSection: clsx("space-y-2"),
    slotsTitle: clsx(
        "text-[11px]",
        "font-bold",
        "uppercase",
        "tracking-wider",
        "text-slate-400"
    ),
    slotsGrid: clsx("grid", "grid-cols-1", "gap-2.5", "sm:grid-cols-2"),
    slotItem: clsx(
        "flex",
        "items-center",
        "gap-3",
        "rounded-xl",
        "bg-slate-50",
        "p-3",
        "border",
        "border-slate-100/50"
    ),
    slotDateBlock: clsx(
        "flex",
        "h-10",
        "w-10",
        "shrink-0",
        "flex-col",
        "items-center",
        "justify-center",
        "rounded-lg",
        "bg-[#EAF8F6]"
    ),
    slotDay: clsx(
        "text-base",
        "font-bold",
        "leading-none",
        "text-[#0F8C84]"
    ),
    slotMonth: clsx(
        "text-[8px]",
        "font-bold",
        "tracking-wide",
        "text-[#0F8C84]"
    ),
    slotMeta: clsx("min-w-0"),
    slotTitle: clsx(
        "truncate",
        "text-xs",
        "font-semibold",
        "text-slate-800"
    ),
    slotTime: clsx(
        "mt-0.5",
        "text-[10px]",
        "text-slate-400"
    ),
    cardFooter: clsx(
        "mt-5",
        "flex",
        "items-center",
        "justify-between",
        "border-t",
        "border-slate-100",
        "pt-4"
    ),
    totalLabel: clsx(
        "text-xs",
        "text-slate-400"
    ),
    totalVal: clsx(
        "text-lg",
        "font-bold",
        "text-slate-800"
    ),
    cancellationRow: clsx(
        "flex",
        "items-center",
        "gap-2",
        "text-xs",
        "text-slate-500"
    ),
    cancelBtn: clsx(
        "text-xs",
        "font-semibold",
        "text-red-500",
        "hover:text-red-600",
        "cursor-pointer"
    ),
    loadingWrapper: clsx(
        "min-h-screen",
        "bg-[#F8FAFC]",
        "flex",
        "items-center",
        "justify-center"
    ),
    loadingContainer: clsx(
        "text-center",
        "space-y-4"
    ),
    spinner: clsx(
        "mx-auto",
        "h-10",
        "w-10",
        "border-4",
        "border-teal-600",
        "border-t-transparent",
        "rounded-full",
        "animate-spin"
    ),
    loadingText: clsx(
        "text-sm",
        "text-slate-600"
    ),
    emptyWrapper: clsx(
        "text-center",
        "py-16",
        "px-4",
        "rounded-2xl",
        "border-2",
        "border-dashed",
        "border-slate-200",
        "bg-white"
    ),
    emptyTitle: clsx(
        "text-lg",
        "font-bold",
        "text-slate-900"
    ),
    emptyText: clsx(
        "mt-1",
        "text-sm",
        "text-slate-500"
    ),
    exploreBtn: clsx(
        "mt-5",
        "inline-flex",
        "items-center",
        "justify-center",
        "rounded-xl",
        "bg-teal-700",
        "px-4",
        "py-2",
        "text-sm",
        "font-semibold",
        "text-white",
        "shadow-sm",
        "hover:bg-teal-800",
        "cursor-pointer"
    ),
    errorAlert: clsx(
        "flex",
        "items-center",
        "justify-between",
        "rounded-xl",
        "bg-red-50",
        "p-4",
        "text-sm",
        "text-red-700",
        "border",
        "border-red-100"
    ),
    retryBtn: clsx(
        "flex",
        "items-center",
        "gap-1",
        "font-semibold",
        "text-red-800",
        "hover:text-red-900",
        "cursor-pointer"
    )
};
