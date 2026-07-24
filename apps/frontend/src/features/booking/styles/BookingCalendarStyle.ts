import clsx from "clsx";

export const bookingCalendarStyle = {
    card: clsx(
        "rounded-2xl",
        "border",
        "border-slate-200",
        "bg-white",
        "p-6",
        "shadow-sm"
    ),
    header: clsx(
        "flex",
        "items-start",
        "gap-3"
    ),
    iconWrapper: clsx(
        "rounded-lg",
        "bg-teal-50",
        "p-2"
    ),
    icon: clsx(
        "h-5",
        "w-5",
        "text-teal-700"
    ),
    title: clsx(
        "text-xl",
        "font-bold",
        "text-slate-900"
    ),
    subtitle: clsx(
        "mt-1",
        "text-sm",
        "text-slate-500"
    ),
    content: clsx(
        "mt-6",
        "flex",
        "items-start",
        "gap-8"
    ),
    calendarWrapper: clsx(
        "w-[340px]",
        "shrink-0",
        "rounded-xl",
        "border",
        "border-slate-200",
        "p-4"
    ),
    sidebar: clsx(
        "w-[320px]",
        "shrink-0"
    ),
    sidebarHeader: clsx(
        "flex",
        "items-center",
        "justify-between",
        "mb-4"
    ),
    sidebarTitle: clsx(
        "font-semibold",
        "text-slate-900"
    ),
    clearBtn: clsx(
        "text-sm",
        "font-medium",
        "text-red-500",
        "cursor-pointer"
    ),
    datesList: clsx("space-y-3"),
    dateItem: clsx(
        "flex",
        "items-center",
        "justify-between",
        "rounded-lg",
        "border",
        "border-slate-200",
        "px-4",
        "py-3"
    ),
    dateInfo: clsx(
        "flex",
        "items-center",
        "gap-3"
    ),
    dateIcon: clsx(
        "h-4",
        "w-4",
        "text-teal-700"
    ),
    dateText: clsx(
        "font-medium",
        "text-slate-700"
    ),
    removeBtn: clsx(
        "focus:outline-none",
        "cursor-pointer"
    ),
    removeIcon: clsx(
        "h-4",
        "w-4",
        "text-slate-500"
    ),
    addBtn: clsx(
        "mt-5",
        "flex",
        "h-12",
        "w-full",
        "items-center",
        "justify-center",
        "rounded-xl",
        "border",
        "border-dashed",
        "border-teal-400",
        "text-sm",
        "font-semibold",
        "text-teal-700",
        "cursor-pointer"
    )
};
