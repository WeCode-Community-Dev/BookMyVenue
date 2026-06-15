import clsx from "clsx";

export const cardStyle = {
    cardWrapper: clsx(
        "w-full",
        "max-w-[340px]",
        "overflow-hidden",
        "rounded-2xl",
        "border",
        "border-border",
        "bg-card",
        "text-foreground",
        "shadow-sm",
        "transition-all",
        "duration-300",
        "hover:-translate-y-1",
        "hover:shadow-lg"
    ),

    imageWrapper: clsx("relative"),

    image: clsx(
        "h-[220px]",
        "w-full",
        "object-cover"
    ),

    availabilityBadge: clsx(
        "absolute",
        "left-3",
        "top-3",
        "rounded-lg",
        "bg-teal-700",
        "px-3",
        "py-1.5",
        "text-[11px]",
        "font-semibold",
        "text-white",
        "shadow"
    ),

    wishlistBtn: clsx(
        "absolute",
        "right-3",
        "top-3",
        "rounded-full",
        "bg-black/20",
        "p-2",
        "backdrop-blur-sm",
        "transition",
        "hover:bg-black/30"
    ),

    contentWrapper: clsx("p-4"),

    headerRow: clsx(
        "flex",
        "items-start",
        "justify-between",
        "gap-3"
    ),

    titleContainer: clsx("min-w-0", "flex-1"),

    title: clsx(
        "truncate",
        "text-lg",
        "font-semibold",
        "text-foreground"
    ),

    ratingContainer: clsx(
        "flex",
        "shrink-0",
        "items-center",
        "gap-1"
    ),

    ratingIcon: clsx(
        "h-4",
        "w-4",
        "fill-teal-600",
        "text-teal-600"
    ),

    ratingText: clsx(
        "text-sm",
        "font-semibold",
        "text-foreground"
    ),

    reviewsCount: clsx(
        "text-xs",
        "text-muted-foreground"
    ),

    locationRow: clsx(
        "mt-2",
        "flex",
        "items-center",
        "gap-1",
        "text-sm",
        "text-muted-foreground"
    ),

    locationIcon: clsx("h-4", "w-4"),

    verifiedBadge: clsx(
        "mt-3",
        "flex",
        "items-center",
        "gap-1.5"
    ),

    verifiedIcon: clsx(
        "h-4",
        "w-4",
        "text-teal-700"
    ),

    verifiedText: clsx(
        "text-xs",
        "font-semibold",
        "text-teal-700"
    ),

    amenitiesContainer: clsx(
        "mt-4",
        "flex",
        "flex-wrap",
        "items-center",
        "gap-3",
        "border-y",
        "border-border",
        "py-3"
    ),

    amenityItem: clsx(
        "flex",
        "items-center",
        "gap-1.5",
        "text-xs",
        "text-muted-foreground"
    ),

    amenityIcon: clsx("h-4", "w-4"),

    moreAmenitiesText: clsx(
        "text-xs",
        "text-muted-foreground"
    ),

    footerRow: clsx(
        "mt-4",
        "flex",
        "items-end",
        "justify-between",
        "gap-3"
    ),

    priceContainer: clsx(
        "flex",
        "items-end",
        "gap-1"
    ),

    priceText: clsx(
        "text-2xl",
        "font-bold",
        "text-teal-700"
    ),

    priceUnit: clsx(
        "pb-0.5",
        "text-xs",
        "text-muted-foreground"
    ),

    detailsBtn: clsx(
        "rounded-lg",
        "border",
        "border-red-300",
        "dark:border-red-900/50",
        "px-4",
        "py-2",
        "text-xs",
        "font-semibold",
        "text-red-500",
        "transition",
        "hover:bg-red-50",
        "dark:hover:bg-red-950/20"
    )
};
