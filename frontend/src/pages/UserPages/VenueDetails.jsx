import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVenueById } from "../../services/venue.service.js";
import { ArrowLeft, Users, MapPin, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function VenueDetails() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadVenue = async () => {
            try {
                const response = await getVenueById(id);
                setVenue(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadVenue();
    }, [id]);

    if (loading) return <p>Loading...</p>;

    if (!venue) return <p>Venue not found</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-4">

            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="mb-2 text-gray-600 hover:text-black"
            >
                <ArrowLeft size={22} />
            </button>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-4xl font-bold">
                    {venue.name}
                </h1>
            </div>

            {/* Single Card */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_12px_32px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_15px_40px_rgba(15,23,42,0.12)]">

                <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-10">

                    {/* LEFT */}
                    <div>

                        <img
                            src={venue.images?.[0]?.url}
                            alt={venue.name}
                            className="w-full h-72 rounded-xl object-cover"
                        />

                        <div className="mt-6">
                            <h2 className="font-semibold text-xl mb-2">
                                Description
                            </h2>

                            <p className="text-gray-600">
                                {venue.description}
                            </p>
                        </div>

                        <div className="mt-8">
                            <div className="flex items-center gap-2 mb-3">
                                <MapPin size={20} className="text-red-500" />
                                <h2 className="font-semibold text-xl">
                                    Address
                                </h2>
                            </div>

                            <div className="text-gray-600">
                                <p>{venue.addressLine}</p>
                                <p>{venue.state} - {venue.pincode}</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col h-full">

                        <h2 className="text-3xl font-bold text-green-600">
                            ₹{venue.basePrice.toLocaleString()}
                        </h2>

                        <div className="mt-8">
                            <div className="flex items-center gap-2 mb-3">
                                <Users size={20} className="text-blue-500" />
                                <h3 className="font-semibold text-lg">
                                    Capacity
                                </h3>
                            </div>

                            <p className="text-gray-600">
                                {venue.capacity} Guests
                            </p>
                        </div>

                        <div className="mt-8">
                            <div className="flex items-center gap-2 mb-3">
                                <Building2 size={20} className="text-green-500" />
                                <h3 className="font-semibold text-lg">
                                    Facilities
                                </h3>
                            </div>

                            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-gray-600">
                                {venue.amenities.map((amenity) => (
                                    <li
                                        key={amenity._id}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="text-green-600">✓</span>
                                        <span>{amenity.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button className="w-full mt-auto bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700">
                            Proceed To Booking
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}