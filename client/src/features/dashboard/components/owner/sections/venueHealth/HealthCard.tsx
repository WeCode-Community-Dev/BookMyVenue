export default function HealthCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'amber' | 'red';
}) {
  const styles = {
    blue: {
      border: 'hover:border-blue-500/30',
      bg: 'bg-blue-500/10',
      text: 'text-blue-500',
      glow: 'bg-blue-500/5',
    },

    green: {
      border: 'hover:border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-500',
      glow: 'bg-emerald-500/5',
    },

    amber: {
      border: 'hover:border-amber-500/30',
      bg: 'bg-amber-500/10',
      text: 'text-amber-500',
      glow: 'bg-amber-500/5',
    },

    red: {
      border: 'hover:border-[#e21a47]/30',
      bg: 'bg-[#e21a47]/10',
      text: 'text-[#e21a47]',
      glow: 'bg-[#e21a47]/5',
    },
  };

  const s = styles[color];

  return (
    <div
      className={`bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl p-4 relative overflow-hidden group transition-all duration-300 ${s.border}`}
    >
      <div
        className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300 ${s.glow}`}
      />

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {title}
        </span>

        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.bg} ${s.text}`}>
          {icon}
        </div>
      </div>

      <div className="mt-2.5">
        <h3 className="text-lg font-black text-black dark:text-white tracking-tight">{value}</h3>
      </div>
    </div>
  );
}
