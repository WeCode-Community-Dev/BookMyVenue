import clsx from "clsx";

export const googleCallbackStyle = {
    pageWrapper: clsx(
        "flex",
        "min-h-screen",
        "items-center",
        "justify-center",
        "bg-gradient-to-br",
        "from-slate-900",
        "via-slate-800",
        "to-teal-950",
        "text-white",
    ),

    container: clsx(
        "text-center",
        "p-8",
        "rounded-2xl",
        "bg-white/5",
        "backdrop-blur-xl",
        "border",
        "border-white/10",
        "shadow-2xl",
        "max-w-md",
        "mx-auto",
    ),

    animationContainer: clsx(
        "relative",
        "flex",
        "items-center",
        "justify-center",
        "mb-6",
    ),

    pingBg: clsx(
        "absolute",
        "h-16",
        "w-16",
        "animate-ping",
        "rounded-full",
        "bg-teal-500",
        "opacity-20",
    ),

    pulseBg: clsx(
        "absolute",
        "h-12",
        "w-12",
        "animate-pulse",
        "rounded-full",
        "bg-teal-500",
        "opacity-40",
    ),

    spinner: clsx(
        "h-8",
        "w-8",
        "animate-spin",
        "rounded-full",
        "border-4",
        "border-teal-500",
        "border-t-transparent",
    ),

    title: clsx(
        "text-xl",
        "font-bold",
        "tracking-wide",
        "mb-2",
        "animate-pulse",
    ),

    subtitle: clsx(
        "text-sm",
        "text-slate-400",
    ),
};
