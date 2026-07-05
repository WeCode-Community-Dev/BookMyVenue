import { Tab, TABS } from "@/lib/data";

interface NavTabsProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

export default function NavTabs({ activeTab, onTabChange }: NavTabsProps) {
    return (
        <div className="flex border-b border-border mb-6 gap-0">
            {TABS.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px capitalize ${
                        activeTab === tab
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}
