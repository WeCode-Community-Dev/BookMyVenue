import Filters from "../components/Filters"

function HomePage() {

    const HeroContent = (
        <div className="Hero-Content text-center text-[#2a5660]">
            <h1 className="text-4xl md:text-3xl font-bold mb-4">Find the Perfect Venue for Your Event.</h1>
            <p className="text-lg md:text-2xl mb-8">Discover and book unique spaces for your next gathering, party, or meeting.</p>
        </div>
    )

    const Searchbar = (
        <div className="SEARCH-BAR flex w-full max-w-2xl mx-auto mt-4">
            <input type="text" placeholder="Search for venues and Venue Types..." className="w-full h-16 shadow-xl text-center text-lg px-4 py-3 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#AEAC9B] focus:border-transparent" />
            <button className="px-6 py-3 bg-[#f56d5e] text-white text-base rounded-r-full shadow-xl hover:bg-[#BF5842] hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 ease-in-out">Search</button>
        </div>
    )

    return (
        <div className="Hero-Section flex flex-col w-full h-screen bg-[#f4f4f2] bg-cover bg-center flex items-center justify-center">
            {HeroContent}
            {Searchbar}
            <Filters/>
        </div>
    )
}

export default HomePage