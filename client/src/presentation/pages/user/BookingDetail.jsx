import Header from "@/presentation/components/common/Header";
import UserSidebar from "@/presentation/components/user/UserSidebar";
import { ArrowLeft, Calendar, Users, CreditCard, MapPin } from "lucide-react";

const booking = {
  id: "BKM123456",
  status: "Upcoming",
  bookingDate: "20 May 2024",
  eventDate: "15 July 2024",
  guests: 200,
  amount: 125000,
  paymentStatus: "Paid",

  venue: {
    name: "Royal Garden Palace",
    city: "Kozhikode",
    state: "Kerala",

    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",

    description:
      "A premium event venue perfect for weddings, receptions and corporate events. Spacious halls with elegant ambience."
  }
};

const BookingDetails = () => {

    return (

        <>
            <Header />

            <div className="flex">

                <UserSidebar />

                <main className="flex-1 bg-gray-50 p-10">

                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-gray-500 mb-5"
                    >
                        <ArrowLeft size={18} />

                        Back to Booking History
                    </button>

                    <div className="bg-white rounded-3xl shadow-md p-8">

                        {/* Header */}

                        <div className="flex justify-between">

                            <div>

                                <h1 className="text-3xl font-bold">
                                    Booking Details
                                </h1>

                                <p className="text-gray-500 mt-2">
                                    View your booking information and details
                                </p>

                            </div>

                            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full h-fit">
                                {booking.status}
                            </span>

                        </div>

                        {/* Card */}

                        <div className="grid grid-cols-3 gap-8 mt-10 border rounded-3xl p-5">

                            {/* Image */}

                            <img
                                src={booking.venue.image}
                                className="rounded-2xl h-full object-cover"
                            />

                            {/* Booking */}

                            <div>

                                <h2 className="font-bold text-xl mb-6">
                                    Booking Information
                                </h2>

                                <div className="space-y-5">

                                    <InfoRow
                                        icon={<CreditCard size={18} />}
                                        label="Booking ID"
                                        value={booking.id}
                                    />

                                    <InfoRow
                                        icon={<Calendar size={18} />}
                                        label="Booking Date"
                                        value={booking.bookingDate}
                                    />

                                    <InfoRow
                                        icon={<Calendar size={18} />}
                                        label="Event Date"
                                        value={booking.eventDate}
                                    />

                                    <InfoRow
                                        icon={<Users size={18} />}
                                        label="Guests"
                                        value={`${booking.guests} Guests`}
                                    />

                                    <InfoRow
                                        icon={<CreditCard size={18} />}
                                        label="Amount Paid"
                                        value={`₹${booking.amount.toLocaleString()}`}
                                    />

                                    <InfoRow
                                        label="Payment Status"
                                        value={booking.paymentStatus}
                                    />

                                    <InfoRow
                                        label="Booking Status"
                                        value={booking.status}
                                    />

                                </div>

                            </div>

                            {/* Venue */}

                            <div>

                                <h2 className="font-bold text-xl mb-6">
                                    Venue Details
                                </h2>

                                <div className="flex gap-2">

                                    <MapPin size={18} />

                                    <div>

                                        <h3 className="font-semibold">
                                            {booking.venue.name}
                                        </h3>

                                        <p className="text-gray-500">
                                            {booking.venue.city}, {booking.venue.state}
                                        </p>

                                    </div>

                                </div>

                                <img
                                    className="rounded-xl mt-5"
                                    src="https://placehold.co/500x180?text=Map"
                                />

                                <div className="mt-5">

                                    <h3 className="font-semibold mb-2">
                                        About Venue
                                    </h3>

                                    <p className="text-gray-500">
                                        {booking.venue.description}
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* Buttons */}

                        <div className="flex justify-between mt-8">

                            <button
                                className="border rounded-xl px-10 py-3 font-semibold hover:bg-gray-50"
                            >
                                Download Invoice
                            </button>

                            <button
                                className="border border-red-500 text-red-500 rounded-xl px-10 py-3 font-semibold hover:bg-red-50"
                            >
                                Cancel Booking
                            </button>

                        </div>

                    </div>

                </main>

            </div>

        </>

    );
};

function InfoRow({ icon, label, value }) {

    return (

        <div className="flex justify-between border-b pb-3">

            <div className="flex gap-2 items-center text-gray-500">

                {icon}

                {label}

            </div>

            <span className="font-semibold">
                {value}
            </span>

        </div>

    );
}

export default BookingDetails;