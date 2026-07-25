import { Heart, User, ChevronDown, LogOut } from 'lucide-react'
import { useState } from 'react'
import Logo from '@/assets/images/logo.jpeg'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '@/redux/slices/AuthSlice'
import { ROLES } from '@/constants/Roles'
import toast from 'react-hot-toast'
// import { logout } from '@/redux/slices/authSlice'

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  const [open, setOpen] = useState(false)
  const role = user?.role === "customer" ? ROLES.USER : ROLES.VENDOR

  const handleLogout = async() => {
    try {
      await dispatch(logout({role})).unwrap()
      toast.success(`${role} logged out successfully`)
    } catch (error) {
      toast.error(error)
    }
  }

  return (
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
          <Heart className="w-5 h-5 cursor-pointer" />

          {!user ? (
            <>
              <button
                className="border rounded-xl px-6 py-2 flex items-center gap-2"
                onClick={() => navigate(ROUTES.PUBLIC.LOGIN)}
              >
                <User size={18} />
                Sign In
              </button>

              <button
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-xl font-medium"
                onClick={() => navigate(ROUTES.PUBLIC.REGISTER)}
              >
                Get Started
              </button>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 border rounded-xl px-4 py-2 hover:bg-gray-100"
              >
                <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <span className="font-medium">{user.name}</span>

                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    open ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border overflow-hidden z-50">
                  <button
                    onClick={() => {
                      setOpen(false)
                      navigate(ROUTES.USER.PROFILE)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <User size={18} />
                    Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header