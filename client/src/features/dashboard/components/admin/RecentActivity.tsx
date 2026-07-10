import {
  UserPlus,
  Building2,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';

interface ActivityItem {
  title: string;
  description: string;
  time: string;
  type?: string;
}

interface RecentActivityProps {
  data?: ActivityItem[];
}

export default function RecentActivity({ data = [] }: RecentActivityProps) {
  const getVisuals = (type?: string) => {
    switch (type) {
      case 'owner_register':
        return {
          icon: UserPlus,
          colorClass: 'text-blue-500 bg-blue-500/10 dark:bg-blue-500/20',
        };
      case 'venue_submit':
        return {
          icon: Building2,
          colorClass: 'text-amber-500 bg-amber-500/10 dark:bg-amber-500/20',
        };
      case 'booking_confirm':
        return {
          icon: CheckCircle2,
          colorClass: 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20',
        };
      case 'owner_verify':
        return {
          icon: ShieldCheck,
          colorClass: 'text-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/20',
        };
      case 'refund_request':
        return {
          icon: RotateCcw,
          colorClass: 'text-rose-500 bg-rose-500/10 dark:bg-rose-500/20',
        };
      default:
        return {
          icon: CheckCircle2,
          colorClass: 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20',
        };
    }
  };

  const displayActivities = data.map((item) => ({
    ...item,
    ...getVisuals(item.type),
  }));

  return (
    <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/85 bg-white dark:bg-[#1a1a1a] p-6 text-foreground shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-[#e21a47] uppercase tracking-[0.25em]">
            History
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#e21a47]" />
        </div>

        <h2 className="text-lg font-bold tracking-tight text-black dark:text-white leading-none mb-6">
          Recent <span className="text-[#e21a47]">Activity</span>
        </h2>

        <div className="space-y-4">
          {displayActivities.length > 0 ? (
            displayActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-3.5 pb-4 border-b border-zinc-100 dark:border-zinc-800/60 last:border-b-0 last:pb-0"
                >
                  <div
                    className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${activity.colorClass}`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-black dark:text-white truncate">
                      {activity.title}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                      {activity.description}
                    </p>
                  </div>

                  <span className="text-[10px] text-zinc-400 dark:text-zinc-550 shrink-0 font-medium mt-0.5">
                    {activity.time}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <span className="text-xs font-bold uppercase tracking-wider">Data not available</span>
            </div>
          )}
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 mt-6 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider text-black dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-[#e21a47]/30 transition-all duration-200 group cursor-pointer">
        View All History
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
      </button>
    </div>
  );
}
