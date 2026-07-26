import clsx from "clsx";

export const packageCardStyle = {
    cardBase: clsx(
        "w-[330px]",
        "shrink-0",
        "rounded-2xl",
        "border",
        "bg-white",
        "shadow-sm",
        "transition-all"
    ),
    cardSelected: clsx(
        "border-[#0F8C84]",
        "ring-1",
        "ring-[#0F8C84]"
    ),
    cardUnselected: clsx(
        "border-slate-200"
    ),
    cardDisabled: clsx(
        "opacity-40",
        "cursor-not-allowed",
        "select-none"
    ),
    cardEnabled: clsx(
        "cursor-pointer"
    ),
    contentWrapper: clsx("p-4"),
    headerRow: clsx(
        "flex",
        "items-start",
        "justify-between"
    ),
    dateBadge: clsx(
        "rounded-full",
        "bg-teal-50",
        "px-3",
        "py-1",
        "text-xs",
        "font-semibold",
        "text-[#0F8C84]"
    ),
    iconContainer: clsx(
        "flex",
        "h-12",
        "w-12",
        "items-center",
        "justify-center",
        "rounded-full",
        "bg-orange-50"
    ),
    titleText: clsx(
        "mt-4",
        "text-lg",
        "font-bold",
        "text-slate-900"
    ),
    timeText: clsx(
        "mt-1",
        "text-sm",
        "text-slate-500"
    ),
    guestsRow: clsx(
        "mt-2",
        "flex",
        "items-center",
        "gap-2",
        "text-sm",
        "text-slate-500"
    ),
    guestsIcon: clsx(
        "h-4",
        "w-4"
    ),
    footerRow: clsx(
        "mt-5",
        "flex",
        "items-center",
        "justify-between"
    ),
    priceText: clsx(
        "text-[28px]",
        "font-bold",
        "text-slate-900"
    ),
    availableBadge: clsx(
        "rounded-full",
        "bg-emerald-50",
        "px-3",
        "py-1",
        "text-xs",
        "font-semibold",
        "text-emerald-700"
    ),
    btnSelected: clsx(
        "flex",
        "h-12",
        "w-full",
        "items-center",
        "justify-center",
        "rounded-b-2xl",
        "bg-[#0F8C84]",
        "text-white",
        "font-semibold",
        "cursor-pointer"
    ),
    btnUnselected: clsx(
        "h-12",
        "w-full",
        "rounded-b-2xl",
        "border-t",
        "border-slate-200",
        "font-semibold",
        "hover:bg-slate-50",
        "cursor-pointer"
    ),
    btnDisabled: clsx(
        "text-slate-400",
        "bg-slate-50",
        "cursor-not-allowed"
    )
};
