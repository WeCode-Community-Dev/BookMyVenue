const FilterTabs = ({
    tabs,
    activeTab,
    onTabChange
}) => {
console.log("activeTab",activeTab)
console.log("tabs",tabs)
    return (

        <div className="flex items-center gap-3">

            {tabs.map((tab) => (

                <button
                    key={tab.value}
                    onClick={() => onTabChange(tab.value)}
                    className={`
                        px-4
                        py-2
                        rounded-lg
                        text-sm
                        font-medium
                        transition-all
                        ${
                            activeTab === tab.value
                                ? "bg-[#FF8C1A] text-white"
                                : "bg-white text-gray-600 border border-gray-300 hover:border-[#FF8C1A] hover:text-[#FF8C1A]"
                        }
                    `}
                >
                    {tab.label}
                </button>

            ))}

        </div>

    );

};

export default FilterTabs;