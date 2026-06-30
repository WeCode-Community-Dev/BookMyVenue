import { MapPin } from "@mynaui/icons-react";
import { Kanban } from "@mynaui/icons-react";
import { Dollar } from "@mynaui/icons-react";
import { Speaker } from "@mynaui/icons-react";
import { ChevronDown } from "@mynaui/icons-react";
import { Config } from "@mynaui/icons-react";
import { useEffect, useState, useRef } from "react";

function Filters() {

    const [openDropdown, setOpenDropdown] = useState(null)
    const containerRef = useRef(null)


    const dropdownFilters = [
        { 
            name: "Location", 
            icon: <MapPin size={20}/>, 
            options: ["Downtown", "Suburbs", "City Center", "Beachfront"] 
        },
        // { 
        //     name: "Venue Type", 
        //     icon: <Kanban size={20}/>, 
        //     options: ["Indoor", "Outdoor", "Rooftop", "Barn"] 
        // },
        // { 
        //     name: "Budget", 
        //     icon: <Dollar size={20}/>, 
        //     options: ["$ (Under $500)", "$$ ($500 - $1k)", "$$$ ($1k - $5k)", "$$$$ ($5k+)"] 
        // },
        { 
            name: "Amenities", 
            icon: <Speaker size={20}/>, 
            options: ["WiFi", "Parking", "Catering", "AV Equipment"] 
        }
    ]

    useEffect(() => {
        const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)){
            setOpenDropdown(null)
        }}

        document.addEventListener("mousedown", handleClickOutside)
        return() => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, []);

    const toggleDropdown = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
    }
    
    return (
        <div ref={containerRef} className="FILTERS flex flex-wrap justify-center gap-2 md:gap-3 pt-2 md:pt-3">
            {dropdownFilters.map((filter, index) => (
                <div key={index} className="relative">
                    <button 
                        key={index}
                        onClick={() => toggleDropdown(filter.name)}
                        className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-[#f9f9f7] text-[#2a5660] text-xs md:text-sm rounded-full shadow-md hover:bg-[#e0e0dc] hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 ease-in-out"
                    >
                        <span>{filter.icon}</span>   
                        <span>{filter.name}</span>
                        <span className={`transition-transform duration-300 ${openDropdown === filter.name ? "rotate-180" : ""}`}>
                            <ChevronDown />
                        </span>
                    </button>

                    <div 
                        className={`DROPDOWN absolute w-44 mt-2 bg-white border  border-gray-200 rounded-xl shadow-xl p-4 z-50 transition-all duration-300 ease-out
                            ${openDropdown === filter.name
                                ? "opacity-100 translate-y-0 pointer-events-auto"
                                : "opacity-0 -translate-y-3 pointer-events-none"
                            }
                        `}
                    >
                        {filter.options.map((option, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setOpenDropdown(null)
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-[#2a5660] hover:bg-[#f9f9f7] transition-colors"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
            
            {/* <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-[#f56d5e] text-white text-xs md:text-sm rounded-full shadow-md hover:bg-[#BF5842] hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 ease-in-out">
                <Config />
                <span>All Filters</span>
            </button> */}
        </div>
    )
}

export default Filters