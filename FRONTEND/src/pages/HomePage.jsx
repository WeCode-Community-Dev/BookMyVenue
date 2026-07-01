import NavBar from "../components/Navbar";
import Filters from "../components/Filters";
import VenueGrid from "../components/VenueGrid";

export default function HomePage() {
    
    return (
        <>
            <NavBar />
            <div className="Hero-Section relative flex flex-col w-full h-screen bg-[#f4f4f2] bg-cover bg-center flex items-center justify-center">
                <HeroContent />
                <Searchbar />
                <Filters />
            </div>
            <VenueGrid />
        </>
    );
}

function HeroContent() {
    return (
        <div className="Hero-Content w-full overflow-hidden flex flex-col items-center justify-center text-center text-[#2a5660] px-4 md:px-8">
            <video
                className="absolute inset-0 w-full h-full object-cover z-0 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]"
                autoPlay
                loop
                muted
                playsInline
                poster="/poster.png"
            >
                <source src="/NewHeroVid1.webm" type="video/webm" />
            </video>
            <div className=" z-10 mx-auto">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
                    Find the Perfect Venue for Your Event.
                </h1>
                <p className="text-base md:text-xl lg:text-2xl mb-8 opacity-90">
                    Discover and book unique spaces for your next gathering, party, or meeting.
                </p>
            </div>
        </div>
    );
}

function Searchbar() {
    return (
        <div className="SEARCH-BAR z-50 flex w-[92%] md:w-full max-w-2xl mx-auto mt-4 md:mt-6">
            <input 
                type="text" 
                placeholder="Search for venues and Venue Types..." 
                className="w-full bg-[#eeeeee] h-12 md:h-16 shadow-2xl md:text-center text-sm md:text-lg px-3 md:px-4 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#AEAC9B] focus:border-transparent" 
            />
            <button 
                className="px-4 md:px-6 h-12 md:h-16 shrink-0 bg-[#f56d5e] text-white text-sm md:text-base font-medium rounded-r-full shadow-xl hover:bg-[#BF5842] hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 ease-in-out"
            >
                Search
            </button>
        </div>
    );
}