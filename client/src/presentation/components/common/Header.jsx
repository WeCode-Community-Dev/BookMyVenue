import { Heart, User } from 'lucide-react'

const Header = () => {
  return (
    <div>
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 text-white w-12 h-12 rounded-xl flex items-center justify-center">
              🏛️
            </div>
            <h1 className="text-2xl font-bold">Book My Venue</h1>
          </div>

          <nav className="hidden md:flex items-center gap-10 text-gray-600">
            <a href="/">Explore Venues</a>
            <a href="/">Weddings</a>
            <a href="/">Corporate Events</a>
            <a href="/">List Your Venue</a>
          </nav>

          <div className="flex items-center gap-4">
            <Heart className="w-5 h-5" />

            <button className="border rounded-xl px-6 py-2 flex items-center gap-2">
              <User size={18} />
              Sign In
            </button>

            <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-xl font-medium">
              Get Started
            </button>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header
