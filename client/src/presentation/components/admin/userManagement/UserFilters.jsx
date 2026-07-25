
import SearchBar from "../common/SearchBar";
import FilterTabs from "../common/FilterTabs";

const UserFilters = ({
    search,
    onSearchChange,
    status,
    onStatusChange
}) => {

    const tabs = [

        {
            label: "All",
            value: "all"
        },

        {
            label: "Active",
            value: "active"
        },

        {
            label: "Blocked",
            value: "blocked"
        }

    ];

    return (

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

            <SearchBar

                value={search}

                onChange={onSearchChange}

                placeholder="Search users..."

            />

            <FilterTabs

                tabs={tabs}

                activeTab={status}

                onTabChange={onStatusChange}

            />

        </div>

    );

};

export default UserFilters;