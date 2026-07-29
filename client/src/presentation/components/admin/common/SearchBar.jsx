import { Search } from "lucide-react";

const SearchBar = ({
    value,
    onChange,
    placeholder = "Search..."
}) => {

    return (

        <div className="relative w-full md:w-80">

            <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    py-2.5
                    pl-10
                    pr-4
                    text-sm
                    outline-none
                    focus:border-[#FF8C1A]
                    focus:ring-2
                    focus:ring-orange-200
                "
            />

        </div>

    );

};

export default SearchBar;