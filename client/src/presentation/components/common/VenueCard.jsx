export default function VenueCard({venue}){
return (
    <div className="bg-white border rounded-3xl overflow-hidden hover:shadow-xl transition">
        <div className="relative">
            <img
                src={venue.image}
                className="h-64 w-full object-cover"
            />
            <button className="absolute right-4 top-4 bg-white rounded-full p-3">
                🤍
            </button>
            <span className="absolute bottom-4 left-4 bg-amber-500 px-4 py-2 rounded-full font-semibold">
                {venue.type}
            </span>
        </div>
        <div className="p-6">
            <p className="text-amber-500">
                ⭐ {venue.rating}
                <span className="text-gray-500">
                ({venue.reviews} reviews)
                </span>
            </p>
            <h2 className="text-xl font-bold mt-3 ">{venue.name}</h2>
            <p className="text-gray-500 mt-2">
                📍 {venue.location}
            </p>
            <div className="flex gap-2 mt-4">
                {venue.amenities.map((item,i)=>(
                    <span 
                        key={i}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                        {item}
                    </span>
                ))}
            </div>
            <hr className="my-5"/>
            <div className="flex justify-between">
                <div>
                    <p className="text-gray-500">Starting from</p>
                    <b>{venue.price}/day</b>
                </div>
                <div>
                    <p className="text-gray-500">Capacity</p>
                    <b>{venue.capacity}</b>
                </div>
            </div>
        </div>
    </div>
)}