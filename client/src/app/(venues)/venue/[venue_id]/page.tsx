// src/app/(venues)/venue/[slug]/page.tsx
import { MapPin, Users, ShieldCheck, Maximize } from "lucide-react";
import { BookingCard } from "@/src/components/venues/booking-card";

interface VenuePageProps {
    params: Promise<{ slug: string }>;
}

export default async function VenuePage({ params }: VenuePageProps) {
    const venueData = {
        id: "venue-db-101",
        title: "The Industrial Glasshouse & Garden",
        slug: "industrial-house",
        imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1600",
        description: "A stunning architecture masterwork combining exposed steel framing structures with raw floor-to-ceiling clean structural glass layouts. Flooded with rich natural sunlight elements by day and warm starry environments by night.",
        location: "Downtown Chicago, IL",
        pricePerHour: 175,
        capacity: 120,
        squareFeet: "3,500",
        amenities: ["High-speed Fiber WiFi", "Premium sound system", "Catering kitchen", "Valet parking"]
    };

    return (
        <div className="w-full pb-20 bg-gray-50/50">
            <div
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('${venueData.imageUrl}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                className="w-full h-[450px] md:h-[550px] flex flex-col justify-end pb-24 md:pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-sm max-w-4xl">
                        {venueData.title}
                    </h1>
                    <div className="flex items-center gap-2 text-sm font-semibold mt-3 text-gray-200">
                        <MapPin className="h-4 w-4 text-white" />
                        <span>{venueData.location}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-16 md:not-prose relative z-10">
                <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-xl shadow-gray-200/50">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-8">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                                    <Users className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400">Capacity</p>
                                        <p className="text-sm font-bold text-black">Up to {venueData.capacity} people</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                                    <Maximize className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400">Space Area</p>
                                        <p className="text-sm font-bold text-black">{venueData.squareFeet} sq. ft</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl col-span-2 sm:col-span-1">
                                    <ShieldCheck className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400">Insurance</p>
                                        <p className="text-sm font-bold text-black">Verified Protection</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-black mb-3">About this space</h3>
                                <p className="text-gray-600 leading-relaxed text-sm md:text-base font-medium">
                                    {venueData.description}
                                </p>
                            </div>

                            <div className="border-t border-gray-100 pt-8">
                                <h3 className="text-xl font-bold text-black mb-4">What this venue offers</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-semibold text-gray-700">
                                    {venueData.amenities.map((amenity, idx) => (
                                        <div key={idx} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                                            <div className="h-2 w-2 rounded-full bg-black shrink-0" />
                                            <span>{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        <div className="lg:col-span-1 lg:sticky lg:top-28">
                            <BookingCard pricePerHour={venueData.pricePerHour} venueId={venueData.id} />
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}