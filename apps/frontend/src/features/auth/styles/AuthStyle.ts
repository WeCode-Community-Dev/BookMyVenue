import clsx from "clsx";

export const authStyle = {
    pageWrapper: clsx(
        "min-h-screen",
        "bg-slate-50",
        "px-4",
        "py-6",
        "sm:px-6",
        "lg:px-8",
    ),

    container: clsx(
        "mx-auto",
        "grid",
        "max-w-[1400px]",
        "overflow-hidden",
        "rounded-3xl",
        "border",
        "border-slate-200",
        "bg-white",
        "shadow-sm",
        "lg:grid-cols-[1fr_1fr]",
        "xl:grid-cols-[1.15fr_0.85fr]",
    ),

    leftSection: clsx(
        "relative",
        "flex",
        "flex-col",
        "justify-between",
        "bg-gradient-to-br",
        "from-teal-50",
        "via-white",
        "to-white",
        "p-6",
        "md:p-8",
        "lg:p-10",
        "xl:p-12",
    ),

    /*TEXT STYLES*/

    headingClass: clsx(
        "max-w-xl",
        "text-3xl",
        "font-bold",
        "leading-tight",
        "text-slate-900",
        "sm:text-4xl",
        "lg:text-[42px]",
        "xl:text-5xl",
    ),

    descriptionClass: clsx(
        "mt-4",
        "max-w-md",
        "text-base",
        "text-slate-600",
        "lg:text-[17px]",
        "xl:text-lg",
    ),

    /* 
   FEATURE STYLES
 */

    featureGrid: clsx("mt-8", "grid", "grid-cols-1", "gap-6", "sm:grid-cols-3"),

    featureCard: clsx("text-center"),

    featureIconWrapper: clsx(
        "mx-auto",
        "mb-3",
        "flex",
        "h-14",
        "w-14",
        "items-center",
        "justify-center",
        "rounded-full",
        "bg-teal-100",
    ),

    featureIcon: clsx("h-7", "w-7", "text-teal-700"),

    featureTitle: clsx("font-semibold", "text-slate-900"),

    featureText: clsx("mt-1", "text-sm", "text-slate-500"),

    /*  RIGHT SIDE STYLES*/

    rightSection: clsx(
        "flex",
        "items-center",
        "justify-center",
        "p-6",
        "md:p-8",
        "lg:p-10",
        "xl:p-12",
    ),

    formWrapper: clsx("w-full", "max-w-md", "xl:max-w-lg"),

    headerWrapper: clsx("mb-8", "text-center"),

    avatarWrapper: clsx(
        "mx-auto",
        "mb-4",
        "flex",
        "h-16",
        "w-16",
        "items-center",
        "justify-center",
        "rounded-full",
        "bg-teal-50",
        "sm:h-20",
        "sm:w-20",
    ),

    avatar: clsx(
        "h-8",
        "w-8",
        "rounded-full",
        "border-2",
        "border-teal-600",
        "sm:h-10",
        "sm:w-10",
    ),

    title: clsx("text-3xl", "font-bold", "text-slate-900", "sm:text-4xl"),

    subtitle: clsx("mt-2", "text-sm", "text-slate-500", "sm:text-base"),

    form: clsx("space-y-4"),

    input: clsx(
        "h-12",
        "w-full",
        "rounded-xl",
        "border",
        "border-slate-200",
        "px-4",
        "text-sm",
        "outline-none",
        "transition",
        "focus:border-teal-600",
        "focus:ring-2",
        "focus:ring-teal-100",
        "sm:h-14",
    ),

    buttonPrimary: clsx(
        "h-12",
        "w-full",
        "rounded-xl",
        "bg-teal-600",
        "font-semibold",
        "text-white",
        "transition",
        "hover:bg-teal-700",
        "sm:h-14",
        "cursor-pointer",
    ),

    divider: clsx("my-6", "flex", "items-center", "gap-4"),

    dividerLine: clsx("h-px", "flex-1", "bg-slate-200"),

    dividerText: clsx("text-sm", "text-slate-500"),

    googleButton: clsx(
        "h-12",
        "w-full",
        "rounded-xl",
        "border",
        "border-slate-200",
        "bg-white",
        "font-medium",
        "transition",
        "hover:bg-slate-50",
        "sm:h-14",
        "cursor-pointer",
    ),

    loginText: clsx("mt-6", "text-center", "text-sm", "text-slate-500"),

    loginButton: clsx(
        "ml-1",
        "font-semibold",
        "text-teal-600",
        "hover:text-teal-700",
        "cursor-pointer",
    ),
    trustGrid: clsx("mt-8", "grid", "grid-cols-3", "gap-2", "sm:gap-4"),
    trustItem: clsx("text-center"),
    trustIcon: clsx("mx-auto", "mb-2", "h-6", "w-6", "text-teal-600"),
    trustText: clsx("text-xs", "text-slate-500"),
};
