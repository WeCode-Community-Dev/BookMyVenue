import clsx from "clsx";

export const addVenueCardStyle = {
    link: clsx("block"),
    card: clsx(
        "h-[360px]",
        "rounded-2xl",
        "border",
        "border-slate-200",
        "bg-white",
        "p-5",
        "shadow-sm",
        "hover:shadow-md",
        "transition-shadow",
        "cursor-pointer"
    ),
    innerContainer: clsx(
        "flex",
        "h-full",
        "flex-col",
        "items-center",
        "justify-center",
        "rounded-xl",
        "border",
        "border-dashed",
        "border-slate-300",
        "px-6",
        "text-center"
    ),
    plusIconWrapper: clsx(
        "mb-6",
        "flex",
        "h-16",
        "w-16",
        "items-center",
        "justify-center",
        "rounded-full",
        "border-2",
        "border-teal-600"
    ),
    plusIcon: clsx(
        "h-8",
        "w-8",
        "text-teal-600"
    ),
    title: clsx(
        "mb-3",
        "text-[16px]",
        "font-semibold",
        "text-slate-900"
    ),
    description: clsx(
        "max-w-[220px]",
        "text-sm",
        "leading-6",
        "text-slate-500"
    )
};
