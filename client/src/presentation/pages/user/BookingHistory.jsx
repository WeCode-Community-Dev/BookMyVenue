import Header from "@/presentation/components/common/Header";
import UserSidebar from "@/presentation/components/user/UserSidebar";
import BookingHistoryCard from "@/presentation/components/user/BookingHistoryCard";

const bookings = [
  {
    id: 1,
    venueName: "Royal Garden Palace",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
    location: "Kozhikode, Kerala",
    bookingDate: "20 May 2024",
    guests: 200,
    amount: 125000,
    status: "Upcoming",
  },
  {
    id: 2,
    venueName: "Green Valley Resort",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    location: "Kozhikode, Kerala",
    bookingDate: "10 Mar 2024",
    guests: 150,
    amount: 85000,
    status: "Completed",
  },
  {
    id: 3,
    venueName: "Sunrise Convention Center",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865",
    location: "Kozhikode, Kerala",
    bookingDate: "05 Jan 2024",
    guests: 100,
    amount: 75000,
    status: "Cancelled",
  },
];

const BookingHistory = () => {
  return (
    <>
      <Header />

      <div className="flex">
        <UserSidebar />

        <main className="flex-1 bg-gray-50 p-10">
          <div className="bg-white rounded-3xl shadow-md p-8">

            <div className="flex justify-between items-start mb-8">

              <div>
                <h1 className="text-3xl font-bold">
                  Booking History
                </h1>

                <p className="text-gray-500 mt-2">
                  View your past and upcoming bookings
                </p>
              </div>

              <select className="border rounded-xl px-4 py-2">
                <option>All Bookings</option>
                <option>Upcoming</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>

            </div>

            <div className="space-y-5">
              {bookings.map((booking) => (
                <BookingHistoryCard
                  key={booking.id}
                  booking={booking}
                />
              ))}
            </div>

            <p className="mt-8 text-gray-500">
              Showing 1 to {bookings.length} of {bookings.length} bookings
            </p>

          </div>
        </main>
      </div>
    </>
  );
};

export default BookingHistory;