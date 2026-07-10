import { Trophy, TrendingUp, Calendar, Star, Users, ArrowUpRight } from 'lucide-react';

interface PlatformLeaderItem {
  rank: number;
  title: string;
  name: string;
  metric: string;
}

interface PlatformLeadersProps {
  data?: PlatformLeaderItem[];
}

export default function PlatformLeaders({ data = [] }: PlatformLeadersProps) {
  const getVisuals = (rank: number) => {
    if (rank === 1) {
      return {
        icon: TrendingUp,
        colorClass:
          'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-500 dark:text-amber-400',
        rankBg: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black',
        glowClass: 'bg-amber-500/5',
      };
    }
    if (rank === 2) {
      return {
        icon: Calendar,
        colorClass:
          'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-500 dark:text-blue-400',
        rankBg: 'bg-gradient-to-r from-zinc-400 to-zinc-300 text-black',
        glowClass: 'bg-blue-500/5',
      };
    }
    if (rank === 3) {
      return {
        icon: Star,
        colorClass:
          'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-550 dark:text-emerald-400',
        rankBg: 'bg-gradient-to-r from-orange-400 to-amber-600 text-white',
        glowClass: 'bg-emerald-500/5',
      };
    }
    return {
      icon: Users,
      colorClass:
        'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-500 dark:text-indigo-400',
      rankBg: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
      glowClass: 'bg-indigo-500/5',
    };
  };

  const displayLeaders = data.map((item) => ({
    ...item,
    ...getVisuals(item.rank),
  }));

  return (
    <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/85 bg-white dark:bg-[#1a1a1a] p-6 text-foreground shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#e21a47] uppercase tracking-[0.25em]">
                Hall of Fame
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#e21a47]" />
            </div>
            <h2 className="text-lg font-bold tracking-tight mt-1 text-black dark:text-white leading-none">
              Platform <span className="text-[#e21a47]">Leaders</span>
            </h2>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Trophy className="w-5 h-5 animate-bounce" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayLeaders.length > 0 ? (
            displayLeaders.map((leader) => {
              const Icon = leader.icon;
              return (
                <div
                  key={leader.title}
                  className={`rounded-2xl border border-zinc-200/60 dark:border-zinc-800/65 bg-gradient-to-b ${leader.colorClass} p-5 shadow-md relative overflow-hidden group hover:-translate-y-1 transition-all duration-300`}
                >
                  <div
                    className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300 ${leader.glowClass}`}
                  />

                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center shadow-inner ${leader.rankBg}`}
                    >
                      {leader.rank}
                    </span>
                    <div className="w-8.5 h-8.5 rounded-xl bg-white/70 dark:bg-black/30 flex items-center justify-center shadow-sm">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550 block mb-1">
                    {leader.title}
                  </span>

                  <h3 className="text-base font-black text-black dark:text-white tracking-tight mb-2 truncate">
                    {leader.name}
                  </h3>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-black text-zinc-900 dark:text-white">
                      {leader.metric}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-0.5 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                      <ArrowUpRight className="w-3 h-3" />
                      Top
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-10 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <Trophy className="w-8 h-8 mb-2 opacity-40 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">Data not available</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
