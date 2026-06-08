import Link from 'next/link';
export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-50 border-r min-h-screen p-4">
      <ul className="space-y-2">
        <li><Link href="/dashboard" className="block p-2 rounded hover:bg-gray-100">Dashboard</Link></li>
        <li><Link href="/venues" className="block p-2 rounded hover:bg-gray-100">Venues</Link></li>
        <li><Link href="/bookings" className="block p-2 rounded hover:bg-gray-100">Bookings</Link></li>
      </ul>
    </aside>
  );
}