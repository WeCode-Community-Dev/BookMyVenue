const KERALA_DISTRICTS = [
    "Thiruvananthapuram",
    "Kollam",
    "Pathanamthitta",
    "Alappuzha",
    "Kottayam",
    "Idukki",
    "Ernakulam",
    "Thrissur",
    "Palakkad",
    "Malappuram",
    "Kozhikode",
    "Wayanad",
    "Kannur",
    "Kasaragod",
];

export function LocationModal({ open, onClose, onSelect }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="w-full max-w-md rounded-xl bg-white shadow-lg">

                
                <div className="flex items-center justify-between border-b border-gray-100 p-4">
                    <h2 className="font-semibold text-gray-900">
                        Select District
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                    >
                        ✕
                    </button>
                </div>

                {/* District Listing */}
                <div className="h-95 overflow-y-auto p-4">
                    <div className="grid gap-2">

                        {KERALA_DISTRICTS.map((district) => (
                            <button
                                key={district}
                                onClick={() => {
                                    onSelect(district);
                                    onClose();
                                }}
                                className="rounded-lg border border-gray-200 px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:border-red-500 hover:text-red-600"
                            >
                                {district}
                            </button>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    )
}