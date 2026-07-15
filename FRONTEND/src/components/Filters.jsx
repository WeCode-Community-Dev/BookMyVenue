import { Dollar, Speaker, ChevronDown, Check } from "@mynaui/icons-react";
import { useEffect, useState, useRef } from "react";

// 1. Accept the props passed down from HomePage
function Filters({ searchParams, setSearchParams }) {
    const [openDropdown, setOpenDropdown] = useState(null);
    const containerRef = useRef(null);

    // 2. Map visual labels to actual backend data values
    const budgetOptions = [
        { label: "Any Budget", min: null, max: null },
        { label: "1000₹ - 5000₹", min: 1000, max: 5000 },
        { label: "5000₹ - 10,000₹", min: 5000, max: 10000 },
        { label: "10,000₹ - 50,000₹", min: 10000, max: 50000 },
        { label: "50,000₹+", min: 50000, max: null }
    ];

    const amenityOptions = [
        { label: "High-Speed WiFi", key: "wifi" },
        { label: "Parking Space", key: "parking" },
        { label: "Air Conditioning", key: "ac" }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    // 3. Logic to handle updating the Budget
    const handleBudgetSelect = (option) => {
        setSearchParams(prev => ({
            ...prev,
            min_price: option.min,
            max_price: option.max
        }));
        setOpenDropdown(null); // Close dropdown after picking a budget
    };

    // 4. Logic to handle toggling Amenities
    const handleAmenityToggle = (key) => {
        setSearchParams(prev => ({
            ...prev,
            // If it's already true, set it to null to turn it off. Otherwise, set it to true!
            [key]: prev[key] ? null : true 
        }));
        // Note: We don't close the dropdown here so users can select multiple amenities at once!
    };

    // UI Helpers: Check if filters are active so we can highlight the buttons
    const activeAmenitiesCount = amenityOptions.filter(opt => searchParams?.[opt.key]).length;
    const isBudgetActive = searchParams?.min_price || searchParams?.max_price;

    return (
        <div ref={containerRef} className="FILTERS flex flex-wrap justify-center gap-2 md:gap-3 pt-2 md:pt-3">
            
            {/* BUDGET DROPDOWN */}
            <div className="relative">
                <button 
                    onClick={() => toggleDropdown("Budget")}
                    className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-full shadow-md hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 ease-in-out ${
                        isBudgetActive ? "bg-[#2a5660] text-white hover:bg-[#1d3f47]" : "bg-[#f9f9f7] text-[#2a5660] hover:bg-[#e0e0dc]"
                    }`}
                >
                    <Dollar size={20}/>
                    <span>Budget</span>
                    <span className={`transition-transform duration-300 ${openDropdown === "Budget" ? "rotate-180" : ""}`}>
                        <ChevronDown />
                    </span>
                </button>

                <div className={`DROPDOWN absolute w-max min-w-[200px] mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-50 transition-all duration-300 ease-out origin-top-left ${
                    openDropdown === "Budget" ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                }`}>
                    {budgetOptions.map((option, i) => {
                        const isSelected = searchParams?.min_price === option.min && searchParams?.max_price === option.max;
                        
                        return (
                            <button
                                key={i}
                                onClick={() => handleBudgetSelect(option)}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-colors cursor-pointer ${
                                    isSelected ? "bg-[#2a5660]/10 text-[#2a5660] font-bold" : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                {option.label}
                                {isSelected && <Check size={18} className="text-[#2a5660]" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* AMENITIES DROPDOWN */}
            <div className="relative">
                <button 
                    onClick={() => toggleDropdown("Amenities")}
                    className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-full shadow-md hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 ease-in-out ${
                        activeAmenitiesCount > 0 ? "bg-[#2a5660] text-white hover:bg-[#1d3f47]" : "bg-[#f9f9f7] text-[#2a5660] hover:bg-[#e0e0dc]"
                    }`}
                >
                    <Speaker size={20}/>
                    <span>Amenities {activeAmenitiesCount > 0 && `(${activeAmenitiesCount})`}</span>
                    <span className={`transition-transform duration-300 ${openDropdown === "Amenities" ? "rotate-180" : ""}`}>
                        <ChevronDown />
                    </span>
                </button>

                <div className={`DROPDOWN absolute w-max min-w-[220px] mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-50 transition-all duration-300 ease-out origin-top-left ${
                    openDropdown === "Amenities" ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                }`}>
                    {amenityOptions.map((option, i) => {
                        const isSelected = searchParams?.[option.key] === true;
                        
                        return (
                            <button
                                key={i}
                                onClick={() => handleAmenityToggle(option.key)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-gray-700"
                            >
                                {/* Custom Checkbox UI */}
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                    isSelected ? "bg-[#2a5660] border-[#2a5660] text-white" : "border-gray-300 bg-white"
                                }`}>
                                    {isSelected && <Check size={16} strokeWidth={3} />}
                                </div>
                                <span className={isSelected ? "font-semibold text-[#2a5660]" : ""}>
                                    {option.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

        </div>
    )
}

export default Filters