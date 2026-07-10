import { AlertTriangle, Clock, ShieldAlert, ArrowRight } from 'lucide-react';

interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: string;
  time: string;
  pulse?: boolean;
  badgeText?: string;
}

interface AlertsPanelProps {
  data?: AlertItem[];
}

export default function AlertsPanel({ data = [] }: AlertsPanelProps) {
  const getVisuals = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return {
          icon: AlertTriangle,
          badgeText: 'Critical',
          colorClass: 'text-rose-500 bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/20',
          pulse: true,
        };
      case 'warning':
        return {
          icon: Clock,
          badgeText: 'Overdue',
          colorClass: 'text-amber-500 bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/20',
          pulse: false,
        };
      case 'urgent':
        return {
          icon: ShieldAlert,
          badgeText: 'Urgent',
          colorClass: 'text-purple-500 bg-purple-500/10 dark:bg-purple-500/20 border-purple-500/20',
          pulse: false,
        };
      default:
        return {
          icon: AlertTriangle,
          badgeText: 'Info',
          colorClass: 'text-blue-500 bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/20',
          pulse: false,
        };
    }
  };

  const displayAlerts = data.map((item) => ({
    ...item,
    ...getVisuals(item.severity),
  }));

  return (
    <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/85 bg-white dark:bg-[#1a1a1a] p-6 text-foreground shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-[#e21a47] uppercase tracking-[0.25em]">
            Operational Alerts
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#e21a47]" />
        </div>

        <h2 className="text-lg font-bold tracking-tight text-black dark:text-white leading-none mb-6">
          Alerts & <span className="text-[#e21a47]">Issues</span>
        </h2>

        <div className="space-y-4">
          {displayAlerts.length > 0 ? (
            displayAlerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <div
                  key={alert.id}
                  className="group p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/20 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-350 dark:hover:border-zinc-700"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative ${alert.colorClass}`}
                    >
                      <Icon className="w-5 h-5" />
                      {alert.pulse && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-black dark:text-white group-hover:text-[#e21a47] transition-colors duration-200">
                          {alert.title}
                        </h4>
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${alert.colorClass}`}
                        >
                          {alert.badgeText}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                        {alert.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-550 font-medium">
                      {alert.time}
                    </span>
                    <button className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider text-black dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-[#e21a47]/30 transition-all duration-200 group/btn cursor-pointer">
                      Resolve
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                    </button>
                  </div>
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
    </div>
  );
}
