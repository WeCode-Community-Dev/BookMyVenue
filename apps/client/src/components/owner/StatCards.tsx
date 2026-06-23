import { TrendingUp } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface Stat {
    label: string;
    value: string | number;
    sub: string;
    icon: LucideIcon;
    color: string;
}

interface StatCardsProps {
    stats: Stat[];
}

export default function StatCards({ stats }: StatCardsProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(({ label, value, sub, icon: Icon, color }) => (
                <div
                    key={label}
                    className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p
                        className="text-2xl font-bold text-foreground"
                    >
                        {value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{label}</p>
                    <p className="text-xs text-emerald-600 font-medium mt-0.5">{sub}</p>
                </div>
            ))}
        </div>
    );
}
