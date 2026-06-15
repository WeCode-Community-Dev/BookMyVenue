import clsx from "clsx";

export const dialogStyle = {
    overlay: clsx(
        "fixed",
        "inset-0",
        "isolate",
        "z-50",
        "bg-black/10",
        "duration-100",
        "supports-backdrop-filter:backdrop-blur-xs",
        "data-open:animate-in",
        "data-open:fade-in-0",
        "data-closed:animate-out",
        "data-closed:fade-out-0",
    ),

    content: clsx(
        "fixed",
        "top-1/2",
        "left-1/2",
        "z-50",
        "grid",
        "w-full",
        "max-w-[calc(100%-2rem)]",
        "-translate-x-1/2",
        "-translate-y-1/2",
        "gap-4",
        "rounded-xl",
        "bg-popover",
        "p-4",
        "text-sm",
        "text-popover-foreground",
        "ring-1",
        "ring-foreground/10",
        "duration-100",
        "outline-none",
        "sm:max-w-sm",
        "data-open:animate-in",
        "data-open:fade-in-0",
        "data-open:zoom-in-95",
        "data-closed:animate-out",
        "data-closed:fade-out-0",
        "data-closed:zoom-out-95",
    ),

    closeButton: clsx("absolute", "top-2", "right-2"),

    header: clsx("flex", "flex-col", "gap-2"),

    footer: clsx(
        "-mx-4",
        "-mb-4",
        "flex",
        "flex-col-reverse",
        "gap-2",
        "rounded-b-xl",
        "border-t",
        "bg-muted/50",
        "p-4",
        "sm:flex-row",
        "sm:justify-end",
    ),

    title: clsx("font-heading", "text-base", "leading-none", "font-medium"),

    description: clsx(
        "text-sm",
        "text-muted-foreground",
        "*:[a]:underline",
        "*:[a]:underline-offset-3",
        "*:[a]:hover:text-foreground",
    ),
};
