import clsx from "clsx";

export const bookingPackagesStyle = {
    card: clsx(
        "rounded-2xl",
        "border",
        "border-slate-200",
        "bg-white",
        "p-6",
        "shadow-sm",
        "w-full",
        "max-w-full",
        "overflow-hidden"
    ),
    header: clsx(
        "mb-6",
        "flex",
        "items-center",
        "justify-between"
    ),
    title: clsx(
        "text-xl",
        "font-bold"
    ),
    subtitle: clsx(
        "mt-1",
        "text-sm",
        "text-slate-500"
    ),
    emptyText: clsx(
        "text-center",
        "py-8",
        "text-sm",
        "text-slate-500"
    ),
    howBtn: clsx(
        "text-sm",
        "font-semibold",
        "text-[#0F8C84]",
        "cursor-pointer"
    ),
    packagesList: clsx(
        "flex",
        "w-full",
        "max-w-full",
        "overflow-x-auto",
        "gap-5",
        "pb-2",
        "scrollbar-thin"
    )
};
