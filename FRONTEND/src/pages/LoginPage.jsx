import Logo from "../assets/Logo.png"
import { useState } from "react";
import { Users, Store, ArrowRight } from "@mynaui/icons-react";
 

function LoginPage() {
  const [role, setRole] = useState('organizer');
  return (
    <div className="Login-Container flex justify-start h-screen overflow-hidden">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img src="./src/assets/stock1.png" 
          alt="Login Illustration" 
          className="absolute w-full h-full object-cover opacity-90"
        />
        
        <div className="z-10 p-4 bottom-0 text-white absolute">
          <img src={Logo} alt="Logo" className="w-1/2 brightness-0 invert" />
          <h1 className="text-4xl font-bold mb-4">Spaces that Bring People Together</h1>
          <p className="text-lg">Join a Community of organizers and hosts <br />
          dedicated to creating memorable Experiences! </p> 
        </div>
      </div>
      

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 lg:pl-32 flex m-auto p-8 bg-white h-full overflow-y-auto">
        <div className="max-w-md w-full bg-white sm:p-8 sm:shadow-sm sm:border sm:border-gray-100 sm:rounded-2xl lg:p-0 lg:shadow-none lg:border-none">
          
          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Create an account</h2>
            <p className="text-gray-500 font-medium">Let's get started by selecting your role.</p>
          </div>

          {/* Role Selection Toggle */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Organizer Button */}
            <button
              type="button"
              onClick={() => setRole('organizer')}
              className={`flex flex-col items-center justify-center p-5 border rounded-xl transition-all duration-200 ${
                role === 'organizer'
                  ? 'border-[#2b5155] bg-slate-50 text-[#2b5155] shadow-sm ring-1 ring-[#2b5155]'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Users className={`w-7 h-7 mb-2 ${role === 'organizer' ? 'text-[#2b5155]' : 'text-gray-400'}`} />
              <span className={`font-bold text-sm ${role === 'organizer' ? 'text-gray-900' : 'text-gray-700'}`}>
                The Organizer
              </span>
              <span className="text-xs mt-0.5">(Guest)</span>
            </button>

            {/* Venue Owner Button */}
            <button
              type="button"
              onClick={() => setRole('owner')}
              className={`flex flex-col items-center justify-center p-5 border rounded-xl transition-all duration-200 ${
                role === 'owner'
                  ? 'border-[#2b5155] bg-slate-50 text-[#2b5155] shadow-sm ring-1 ring-[#2b5155]'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Store className={`w-7 h-7 mb-2 ${role === 'owner' ? 'text-[#2b5155]' : 'text-gray-400'}`} />
              <span className={`font-bold text-sm ${role === 'owner' ? 'text-gray-900' : 'text-gray-700'}`}>
                The Venue Owner
              </span>
              <span className="text-xs mt-0.5">(Host)</span>
            </button>
          </div>

          {/* Input Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2b5155] focus:border-transparent transition-all bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2b5155] focus:border-transparent transition-all bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="********"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2b5155] focus:border-transparent transition-all bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">Confirm Password</label>
              <input
                type="password"
                placeholder="********"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2b5155] focus:border-transparent transition-all bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#2b5155] hover:bg-[#203f42] text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors mt-8 shadow-md"
            >
              Join the Community
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center mt-8 pb-8 text-sm text-gray-600 font-medium">
            Already have an account?{' '}
            <a href="#" className="font-bold text-[#2b5155] hover:underline">
              Log In
            </a>
          </p>
          
        </div>
      </div>
    </div>
  )
}

export default LoginPage