import clsx from "clsx";

export const verifyBookingStyle = {
    overlay: clsx(
        "fixed",
        "inset-0",
        "z-50",
        "flex",
        "items-center",
        "justify-center",
        "bg-black/50",
        "p-2",
        "md:p-6"
    ),
    dialogContainer: clsx(
        "max-h-[95vh]",
        "w-full",
        "max-w-7xl",
        "overflow-y-auto",
        "rounded-3xl",
        "bg-dialog-bg-color",
        "border",
        "border-border",
        "text-foreground",
        "shadow-2xl"
    ),
    header: clsx(
        "flex",
        "items-start",
        "justify-between",
        "border-b",
        "border-border",
        "p-5",
        "md:p-6"
    ),
    title: clsx(
        "text-2xl",
        "font-bold",
        "text-foreground"
    ),
    locationWrapper: clsx(
        "mt-2",
        "flex",
        "items-center",
        "gap-2",
        "text-muted-foreground"
    ),
    headerRight: clsx(
        "flex",
        "items-center",
        "gap-4"
    ),
    statusBadge: clsx(
        "rounded-full",
        "bg-orange-100",
        "px-3",
        "py-1",
        "text-sm",
        "font-medium",
        "text-orange-700",
        "dark:bg-orange-950/30",
        "dark:text-orange-400"
    ),
    closeBtn: clsx(
        "rounded-full",
        "text-muted-foreground",
        "hover:bg-muted"
    ),
    galleryGrid: clsx(
        "grid",
        "gap-4",
        "p-5",
        "md:grid-cols-[2fr_1fr]",
        "md:p-6"
    ),
    mainImageWrapper: clsx(
        "overflow-hidden",
        "rounded-2xl"
    ),
    mainImage: clsx(
        "h-full",
        "w-full",
        "object-cover"
    ),
    sideImageGrid: clsx(
        "grid",
        "grid-cols-2",
        "gap-3"
    ),
    sideImageWrapper: clsx(
        "relative",
        "overflow-hidden",
        "rounded-xl"
    ),
    sideImage: clsx(
        "h-full",
        "w-full",
        "object-cover"
    ),
    moreImagesOverlay: clsx(
        "absolute",
        "inset-0",
        "flex",
        "items-center",
        "justify-center",
        "bg-black/50",
        "text-2xl",
        "font-bold",
        "text-white"
    ),
    detailsGrid: clsx(
        "grid",
        "gap-6",
        "px-5",
        "pb-5",
        "md:grid-cols-2",
        "md:px-6",
        "md:pb-6"
    ),
    sectionCard: clsx(
        "rounded-2xl",
        "border",
        "border-border",
        "p-5"
    ),
    sectionTitle: clsx(
        "mb-5",
        "flex",
        "items-center",
        "gap-2",
        "text-lg",
        "font-semibold"
    ),
    sectionTitleIcon: clsx(
        "h-5",
        "w-5",
        "text-secondary-text-color"
    ),
    infoRowContainer: clsx(
        "flex",
        "items-center",
        "justify-between",
        "gap-4"
    ),
    infoRowLabelContainer: clsx(
        "flex",
        "items-center",
        "gap-2",
        "text-muted-foreground"
    ),
    infoRowIcon: clsx(
        "h-4",
        "w-4"
    ),
    infoRowValue: clsx(
        "text-right",
        "font-medium",
        "text-foreground"
    ),
    amenitiesContainer: clsx(
        "flex",
        "flex-wrap",
        "gap-2"
    ),
    amenityBadge: clsx(
        "rounded-full",
        "bg-muted",
        "px-3",
        "py-1",
        "text-sm",
        "text-muted-foreground"
    ),
    descriptionText: clsx(
        "text-sm",
        "leading-7",
        "text-muted-foreground"
    ),
    iframeWrapper: clsx(
        "overflow-hidden",
        "rounded-xl",
        "border",
        "border-border"
    ),
    iframe: clsx(
        "w-full"
    ),
    locationFooter: clsx(
        "mt-4",
        "flex",
        "flex-col",
        "gap-4",
        "sm:flex-row",
        "sm:items-center",
        "sm:justify-between"
    ),
    addressText: clsx(
        "text-sm",
        "text-muted-foreground"
    ),
    openInMapsBtn: clsx(
        "h-auto",
        "flex",
        "items-center",
        "gap-2",
        "rounded-lg",
        "border",
        "border-secondary-text-color/20",
        "px-4",
        "py-2",
        "text-sm",
        "font-medium",
        "text-secondary-text-color",
        "hover:bg-secondary-text-color/10"
    ),
    submittedOnTitle: clsx(
        "text-sm",
        "font-medium",
        "text-foreground"
    ),
    submittedOnValue: clsx(
        "mt-1",
        "text-sm",
        "text-muted-foreground"
    ),
    additionalNotesTitle: clsx(
        "mb-2",
        "text-sm",
        "font-medium",
        "text-foreground"
    ),
    textarea: clsx(
        "h-28",
        "w-full",
        "rounded-xl",
        "border",
        "border-border",
        "bg-transparent",
        "text-foreground",
        "p-3",
        "text-sm"
    ),
    footer: clsx(
        "sticky",
        "bottom-0",
        "flex",
        "justify-end",
        "gap-3",
        "border-t",
        "border-border",
        "bg-dialog-bg-color",
        "p-5"
    ),
    cancelBtn: clsx(
        "h-auto",
        "rounded-xl",
        "border",
        "border-border",
        "px-6",
        "py-3",
        "font-medium",
        "text-foreground",
        "hover:bg-muted"
    ),
    primaryActionBtn: clsx(
        "h-auto",
        "rounded-xl",
        "bg-teal-600",
        "px-6",
        "py-3",
        "font-medium",
        "text-white",
        "hover:bg-teal-700",
        "border-transparent"
    )
};
