import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none cursor-default",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
        destructive:
          "border-transparent bg-red-100 text-red-700 hover:bg-red-200",
        outline: "text-slate-950 border border-slate-200 hover:bg-slate-50",
        emerald:
          "border-transparent bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100/80",
        rose:
          "border-transparent bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100/80",
        blue:
          "border-transparent bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100/80",
        interactive:
          "border-slate-200 bg-white text-slate-600 hover:border-rose-250 hover:bg-rose-50/50 hover:text-rose-750 cursor-pointer shadow-xs active:translate-y-px transition-all",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
