import Link from 'next/link';
export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b px-8 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-600">BookMyVenue</Link>
      <div className="flex gap-4">
        <Link href="/venues" className="text-gray-600 hover:text-blue-600">Venues</Link>
        <Link href="/bookings" className="text-gray-600 hover:text-blue-600">Bookings</Link>
        <Link href="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
      </div>
    </nav>
  );
}