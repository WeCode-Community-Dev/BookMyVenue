import { useEffect } from "react";
import toast, {Toaster} from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useAuthForm } from "../hooks/useAuthForm";
import { Users, Store, ArrowRight, SpinnerOne } from "@mynaui/icons-react";
import Logo from "../assets/Logo.png";
import stock1 from "../assets/stock1.png";


const InputField = ({ label, name, type = "text", value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-bold text-gray-900 mb-1.5">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2b5155] focus:border-transparent transition-all bg-white"
    />
  </div>
);

const RoleButton = ({ isActive, onClick, icon: Icon, title, subtitle }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col cursor-pointer items-center justify-center p-5 border rounded-xl transition-all duration-200 ${
      isActive
        ? "border-[#2b5155] bg-slate-50 text-[#2b5155] shadow-sm ring-1 ring-[#2b5155]"
        : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
    }`}
  >
    <Icon className={`w-7 h-7 mb-2 ${isActive ? "text-[#2b5155]" : "text-gray-400"}`} />
    <span className={`font-bold text-sm ${isActive ? "text-gray-900" : "text-gray-700"}`}>
      {title}
    </span>
    <span className="text-xs mt-0.5">({subtitle})</span>
  </button>
);

const LeftPanel = () => (
  <div className="hidden lg:flex lg:w-1/2 relative">
    <img
      src={stock1}
      alt="Login Illustration"
      className="absolute w-full h-full object-cover opacity-90"
    />
    <div className="z-10 p-4 bottom-0 text-white absolute">
      <img src={Logo} alt="Logo" className="w-1/2 brightness-0 invert" />
      <h1 className="text-4xl font-bold mb-4">Spaces that Bring People Together</h1>
      <p className="text-lg">
        Join a Community of organizers and hosts <br />
        dedicated to creating memorable Experiences!
      </p>
    </div>
  </div>
);

// --- Main Page Component ---

export default function LoginPage() {
  const [SearchParams] = useSearchParams();
  useEffect(() => {
    const expired = SearchParams.get("expired");
    if (expired === "true") {
      toast.error("Session Expired. Please log in again.");
    }
  },[SearchParams])

  const {
    role, setRole, isLoginView, toggleView,
    formData, handleChange, error, isLoading, handleSubmit,
    successMessage
  } = useAuthForm();

  // Extracting conditional text makes the JSX below much easier to read
  const headerTitle = isLoginView ? "Log In to Your Account" : "Create Your Account";
  const headerSubtitle = isLoginView
    ? "Welcome back! Please enter your details."
    : "Join us and start creating unforgettable experiences!";
  const submitText = isLoginView ? "Log In" : "Join the Community";
  const footerText = isLoginView ? "Don't have an account? " : "Already have an account? ";
  const footerActionText = isLoginView ? "Sign Up" : "Log In";

  return (
    <div className="Login-Container flex justify-start h-screen overflow-hidden">
      <Toaster position="top-right" reverseOrder={false} />
      <LeftPanel />

      <div className="w-full lg:w-1/2 flex justify-center m-auto p-8 bg-white h-full overflow-y-auto">
        <div className="max-w-md w-full bg-white h-screen sm:p-8 sm:shadow-sm sm:border sm:border-gray-100 sm:rounded-2xl lg:p-0 lg:shadow-none lg:border-none">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{headerTitle}</h2>
            <p className="text-gray-500 font-medium">{headerSubtitle}</p>
          </div>

          {/* Role Selection */}
          {!isLoginView && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              <RoleButton
                isActive={role === "user"}
                onClick={() => setRole("user")}
                icon={Users}
                title="The User"
                subtitle="Guest"
              />
              <RoleButton
                isActive={role === "owner"}
                onClick={() => setRole("owner")}
                icon={Store}
                title="The Venue Owner"
                subtitle="Host"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg font-medium">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg font-medium">
              {successMessage}
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLoginView && (
              <InputField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
              />
            )}

            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#ff6660] cursor-pointer hover:bg-[#BF5842] text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors mt-8 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <SpinnerOne className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {submitText}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-8 pb-8 text-sm text-gray-600 font-medium">
            {footerText}
            <button
              type="button"
              className="font-bold text-[#2b5155] hover:underline cursor-pointer"
              onClick={toggleView}
            >
              {footerActionText}
            </button>
          </p>
          
        </div>
      </div>
    </div>
  );
}