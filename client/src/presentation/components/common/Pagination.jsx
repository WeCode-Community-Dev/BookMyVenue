import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {

    if (totalPages <= 1) return null;

    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (

        <div className="flex items-center justify-between mt-6">

            {/* Previous Button */}

            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
                <ChevronLeft size={18} />
                Previous
            </button>

            {/* Page Numbers */}

            <div className="flex items-center gap-2">

                {pages.map((page) => (

                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 rounded-lg transition-all
                            ${
                                currentPage === page
                                    ? "bg-[#FF8C1A] text-white"
                                    : "border hover:bg-gray-100"
                            }`}
                    >
                        {page}
                    </button>

                ))}

            </div>

            {/* Next Button */}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
                Next
                <ChevronRight size={18} />
            </button>

        </div>

    );

};

export default Pagination;