import Image from "next/image";
import { MoreVertical, Users } from "lucide-react";

type Booking = {
  id: number;
  avatar: string;
  customer: string;
  phone: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  guests: number;
  amount: string;
  status: "Confirmed" | "Pending" | "Cancelled";
};

const bookings: Booking[] = [
  {
    id: 1,
    avatar: "https://i.pravatar.cc/100?img=1",
    customer: "Anjali Sharma",
    phone: "+91 98765 43210",
    venue: "Lagoona Beach Resort",
    location: "Cherai, Kochi",
    date: "24 May 2025",
    time: "6:00 PM",
    guests: 120,
    amount: "₹21,600",
    status: "Confirmed",
  },
  {
    id: 2,
    avatar: "https://i.pravatar.cc/100?img=2",
    customer: "Rohit Menon",
    phone: "+91 91234 56789",
    venue: "The Garden Courtyard",
    location: "Kakkanad, Kochi",
    date: "25 May 2025",
    time: "11:00 AM",
    guests: 80,
    amount: "₹9,600",
    status: "Pending",
  },
  {
    id: 3,
    avatar: "https://i.pravatar.cc/100?img=3",
    customer: "Sneha Nair",
    phone: "+91 99887 66554",
    venue: "Silverline Banquets",
    location: "Edappally, Kochi",
    date: "26 May 2025",
    time: "7:00 PM",
    guests: 150,
    amount: "₹18,000",
    status: "Confirmed",
  },
  {
    id: 4,
    avatar: "https://i.pravatar.cc/100?img=4",
    customer: "Arjun Das",
    phone: "+91 88990 11223",
    venue: "Lagoona Beach Resort",
    location: "Cherai, Kochi",
    date: "27 May 2025",
    time: "5:00 PM",
    guests: 100,
    amount: "₹18,000",
    status: "Cancelled",
  },
];

export default function RecentBookings() {
  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <h2 className="text-[30px] font-semibold text-slate-900">
          Recent Bookings
        </h2>

        <button className="flex items-center gap-2 font-medium text-teal-600 hover:text-teal-700">
          View All Bookings
          <span>→</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b border-slate-200 text-left">
              <th className="px-5 py-4 text-sm font-medium text-slate-500">
                Customer
              </th>

              <th className="px-5 py-4 text-sm font-medium text-slate-500">
                Venue
              </th>

              <th className="px-5 py-4 text-sm font-medium text-slate-500">
                Date
              </th>

              <th className="px-5 py-4 text-sm font-medium text-slate-500">
                Guests
              </th>

              <th className="px-5 py-4 text-sm font-medium text-slate-500">
                Amount
              </th>

              <th className="px-5 py-4 text-sm font-medium text-slate-500">
                Status
              </th>

              <th className="px-5 py-4 text-sm font-medium text-slate-500 text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="border-b border-slate-100 last:border-0"
              >
                {/* Customer */}
                <td className="px-5 py-5">
                  <div className="flex items-center gap-3">
                    <Image
                      src={booking.avatar}
                      alt={booking.customer}
                      width={42}
                      height={42}
                      className="rounded-full object-cover"
                    />

                    <div>
                      <p className="font-medium text-slate-900">
                        {booking.customer}
                      </p>

                      <p className="text-sm text-slate-500">
                        {booking.phone}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Venue */}
                <td className="px-5 py-5">
                  <p className="font-medium text-slate-900">
                    {booking.venue}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {booking.location}
                  </p>
                </td>

                {/* Date */}
                <td className="px-5 py-5">
                  <p className="text-slate-900">
                    {booking.date}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {booking.time}
                  </p>
                </td>

                {/* Guests */}
                <td className="px-5 py-5">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Users size={15} />

                    <span>{booking.guests}</span>
                  </div>
                </td>

                {/* Amount */}
                <td className="px-5 py-5 font-medium text-slate-700">
                  {booking.amount}
                </td>

                {/* Status */}
                <td className="px-5 py-5">
                  <span
                    className={`inline-flex rounded-lg px-3 py-1 text-xs font-medium ${
                      booking.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "Pending"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>

                {/* Action */}
                <td className="px-5 py-5">
                  <div className="flex items-center justify-center gap-3">
                    <button className="rounded-lg border border-teal-500 px-4 py-2 text-sm font-medium text-teal-600 transition hover:bg-teal-50">
                      View Details
                    </button>

                    <button className="text-slate-500 hover:text-slate-700">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}