import { useNavigate } from 'react-router-dom'

export function BookingHeader() {
  const navigate = useNavigate()

  return (
    <header className="py-8">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <button
          onClick={() => navigate('/my-bookings')}
          className="inline-flex items-center gap-1 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          My Bookings
        </button>
        <span className="text-zinc-400">/</span>
        <span className="font-medium text-zinc-900 dark:text-zinc-100">Booking Details</span>
      </div>
    </header>
  )
}