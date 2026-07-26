import clsx from "clsx";

export const bookingPageStyle = {
    pageWrapper: clsx(
        "min-h-screen",
        "bg-[#F8FAFC]",
        "flex",
        "items-center",
        "justify-center"
    ),
    container: clsx(
        "text-center",
        "space-y-4"
    ),
    spinner: clsx(
        "h-10",
        "w-10",
        "border-4",
        "border-teal-600",
        "border-t-transparent",
        "rounded-full",
        "animate-spin",
        "mx-auto"
    ),
    text: clsx(
        "text-slate-500",
        "font-medium"
    )
};

export const bookingLayoutStyle = {
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
        "h-10",
        "w-10",
        "border-4",
        "border-teal-600",
        "border-t-transparent",
        "rounded-full",
        "animate-spin",
        "mx-auto"
    ),
    loadingText: clsx(
        "text-slate-500",
        "font-medium"
    ),
    errorWrapper: clsx(
        "min-h-screen",
        "bg-[#F8FAFC]",
        "flex",
        "items-center",
        "justify-center"
    ),
    errorCard: clsx(
        "max-w-md",
        "p-6",
        "rounded-2xl",
        "bg-white",
        "border",
        "border-slate-200",
        "text-center",
        "shadow-sm"
    ),
    errorTitle: clsx(
        "text-red-500",
        "font-semibold",
        "mb-2"
    ),
    errorText: clsx(
        "text-slate-600",
        "text-sm",
        "mb-4"
    ),
    goBackButton: clsx(
        "px-4",
        "py-2",
        "bg-teal-700",
        "hover:bg-teal-800",
        "text-white",
        "rounded-xl",
        "text-sm",
        "font-semibold",
        "transition-colors",
        "cursor-pointer"
    ),
    pageWrapper: clsx(
        "min-h-screen",
        "bg-[#F8FAFC]"
    ),
    contentContainer: clsx(
        "mx-auto",
        "w-full",
        "max-w-[1480px]",
        "px-6",
        "pb-10"
    ),
    layoutGrid: clsx(
        "mt-6",
        "flex",
        "w-full",
        "max-w-full",
        "items-start",
        "gap-6"
    ),
    leftSection: clsx(
        "flex-1",
        "min-w-0",
        "max-w-full",
        "overflow-hidden",
        "space-y-6"
    ),
    rightSection: clsx(
        "w-[360px]",
        "shrink-0",
        "space-y-6"
    )
};
