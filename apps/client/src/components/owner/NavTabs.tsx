type Tab = "overview" | "bookings" | "venues";

const NAV_TABS = [
    { key: "overview" as const, label: "Overview" },
    { key: "bookings" as const, label: "Bookings" },
    { key: "venues" as const, label: "My Venues" },
];

interface NavTabsProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

export default function NavTabs({ activeTab, onTabChange }: NavTabsProps) {
    return (
        <div className="flex border-b border-border mb-6 gap-0">
            {NAV_TABS.map(({ key, label }) => (
                <button
                    key={key}
                    onClick={() => onTabChange(key)}
                    className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
                        activeTab === key
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}
