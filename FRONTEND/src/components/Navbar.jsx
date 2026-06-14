import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import logo from "../assets/Logo.png"

 function ActionButton({role}) {

  const navigate = useNavigate()

  if(role === "owner" || role === "admin"){
    return (
      <button
        onClick={() => role === "owner"
          ? navigate("/host/dashboard")
          : navigate("/admin/dashboard")
        }
        className="flex items-center justify-center gap-2 px-5 py-2 bg-[#ffffff] text-gray-800 text-base font-medium rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 ease-in-out"
      >
        Dashbaord
        {/* Inline SVG for the Arrow Icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>
    )

  } else if(role === "user") {
    return null

  } else {
    return (
      <button onClick={() => navigate("/auth")} 
        className="SIGNUP ml-24 px-4 py-2 bg-[#f56d5e] text-white text-base rounded-full hover:bg-[#BF5842] hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 ease-in-out">
          Sign Up
      </button>
    )
  }
}

function NavBar() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const location = useLocation()
  
  const isActive = (path) => location.pathname === path

  const role = localStorage.getItem("userRole")

  return (
    <div className="relative w-full">
      {/* Main Navbar */}
      <div className="NAVBAR w-full h-16 bg-[#f9f9f7] text-black flex items-center justify-between px-4 md:px-8 relative z-50">
        
        {/* Logo */}
        <div className="LOGO w-50 md:w-50">
          <Link to="/">
            <img src={logo} alt="BookMyVenue" className="cursor-pointer w-full h-auto" />
          </Link>
        </div>

        {/* Desktop Nav Links (Hidden on Mobile) */}
        <div className="NAVLINKS hidden md:flex gap-8 text-sm">

          <div className="group relative">
            <Link to="/" className={`font-medium transition-all duration-300 ease-in-out ${
              isActive('/') ? 'text-[#2a5660]' : 'group-hover:text-[#2a5660]'}`}>
              Find Space
            </Link>
            <span className={`Underline absolute h-[4px] bg-[#2a5660] left-1/2 -translate-x-1/2 -bottom-1 transition-all duration-300 ease-in-out ${
              isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </div>

          {role === "owner" && 
          <div className="group relative">
            <Link to="/host" className={`font-medium transition-all duration-300 ease-in-out ${
              isActive('/host') ? 'text-gray-700' : 'hover:text-gray-700'}`}>
              Host a venue
            </Link>
            <span className={`Underline absolute h-[4px] bg-[#2a5660] left-1/2 -translate-x-1/2 -bottom-1 transition-all duration-300 ease-in-out ${
              isActive('/host') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </div>
          }
        </div>

        {/* Desktop User Actions (Hidden on Mobile) */}
        <div className={`USERACTIONS hidden md:flex gap-4 ${role === "user" ? "pl-44" : ""} `}>
          <ActionButton role={role}/>
        </div>

        {/* Mobile Hamburger Toggle (Visible only on Mobile) */}
        <div className="MOBILE_TOGGLE md:hidden flex items-center">
          <button onClick={toggleMenu} className="focus:outline-none p-2">
            {isMobileMenuOpen ? (
              // Close Icon
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Menu Icon
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div 
        className={`MOBILE_MENU absolute top-16 left-0 w-full bg-[#f9f9f7] flex flex-col items-center gap-6 py-8 border-t border-gray-200 z-40 md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "opacity-100 translate-y-0 shadow-lg" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <Link to="/" onClick={toggleMenu} className="font-medium text-lg active:text-[#2a5660] transition-colors">
          Find Space
        </Link>
        <Link to="/host" onClick={toggleMenu} className="font-medium text-lg active:text-[#2a5660] transition-colors">
          Host a venue
        </Link>
        <button className="SIGNUP w-11/12 max-w-xs px-4 py-3 mt-2 bg-[#f56d5e] text-white text-lg rounded-full hover:bg-[#BF5842] active:scale-95 cursor-pointer transition-all duration-300 ease-in-out">
          Sign Up
        </button>
      </div>
    </div>
  )
}

export default NavBar