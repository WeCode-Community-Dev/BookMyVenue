import clsx from "clsx";

export const bookingVenueCardStyle = {
    skeletonCard: clsx(
        "animate-pulse",
        "rounded-2xl",
        "border",
        "border-slate-200",
        "bg-white",
        "p-4",
        "shadow-sm"
    ),
    skeletonFlex: clsx(
        "flex",
        "gap-6"
    ),
    skeletonImage: clsx(
        "h-[210px]",
        "w-[430px]",
        "rounded-xl",
        "bg-slate-200"
    ),
    skeletonContent: clsx(
        "flex-1",
        "space-y-4",
        "py-1"
    ),
    skeletonTitle: clsx(
        "h-6",
        "w-3/4",
        "rounded",
        "bg-slate-200"
    ),
    skeletonSub1: clsx(
        "h-4",
        "w-1/2",
        "rounded",
        "bg-slate-200"
    ),
    skeletonSub2: clsx(
        "h-4",
        "w-1/4",
        "rounded",
        "bg-slate-200"
    ),
    card: clsx(
        "rounded-2xl",
        "border",
        "border-slate-200",
        "bg-white",
        "p-4",
        "shadow-sm"
    ),
    cardFlex: clsx(
        "flex",
        "items-start",
        "gap-6"
    ),
    imageWrapper: clsx(
        "w-[430px]",
        "shrink-0",
        "overflow-hidden",
        "rounded-xl"
    ),
    image: clsx(
        "h-[210px]",
        "w-[430px]",
        "rounded-xl",
        "object-cover"
    ),
    contentFlex: clsx(
        "flex",
        "flex-1",
        "flex-col"
    ),
    title: clsx(
        "text-[20px]",
        "font-bold",
        "text-slate-900"
    ),
    ratingRow: clsx(
        "mt-4",
        "flex",
        "items-center",
        "gap-6"
    ),
    ratingGroup: clsx(
        "flex",
        "items-center",
        "gap-2"
    ),
    starIcon: clsx(
        "h-4",
        "w-4",
        "fill-yellow-400",
        "text-yellow-400"
    ),
    ratingValue: clsx(
        "text-[15px]",
        "font-semibold"
    ),
    reviewsCount: clsx(
        "text-[15px]",
        "text-slate-600"
    ),
    divider: clsx(
        "h-4",
        "w-px",
        "bg-slate-300"
    ),
    verifiedGroup: clsx(
        "flex",
        "items-center",
        "gap-2"
    ),
    verifiedIcon: clsx(
        "h-4",
        "w-4",
        "text-teal-600"
    ),
    verifiedText: clsx(
        "text-[15px]",
        "font-medium",
        "text-teal-700"
    ),
    detailsRow: clsx(
        "mt-5",
        "flex",
        "items-center",
        "gap-6"
    ),
    detailGroup: clsx(
        "flex",
        "items-center",
        "gap-2"
    ),
    detailIcon: clsx(
        "h-4",
        "w-4",
        "text-slate-500"
    ),
    detailText: clsx(
        "text-[15px]"
    ),
    capacityText: clsx(
        "text-[15px]",
        "font-medium"
    ),
    amenitiesBox: clsx(
        "mt-6",
        "rounded-xl",
        "border",
        "border-slate-200",
        "px-4",
        "py-3"
    ),
    amenitiesFlex: clsx(
        "flex",
        "flex-wrap",
        "items-center",
        "gap-x-7",
        "gap-y-3"
    ),
    amenityGroup: clsx(
        "flex",
        "items-center",
        "gap-2"
    ),
    amenityIcon: clsx(
        "h-4",
        "w-4",
        "text-slate-500"
    ),
    amenityText: clsx(
        "text-[14px]",
        "font-medium",
        "text-slate-700"
    ),
    moreAmenities: clsx(
        "text-[14px]",
        "font-semibold",
        "text-slate-700"
    )
};
