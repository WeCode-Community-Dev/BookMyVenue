import SearchBar from "../common/SearchBar";
import FilterTabs from "../common/FilterTabs";
import FilterDropdown from "../common/FilterDropdown";

const PaymentFilters = ({
    search,
    onSearchChange,
    paymentStatus,
    onPaymentStatusChange,
    paymentType,
    onPaymentTypeChange,
}) => {

const tabs = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Advance",
    value: "advance",
  },
  {
    label: "Balance",
    value: "balance",
  },
  {
    label: "Full",
    value: "full",
  },
];

    const paymentStatusOptions = [
        {
            label: "All Payments",
            value: "",
        },
        {
            label: "Pending",
            value: "pending",
        },
        {
            label: "Success",
            value: "success",
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
                    placeholder="Search payments..."
                />

                <div className="flex gap-3 flex-wrap">

                    <FilterDropdown
                        label="Payment Status"
                        value={paymentStatus}
                        onChange={onPaymentStatusChange}
                        options={paymentStatusOptions}
                    />


                </div>

            </div>

            <FilterTabs
                tabs={tabs}
                activeTab={paymentType}
                onTabChange={onPaymentTypeChange}
            />

        </div>

    );

};

export default PaymentFilters;