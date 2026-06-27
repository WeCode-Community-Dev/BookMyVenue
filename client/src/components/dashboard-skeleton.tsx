import { cn } from "@/lib/utils";

export function DashboardSkeleton() {
	return (
		<div
			className={cn(
				"grid grid-cols-2 gap-4 lg:grid-cols-4",
				"*:min-h-48 *:w-full *:bg-muted *:ring-1 *:ring-border *:dark:bg-muted/50"
			)}
		>
			<div className="rounded-md" />
			<div className="rounded-md" />
			<div className="rounded-md" />
			<div className="rounded-md" />
			<div className="rounded-md col-span-2 min-h-92! lg:col-span-2" />
			<div className="rounded-md col-span-2 min-h-92! lg:col-span-2" />
			<div className="rounded-md col-span-2 min-h-114! lg:col-span-4" />
		</div>
	);
}
