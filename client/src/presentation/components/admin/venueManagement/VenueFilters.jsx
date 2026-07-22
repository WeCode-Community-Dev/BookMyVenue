import SearchBar from "../common/SearchBar";
import FilterTabs from "../common/FilterTabs";
import FilterDropdown from "../common/FilterDropdown";

const VenueFilters = ({
    search,
    onSearchChange,
    status,
    onStatusChange,
    category,
    onCategoryChange,
}) => {

    const tabs = [
        {
            label: "All",
            value: "all",
        },
        {
            label: "Pending",
            value: "pending",
        },
        {
            label: "Approved",
            value: "approved",
        },
        {
            label: "Rejected",
            value: "rejected",
        },
        {
            label: "Blocked",
            value: "blocked",
        },
    ];

const categoryOptions = [
    {
        label: "All Categories",
        value: "",
    },
    {
        label: "Beach Side",
        value: "Beach Side",
    },
    {
        label: "Conference Hall",
        value: "Conference Hall",
    },
    {
        label: "Auditorium",
        value: "Auditorium",
    },
    {
        label: "Banquet Hall",
        value: "Banquet Hall",
    },
    {
        label: "Party Hall",
        value: "Party Hall",
    },
    {
        label: "Rooftop",
        value: "Rooftop",
    },
    {
        label: "Cafe",
        value: "Cafe",
    },
    {
        label: "Farm House",
        value: "Farm House",
    },
    {
        label: "Palace",
        value: "Palace",
    },
    {
        label: "Studio",
        value: "Studio",
    },
    {
        label: "Outdoor Garden",
        value: "Outdoor Garden",
    },
    {
        label: "Resort",
        value: "Resort",
    },
    {
        label: "Hotel",
        value: "Hotel",
    },
];

    return (

        <div className="flex flex-col gap-4 mb-6">

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                <SearchBar
                    value={search}
                    onChange={onSearchChange}
                    placeholder="Search venues..."
                />

                <FilterDropdown
                    label="Category"
                    value={category}
                    onChange={onCategoryChange}
                    options={categoryOptions}
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

export default VenueFilters;