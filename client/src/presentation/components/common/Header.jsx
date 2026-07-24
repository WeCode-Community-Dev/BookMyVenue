import { Heart, User } from 'lucide-react'
import Logo from '@/assets/images/logo.jpeg'

const Header = () => {
  return (
    <div>
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-500 p-1 flex items-center justify-center">
              <img
                src={Logo}
                alt="Book My Venue Logo"
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            <h1 className="text-2xl font-bold">Book My Venue</h1>
          </div>

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