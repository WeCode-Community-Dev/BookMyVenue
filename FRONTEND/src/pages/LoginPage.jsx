import Logo from "../assets/Logo.png"
import { useAuthForm } from "../hooks/useAuthForm";
import { Users, Store, ArrowRight, SpinnerOne } from "@mynaui/icons-react";

const LeftPanel = () => (
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
)

function LoginPage() {
  const {
    role, setRole, isLoginView, toggleView, 
    formData, handleChange, error, isLoading, handleSubmit,
    successMessage
  } = useAuthForm();

  return (
    <div className="Login-Container flex justify-start h-screen overflow-hidden">
      
      <LeftPanel />
      
      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex justify-center m-auto p-8 bg-white h-full overflow-y-auto">
        <div className="max-w-md w-full bg-white h-screen sm:p-8 sm:shadow-sm sm:border sm:border-gray-100 sm:rounded-2xl lg:p-0 lg:shadow-none lg:border-none">
          
          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{
              isLoginView ? "Log In to Your Account" : "Create Your Account"
              }</h2>
            <p className="text-gray-500 font-medium">{
              isLoginView ? "Welcome back! Please enter your details." : "Join us and start creating unforgettable experiences!"
              }</p>
          </div>

          {/* Role Selection Toggle */}
          {!isLoginView && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* user Button */}
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`flex flex-col items-center justify-center p-5 border rounded-xl transition-all duration-200 ${
                  role === 'user'
                    ? 'border-[#2b5155] bg-slate-50 text-[#2b5155] shadow-sm ring-1 ring-[#2b5155]'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Users className={`w-7 h-7 mb-2 ${role === 'user' ? 'text-[#2b5155]' : 'text-gray-400'}`} />
                <span className={`font-bold text-sm ${role === 'user' ? 'text-gray-900' : 'text-gray-700'}`}>
                  The user
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
          )}

          {/* Form Error Message Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg font-medium">
              {error}
            </div>
          )}

          {/* Input Form */}
          <form className="space-y-5 " onSubmit={handleSubmit}>
            {!isLoginView && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2b5155] focus:border-transparent transition-all bg-white"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2b5155] focus:border-transparent transition-all bg-white"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                placeholder="********"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2b5155] focus:border-transparent transition-all bg-white"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#ff6660] hover:bg-[#BF5842] text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors mt-8 shadow-md"
              disabled={isLoading}
            >
              {isLoading ? (
                <SpinnerOne className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {isLoginView ? 'Log In' : 'Join the Community'}
                  <ArrowRight className="w-4 h-4" />
                </> 
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center mt-8 pb-8 text-sm text-gray-600 font-medium">
            {isLoginView ? "Don't have an account? " : "Already have an account? "}
            <a href="#" className="font-bold text-[#2b5155] hover:underline" onClick={toggleView} >
              {isLoginView ? 'Sign Up' : "Log In"}
            </a>
          </p>
          
        </div>
      </div>
    </div>
  )
}

export default LoginPage