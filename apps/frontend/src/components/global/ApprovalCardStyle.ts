import clsx from "clsx";

export const approvalCardStyle = {
    card: clsx(
        "overflow-hidden",
        "rounded-2xl",
        "border",
        "border-slate-200",
        "bg-white",
        "shadow-sm",
        "transition",
        "hover:shadow-md"
    ),
    imageWrapper: clsx("relative", "h-48", "w-full"),
    image: clsx("object-cover"),
    statusBadge: clsx(
        "absolute",
        "right-3",
        "top-3",
        "rounded-full",
        "bg-orange-100",
        "px-3",
        "py-1",
        "text-xs",
        "font-semibold",
        "text-orange-700"
    ),
    content: clsx("p-4"),
    title: clsx("text-lg", "font-semibold", "text-slate-900"),
    locationWrapper: clsx(
        "mt-2",
        "flex",
        "items-center",
        "gap-2",
        "text-sm",
        "text-slate-500"
    ),
    icon: clsx("h-4", "w-4"),
    infoWrapper: clsx("mt-4", "space-y-3"),
    infoRow: clsx(
        "flex",
        "items-center",
        "justify-between",
        "text-sm"
    ),
    infoLabelWrapper: clsx(
        "flex",
        "items-center",
        "gap-2",
        "text-slate-500"
    ),
    infoValue: clsx("font-medium", "text-slate-800"),
    actionsWrapper: clsx(
        "mt-5",
        "grid",
        "grid-cols-2",
        "gap-3"
    ),
    rejectBtn: clsx(
        "rounded-lg",
        "border",
        "border-red-600",
        "py-2",
        "text-sm",
        "font-medium",
        "text-red-600",
        "transition",
        "hover:bg-red-50"
    ),
    approveBtn: clsx(
        "rounded-lg",
        "bg-teal-600",
        "py-2",
        "text-sm",
        "font-medium",
        "text-white",
        "transition",
        "hover:bg-teal-700"
    )
};
