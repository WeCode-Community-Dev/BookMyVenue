import SearchBar from "../common/SearchBar";
import FilterTabs from "../common/FilterTabs";
import FilterDropdown from "../common/FilterDropdown";

const BookingFilters = ({
    search,
    onSearchChange,
    status,
    onStatusChange,
    paymentStatus,
    onPaymentStatusChange,
}) => {

    const tabs = [
        {
            label: "All",
            value: "",
        },
        {
            label: "Pending",
            value: "pending",
        },
        {
            label: "Confirmed",
            value: "confirmed",
        },
        {
            label: "Completed",
            value: "completed",
        },
        {
            label: "Cancelled",
            value: "cancelled",
        },
        
    ];

    const paymentOptions = [
        {
            label: "All Payments",
            value: "",
        },
        {
            label: "Pending",
            value: "pending",
        },
        {
            label: "Partial",
            value: "partial",
        },
        {
            label: "Paid",
            value: "paid",
        },
        {
            label: "Failed",
            value: "failed",
        },
        {
            label: "Refunded",
            value: "refunded",
        },
    ];

    return (

        <div className="flex flex-col gap-4 mb-6">

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                <SearchBar
                    value={search}
                    onChange={onSearchChange}
                    placeholder="Search bookings..."
                />

                <FilterDropdown
                    label="Payment Status"
                    value={paymentStatus}
                    onChange={onPaymentStatusChange}
                    options={paymentOptions}
                />

            </div>

            <FilterTabs
                tabs={tabs}
                activeTab={status}
                onTabChange={onStatusChange}
            />

        </div>

    );
};

export default BookingFilters;