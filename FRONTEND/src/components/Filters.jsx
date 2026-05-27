import { MapPin } from "@mynaui/icons-react";
import { Kanban } from "@mynaui/icons-react";
import { Dollar } from "@mynaui/icons-react";
import { Speaker } from "@mynaui/icons-react";
import { ChevronDown } from "@mynaui/icons-react";
import { Config } from "@mynaui/icons-react";

function Filters() {

    const dropdownFilters = [
        { name: "Location", icon: <MapPin size={20}/>},
        { name: "Venue Type", icon: <Kanban size={20}/>},
        { name: "Budget", icon: <Dollar size={20}/>},
        { name: "Amenities", icon: <Speaker size={20}/>}
    ]

    return (
        <div className="FILTERS flex flex-wrap justify-center gap-2 md:gap-3 pt-2 md:pt-3">
            {dropdownFilters.map((filter, index) => (
                <button 
                    key={index}
                    className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-[#f9f9f7] text-[#2a5660] text-xs md:text-sm rounded-full shadow-md hover:bg-[#e0e0dc] hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 ease-in-out"
                >
                    <span>{filter.icon}</span>   
                    <span>{filter.name}</span>
                    <ChevronDown />
                </button>
            ))}
            
            <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-[#f56d5e] text-white text-xs md:text-sm rounded-full shadow-md hover:bg-[#BF5842] hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 ease-in-out">
                <Config />
                <span>All Filters</span>
            </button>
        </div>
    )
}

export default Filters