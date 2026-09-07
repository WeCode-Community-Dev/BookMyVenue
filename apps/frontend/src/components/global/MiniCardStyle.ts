import clsx from "clsx";

export const miniCardStyle = {
    card: clsx(
        "overflow-hidden",
        "rounded-[8px]",
        "border",
        "border-slate-200",
        "bg-white",
        "shadow-sm"
    ),
    imageWrapper: clsx(
        "relative",
        "h-44",
        "w-full"
    ),
    image: clsx("object-cover"),
    statusBadgeBase: clsx(
        "absolute",
        "right-3",
        "top-3",
        "rounded-full",
        "px-3",
        "py-1",
        "text-xs",
        "font-medium",
        "border"
    ),
    statusApproved: clsx(
        "bg-green-100",
        "text-green-700",
        "border-green-200"
    ),
    statusPending: clsx(
        "bg-amber-100",
        "text-amber-700",
        "border-amber-200"
    ),
    statusRejected: clsx(
        "bg-red-100",
        "text-red-700",
        "border-red-200"
    ),
    statusDefault: clsx(
        "bg-slate-100",
        "text-slate-700",
        "border-slate-200"
    ),
    content: clsx("p-4"),
    titleWrapper: clsx(
        "mb-2",
        "flex",
        "items-start",
        "justify-between"
    ),
    title: clsx("text-lg font-semibold"),
    locationWrapper: clsx(
        "mb-4",
        "flex",
        "items-center",
        "gap-2",
        "text-sm",
        "text-slate-500"
    ),
    detailsWrapper: clsx(
        "mb-5",
        "flex",
        "items-center",
        "gap-6",
        "text-sm",
        "text-slate-600"
    ),
    detailItem: clsx(
        "flex",
        "items-center",
        "gap-2"
    ),
    buttonWrapper: clsx("flex gap-3"),
    editBtn: clsx(
        "flex-1",
        "text-[12px]",
        "rounded-lg",
        "border",
        "border-teal-600",
        "py-2",
        "font-medium",
        "text-teal-600"
    ),
    bookingsBtn: clsx(
        "flex-1",
        "text-[12px]",
        "rounded-lg",
        "bg-teal-600",
        "py-2",
        "font-medium",
        "text-white"
    )
};
