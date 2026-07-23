import clsx from "clsx";

export const bookingSummaryStyle = {
    card: clsx(
        "overflow-hidden",
        "rounded-2xl",
        "border",
        "border-slate-200",
        "bg-white",
        "shadow-sm"
    ),
    p5: clsx("p-5"),
    heading: clsx(
        "text-[18px]",
        "font-bold",
        "text-slate-900"
    ),
    venueRow: clsx(
        "mt-5",
        "flex",
        "gap-3"
    ),
    imageWrapper: clsx(
        "overflow-hidden",
        "rounded-lg",
        "border",
        "border-slate-200"
    ),
    image: clsx(
        "h-[62px]",
        "w-[84px]",
        "object-cover"
    ),
    venueInfo: clsx(
        "flex",
        "flex-1",
        "flex-col",
        "justify-center"
    ),
    venueName: clsx(
        "text-[15px]",
        "font-semibold",
        "leading-5",
        "text-slate-900"
    ),
    verifiedRow: clsx(
        "mt-2",
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
        "text-[14px]",
        "font-medium",
        "text-teal-700"
    ),
    divider: clsx(
        "my-5",
        "border-t",
        "border-slate-200"
    ),
    subheading: clsx(
        "text-[17px]",
        "font-semibold",
        "text-slate-900"
    ),
    itemsList: clsx(
        "mt-4",
        "space-y-4"
    ),
    itemRow: clsx(
        "flex",
        "items-start",
        "gap-3"
    ),
    dateBlock: clsx(
        "flex",
        "h-[56px]",
        "w-[48px]",
        "shrink-0",
        "flex-col",
        "items-center",
        "justify-center",
        "rounded-lg",
        "bg-[#EAF8F6]"
    ),
    dateDay: clsx(
        "text-[22px]",
        "font-bold",
        "leading-none",
        "text-[#0F8C84]"
    ),
    dateMonth: clsx(
        "mt-1",
        "text-[10px]",
        "font-bold",
        "tracking-wide",
        "text-[#0F8C84]"
    ),
    itemContent: clsx(
        "min-w-0",
        "flex-1"
    ),
    itemTitle: clsx(
        "truncate",
        "text-[14px]",
        "font-semibold",
        "text-slate-900"
    ),
    itemTimeRow: clsx(
        "mt-1",
        "flex",
        "items-center",
        "gap-1",
        "text-[12px]",
        "text-slate-500"
    ),
    itemTimeIcon: clsx(
        "h-3",
        "w-3"
    ),
    itemGuests: clsx(
        "mt-1",
        "text-[12px]",
        "text-slate-500"
    ),
    itemPriceWrapper: clsx("pl-2"),
    itemPrice: clsx(
        "text-[18px]",
        "font-bold",
        "text-slate-900"
    ),
    priceBreakdownList: clsx(
        "mt-4",
        "space-y-3"
    ),
    rowSpaceBetween: clsx(
        "flex",
        "items-center",
        "justify-between"
    ),
    labelCol: clsx(
        "text-[14px]",
        "text-slate-600"
    ),
    valCol: clsx(
        "text-[14px]",
        "font-semibold",
        "text-slate-900"
    ),
    dividerDashed: clsx(
        "my-5",
        "border-t",
        "border-dashed",
        "border-slate-300"
    ),
    totalsList: clsx("space-y-3"),
    valColFree: clsx(
        "text-[14px]",
        "font-semibold",
        "text-emerald-600"
    ),
    valColIncluded: clsx(
        "text-[14px]",
        "font-semibold",
        "text-slate-900"
    ),
    grandTotalLabel: clsx(
        "text-[15px]",
        "font-semibold",
        "text-slate-900"
    ),
    grandTotalSubtext: clsx(
        "mt-1",
        "text-[13px]",
        "text-slate-500"
    ),
    grandTotalVal: clsx(
        "text-[28px]",
        "font-bold",
        "text-[#0F8C84]"
    ),
    policyCard: clsx(
        "mt-5",
        "rounded-xl",
        "border",
        "border-amber-200",
        "bg-amber-50",
        "p-4"
    ),
    policyTitle: clsx(
        "text-[14px]",
        "font-semibold",
        "text-amber-900"
    ),
    policyText: clsx(
        "mt-2",
        "text-[13px]",
        "leading-6",
        "text-amber-800"
    ),
    payBtnActive: clsx(
        "mt-5",
        "flex",
        "h-12",
        "w-full",
        "items-center",
        "justify-center",
        "rounded-xl",
        "bg-gradient-to-r",
        "from-teal-600",
        "to-emerald-600",
        "text-[15px]",
        "font-semibold",
        "text-white",
        "shadow-md",
        "transition-all",
        "duration-200",
        "hover:scale-[1.01]",
        "hover:shadow-lg",
        "cursor-pointer"
    ),
    payBtnDisabled: clsx(
        "mt-5",
        "flex",
        "h-12",
        "w-full",
        "items-center",
        "justify-center",
        "rounded-xl",
        "bg-gradient-to-r",
        "from-teal-600",
        "to-emerald-600",
        "text-[15px]",
        "font-semibold",
        "text-white",
        "shadow-md",
        "transition-all",
        "duration-200",
        "opacity-50",
        "cursor-not-allowed"
    ),
    footerText: clsx(
        "mt-4",
        "text-center",
        "text-[12px]",
        "text-slate-500"
    ),
    footerBrand: clsx(
        "ml-1",
        "font-semibold",
        "text-[#2563EB]"
    )
};
