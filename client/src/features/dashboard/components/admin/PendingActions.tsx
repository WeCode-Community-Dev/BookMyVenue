import { UserCheck, Building2, RefreshCcw, Flag, IndianRupee, ArrowRight } from 'lucide-react';

interface PendingActionsProps {
  data?: {
    ownerVerifications: number;
    venueApprovals: number;
    venueUpdates: number;
    reportedVenues: number;
    refundRequests: number;
  };
}

export default function PendingActions({ data }: PendingActionsProps) {
  const actions = [
    {
      title: 'Pending Owner Verifications',
      count: data ? data.ownerVerifications : 0,
      icon: UserCheck,
      colorClass: 'text-blue-500 bg-blue-500/10 dark:bg-blue-500/20',
      borderColor: 'hover:border-blue-500/25 dark:hover:border-blue-500/35',
    },
    {
      title: 'Pending Venue Approvals',
      count: data ? data.venueApprovals : 0,
      icon: Building2,
      colorClass: 'text-amber-500 bg-amber-500/10 dark:bg-amber-500/20',
      borderColor: 'hover:border-amber-500/25 dark:hover:border-amber-500/35',
    },
    {
      title: 'Pending Venue Updates',
      count: data ? data.venueUpdates : 0,
      icon: RefreshCcw,
      colorClass: 'text-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/20',
      borderColor: 'hover:border-indigo-500/25 dark:hover:border-indigo-500/35',
    },
    {
      title: 'Reported Venues',
      count: data ? data.reportedVenues : 0,
      icon: Flag,
      colorClass: 'text-rose-500 bg-rose-500/10 dark:bg-rose-500/20',
      borderColor: 'hover:border-rose-500/25 dark:hover:border-rose-500/35',
    },
    {
      title: 'Refund Requests',
      count: data ? data.refundRequests : 0,
      icon: IndianRupee,
      colorClass: 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20',
      borderColor: 'hover:border-emerald-500/25 dark:hover:border-emerald-500/35',
    },
  ];

  return (
    <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/85 bg-white dark:bg-[#1a1a1a] p-6 text-foreground shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-[#e21a47] uppercase tracking-[0.25em]">
            Moderation
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#e21a47]" />
        </div>

        <h2 className="text-lg font-bold tracking-tight text-black dark:text-white leading-none mb-6">
          Pending <span className="text-[#e21a47]">Actions</span>
        </h2>

        <div className="space-y-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.title}
                className={`group p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/20 transition-all duration-300 flex items-center justify-between ${action.borderColor}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${action.colorClass}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-black dark:text-white group-hover:text-[#e21a47] transition-colors duration-200">
                      {action.title}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {data ? `${action.count} items requiring review` : 'Data not available'}
                    </p>
                  </div>
                </div>

                <button className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider text-black dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-[#e21a47]/30 transition-all duration-200 group/btn cursor-pointer">
                  Review
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
