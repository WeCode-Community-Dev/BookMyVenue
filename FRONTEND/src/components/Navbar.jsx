import { Link } from "react-router-dom"
import logo from "../assets/Logo.png"

function NavBar() {
    return (
        <div className="NAVBAR w-full h-16 bg-[#f9f9f7] text-black flex items-center justify-between px-8">
      <div className="LOGO w-50">
        <Link to="/">
          <img src={logo} alt="BookMyVenue" className="cursor-pointer" />
        </Link>
      </div>
      <div className="NAVLINKS flex gap-8 text-sm">
        <div className="group relative">
          <Link to="/" className="font-medium group-hover:text-[#2a5660] transition-all duration-300 ease-in-out">Find Space</Link>
          <span className="Underline absolute w-0 h-[4px] bg-[#2a5660] left-1/2 -translate-x-1/2 -bottom-1 transition-all duration-300 ease-in-out group-hover:w-full"></span>
        </div>
        <div className="group relative">
          <Link to="/" className="font-medium hover:text-gray-700">Host a venue</Link>
          <span className="Underline absolute w-0 h-[4px] bg-[#2a5660] left-1/2 -translate-x-1/2 -bottom-1 transition-all duration-300 ease-in-out group-hover:w-full"></span>
        </div>
      </div>
      <div className="USERACTIONS flex gap-4">
        <button className="SIGNUP px-4 py-2 ml-18 bg-[#f56d5e] text-white text-base rounded-full hover:bg-[#BF5842] hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 ease-in-out">Sign Up</button>
      </div>
    </div>
    )
}

export default NavBar