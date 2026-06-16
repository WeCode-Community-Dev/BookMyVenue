import clsx from "clsx";

export const loginStyle = {
    dialogContent: clsx(
        "max-w-md",
        "rounded-3xl",
        "border-0",
        "p-0",
        "overflow-hidden",
        "bg-dialog-bg-color",
        "text-primary-text-color"
    ),

    loginStep: clsx("p-8"),

    otpStep: clsx("p-8"),

    successStep: clsx("p-10", "text-center"),

    iconContainer: clsx(
        "flex",
        "h-20",
        "w-20",
        "items-center",
        "justify-center",
        "rounded-full",
        "bg-teal-50",
        "dark:bg-teal-950/30"
    ),

    successIconContainer: clsx(
        "flex",
        "h-24",
        "w-24",
        "items-center",
        "justify-center",
        "rounded-full",
        "bg-teal-50",
        "dark:bg-teal-950/30"
    ),

    icon: clsx(
        "h-10",
        "w-10",
        "text-teal-600",
        "dark:text-teal-400"
    ),

    successIcon: clsx(
        "h-12",
        "w-12",
        "text-teal-600",
        "dark:text-teal-400"
    ),

    title: clsx(
        "mt-6",
        "text-center",
        "text-3xl",
        "font-bold",
        "text-primary-text-color"
    ),

    otpTitle: clsx(
        "mt-5",
        "text-center",
        "text-3xl",
        "font-bold",
        "text-primary-text-color"
    ),

    successTitle: clsx(
        "mt-6",
        "text-3xl",
        "font-bold",
        "text-primary-text-color"
    ),

    subtitle: clsx(
        "mt-2",
        "text-center",
        "text-sm",
        "text-tertiary-text-color"
    ),

    successSubtitle: clsx(
        "mt-2",
        "text-tertiary-text-color"
    ),

    googleButton: clsx(
        "mt-6",
        "flex",
        "h-12",
        "w-full",
        "items-center",
        "justify-center",
        "gap-3",
        "rounded-xl",
        "border",
        "border-login-btn-border",
        "bg-login-btn-bg",
        "text-primary-text-color",
        "font-medium",
        "transition",
        "hover:bg-muted/50"
    ),

    googleIcon: clsx("h-5", "w-5"),

    separatorWrapper: clsx(
        "my-6",
        "flex",
        "items-center",
        "gap-4"
    ),

    separatorLine: clsx(
        "h-px",
        "flex-1",
        "bg-sign-separator-color"
    ),

    separatorText: clsx(
        "text-sm",
        "text-tertiary-text-color"
    ),

    formPrompt: clsx(
        "mb-3",
        "text-center",
        "text-sm",
        "text-tertiary-text-color"
    ),

    inputWrapper: clsx("relative"),

    inputIcon: clsx(
        "absolute",
        "left-4",
        "top-1/2",
        "h-5",
        "w-5",
        "-translate-y-1/2",
        "text-tertiary-text-color"
    ),

    inputField: clsx(
        "h-14",
        "w-full",
        "rounded-xl",
        "border",
        "border-login-btn-border",
        "bg-textfield-bg-color",
        "pl-12",
        "pr-4",
        "text-primary-text-color",
        "outline-none",
        "placeholder:text-tertiary-text-color/60",
        "focus:border-teal-600"
    ),

    primaryButton: clsx(
        "mt-4",
        "h-14",
        "w-full",
        "rounded-xl",
        "bg-teal-600",
        "font-semibold",
        "text-white",
        "transition",
        "hover:bg-teal-700",
        "dark:bg-teal-600",
        "dark:hover:bg-teal-500"
    ),

    otpButton: clsx(
        "mt-8",
        "h-14",
        "w-full",
        "rounded-xl",
        "bg-teal-600",
        "font-semibold",
        "text-white",
        "transition",
        "hover:bg-teal-700",
        "dark:bg-teal-600",
        "dark:hover:bg-teal-500"
    ),

    disclaimer: clsx(
        "mt-4",
        "text-center",
        "text-xs",
        "text-tertiary-text-color"
    ),

    resendOtp: clsx(
        "mt-4",
        "text-center",
        "text-sm",
        "text-teal-600",
        "dark:text-teal-400",
        "hover:underline",
        "cursor-pointer"
    ),

    backButton: clsx(
        "mb-4",
        "text-primary-text-color",
        "hover:text-teal-600",
        "transition"
    ),

    otpInputsContainer: clsx(
        "mt-8",
        "flex",
        "justify-center",
        "gap-3"
    ),

    otpInputItem: clsx(
        "h-12",
        "w-12",
        "rounded-xl",
        "border",
        "border-login-btn-border",
        "bg-textfield-bg-color",
        "text-primary-text-color",
        "text-center",
        "text-lg",
        "font-semibold",
        "outline-none",
        "focus:border-teal-600"
    ),

    progressBarContainer: clsx(
        "mt-8",
        "h-2",
        "overflow-hidden",
        "rounded-full",
        "bg-secondary-button-bg-color"
    ),

    progressBarFill: clsx(
        "h-full",
        "w-full",
        "animate-pulse",
        "bg-teal-600"
    ),

    redirectText: clsx(
        "mt-4",
        "text-sm",
        "text-tertiary-text-color"
    )
};
