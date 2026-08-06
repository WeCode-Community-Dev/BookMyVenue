import { useState } from "react";

export default function VenueFilterModal({
    open,
    onClose,
    appliedFilters,
    onApply,
    categories,
}) {
    const [activeSection, setActiveSection] = useState("category");

    const [tempFilters, setTempFilters] = useState(appliedFilters);


    const PRICE_RANGES = [
        {
            label: "< ₹45K",
            minPrice: "",
            maxPrice: 45000,
        },
        {
            label: "₹45K - ₹60K",
            minPrice: 45000,
            maxPrice: 60000,
        },
        {
            label: "₹60K - ₹100K",
            minPrice: 60000,
            maxPrice: 100000,
        },
        {
            label: "₹100K+",
            minPrice: 100000,
            maxPrice: "",
        },
    ];

    const clearFilters = () => {
        setTempFilters({
            district: "",
            category: "",
            minPrice: "",
            maxPrice: "",
        });
    };

    const handleApply = () => {
        onApply(tempFilters);
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-black">
                        Filters
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-600 text-xl transition"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="flex h-80">

                    {/* Left Menu */}
                    <div className="w-1/3 border-r border-gray-200">

                        <button
                            onClick={() => setActiveSection("category")}
                            className={`w-full text-left p-4 ${activeSection === "category"
                                ? "bg-red-50 text-red-600 border-r-4 border-red-600 font-semibold"
                                : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            Category
                        </button>

                        <button
                            onClick={() => setActiveSection("price")}
                            className={`w-full text-left p-4 ${activeSection === "price"
                                ? "bg-red-50 text-red-600 border-r-4 border-red-600 font-semibold"
                                : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            Price
                        </button>

                    </div>

                    {/* Right Side */}
                    <div className="flex-1 p-5">

                        {activeSection === "category" && (
                            <div className="flex flex-wrap gap-3">

                                {categories.map((category) => (
                                    <button
                                        key={category._id}
                                        onClick={() =>
                                            setTempFilters(prev => ({
                                                ...prev,
                                                category: category.identifier,
                                            }))
                                        }
                                        className={` px-4 py-2 rounded-xl border transition-all duration-200 ${tempFilters.category === category.identifier
                                            ? "bg-red-600 text-white border-red-600"
                                            : "bg-white text-black border-gray-300 hover:bg-red-50 hover:border-red-300"
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}

                            </div>
                        )}

                        {activeSection === "price" && (
                            <div className="flex flex-wrap gap-3">

                                {PRICE_RANGES.map((range) => (
                                    <button
                                        key={range.label}
                                        onClick={() =>
                                            setTempFilters((prev) => ({
                                                ...prev,
                                                minPrice: range.minPrice,
                                                maxPrice: range.maxPrice,
                                            }))
                                        }
                                        className={`px-4 py-2 rounded-xl border transition-all duration-200 ${tempFilters.minPrice === range.minPrice &&
                                            tempFilters.maxPrice === range.maxPrice
                                            ? "bg-red-600 text-white border-red-600"
                                            : "bg-white text-black border-gray-300 hover:bg-red-50 hover:border-red-300"
                                            }`}
                                    >
                                        {range.label}
                                    </button>
                                ))}

                            </div>
                        )}

                    </div>

                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-4 flex justify-end gap-3">

                    <button
                        onClick={clearFilters}
                        className=" px-4 py-2 border border-gray-300 text-black rounded-xl hover:bg-gray-50 "
                    >
                        Clear
                    </button>

                    <button
                        onClick={handleApply}
                        className=" px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition "
                    >
                        Apply Filters
                    </button>

                </div>

            </div>

        </div>
    );
}