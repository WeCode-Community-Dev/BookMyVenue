import clsx from "clsx";

export const cardStyle = {
    card: clsx(
        "group/card",
        "flex",
        "flex-col",
        "gap-4",
        "overflow-hidden",
        "rounded-xl",
        "bg-card",
        "py-4",
        "text-sm",
        "text-card-foreground",
        "ring-1",
        "ring-foreground/10",
        "has-data-[slot=card-footer]:pb-0",
        "has-[>img:first-child]:pt-0",
        "data-[size=sm]:gap-3",
        "data-[size=sm]:py-3",
        "data-[size=sm]:has-data-[slot=card-footer]:pb-0",
        "*:[img:first-child]:rounded-t-xl",
        "*:[img:last-child]:rounded-b-xl",
    ),

    header: clsx(
        "group/card-header",
        "@container/card-header",
        "grid",
        "auto-rows-min",
        "items-start",
        "gap-1",
        "rounded-t-xl",
        "px-4",
        "group-data-[size=sm]/card:px-3",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        "has-data-[slot=card-description]:grid-rows-[auto_auto]",
        "[.border-b]:pb-4",
        "group-data-[size=sm]/card:[.border-b]:pb-3",
    ),

    title: clsx(
        "font-heading",
        "text-base",
        "leading-snug",
        "font-medium",
        "group-data-[size=sm]/card:text-sm",
    ),

    description: clsx("text-sm", "text-muted-foreground"),

    action: clsx(
        "col-start-2",
        "row-span-2",
        "row-start-1",
        "self-start",
        "justify-self-end",
    ),

    content: clsx("px-4", "group-data-[size=sm]/card:px-3"),

    footer: clsx(
        "flex",
        "items-center",
        "rounded-b-xl",
        "border-t",
        "bg-muted/50",
        "p-4",
        "group-data-[size=sm]/card:p-3",
    ),
};
