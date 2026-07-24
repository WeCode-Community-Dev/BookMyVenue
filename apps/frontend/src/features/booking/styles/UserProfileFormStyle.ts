import clsx from "clsx";

export const userProfileFormStyle = {
    card: clsx(
        "rounded-2xl",
        "border",
        "border-slate-200",
        "bg-white",
        "p-6",
        "shadow-sm",
        "transition-all",
        "duration-300"
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
    headerContent: clsx("flex-1"),
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
    verifiedBadge: clsx(
        "flex",
        "items-center",
        "gap-1",
        "rounded-full",
        "bg-teal-50",
        "px-3",
        "py-1",
        "text-xs",
        "font-semibold",
        "text-teal-700"
    ),
    content: clsx("mt-6"),
    summaryView: clsx(
        "rounded-xl",
        "border",
        "border-slate-100",
        "bg-slate-50",
        "p-4"
    ),
    summaryGrid: clsx(
        "grid",
        "grid-cols-1",
        "gap-4",
        "sm:grid-cols-3"
    ),
    summaryField: clsx("space-y-1"),
    summaryLabel: clsx(
        "text-[12px]",
        "font-semibold",
        "uppercase",
        "tracking-wider",
        "text-slate-400"
    ),
    summaryValue: clsx(
        "font-semibold",
        "text-slate-800"
    ),
    summaryFooter: clsx(
        "mt-4",
        "flex",
        "items-center",
        "justify-between",
        "border-t",
        "border-slate-200/60",
        "pt-3"
    ),
    passwordStatusText: clsx(
        "text-xs",
        "text-slate-500"
    ),
    editBtn: clsx(
        "text-sm",
        "font-semibold",
        "text-teal-700",
        "hover:text-teal-800",
        "cursor-pointer"
    ),
    form: clsx("space-y-4"),
    errorAlert: clsx(
        "flex",
        "items-center",
        "gap-2",
        "rounded-lg",
        "bg-red-50",
        "p-3",
        "text-sm",
        "text-red-700",
        "border",
        "border-red-100"
    ),
    successAlert: clsx(
        "flex",
        "items-center",
        "gap-2",
        "rounded-lg",
        "bg-teal-50",
        "p-3",
        "text-sm",
        "text-teal-700",
        "border",
        "border-teal-100"
    ),
    grid2: clsx(
        "grid",
        "grid-cols-1",
        "gap-4",
        "sm:grid-cols-2"
    ),
    formField: clsx("space-y-2"),
    label: clsx(
        "text-sm",
        "font-medium",
        "text-slate-700"
    ),
    relative: clsx("relative"),
    inputIconWrapper: clsx(
        "pointer-events-none",
        "absolute",
        "inset-y-0",
        "left-0",
        "flex",
        "items-center",
        "pl-3"
    ),
    inputIcon: clsx(
        "h-4",
        "w-4",
        "text-slate-400"
    ),
    inputDisabled: clsx(
        "w-full",
        "rounded-xl",
        "border",
        "border-slate-200",
        "bg-slate-50",
        "py-2.5",
        "pl-10",
        "pr-4",
        "text-sm",
        "text-slate-500",
        "cursor-not-allowed",
        "outline-none"
    ),
    input: clsx(
        "w-full",
        "rounded-xl",
        "border",
        "border-slate-200",
        "py-2.5",
        "pl-10",
        "pr-4",
        "text-sm",
        "text-slate-800",
        "outline-none",
        "transition-all",
        "focus:border-teal-500",
        "focus:ring-2",
        "focus:ring-teal-500/20"
    ),
    inputPassword: clsx(
        "w-full",
        "rounded-xl",
        "border",
        "border-slate-200",
        "py-2.5",
        "pl-10",
        "pr-10",
        "text-sm",
        "text-slate-800",
        "outline-none",
        "transition-all",
        "focus:border-teal-500",
        "focus:ring-2",
        "focus:ring-teal-500/20"
    ),
    hintText: clsx(
        "text-[11px]",
        "text-slate-400"
    ),
    passwordCard: clsx(
        "rounded-xl",
        "border",
        "border-slate-200",
        "bg-slate-50/50",
        "p-4",
        "space-y-4"
    ),
    warningBox: clsx(
        "text-xs",
        "font-semibold",
        "text-amber-700",
        "flex",
        "items-center",
        "gap-1.5",
        "bg-amber-50",
        "px-2.5",
        "py-1.5",
        "rounded-lg",
        "border",
        "border-amber-200/50"
    ),
    eyeBtn: clsx(
        "absolute",
        "inset-y-0",
        "right-0",
        "flex",
        "items-center",
        "pr-3",
        "text-slate-400",
        "hover:text-slate-600",
        "cursor-pointer"
    ),
    formFooter: clsx(
        "flex",
        "justify-end",
        "gap-3",
        "pt-2"
    ),
    cancelBtn: clsx(
        "rounded-xl",
        "border",
        "border-slate-200",
        "px-4",
        "py-2",
        "text-sm",
        "font-semibold",
        "text-slate-600",
        "hover:bg-slate-50",
        "cursor-pointer"
    ),
    saveBtn: clsx(
        "rounded-xl",
        "bg-teal-700",
        "px-5",
        "py-2",
        "text-sm",
        "font-semibold",
        "text-white",
        "shadow-sm",
        "hover:bg-teal-800",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-teal-500",
        "focus:ring-offset-2",
        "disabled:opacity-50",
        "cursor-pointer"
    )
};
