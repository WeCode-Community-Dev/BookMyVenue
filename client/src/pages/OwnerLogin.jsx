import { useNavigate, Link } from "react-router-dom";
import { MapPin } from "lucide-react";
function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // later: API login logic goes here
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf7f5] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
         

<div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-[#4a1625] flex items-center justify-center">
  <MapPin size={24} className="text-white" />
</div>

          <h1 className="text-3xl font-semibold">
            BookMy<span className="text-[#8b1e2d]">Venue</span>
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-full p-1 mb-8">
            <button className="flex-1 py-2 rounded-full bg-white shadow-sm font-medium">
              Sign In
            </button>

            <Link
              to="/owner/register-venue"
              className="flex-1 py-2 text-center text-gray-500 font-medium"
            >
              Create Account
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-left text-sm mb-2">
                Email
              </label>

              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#8b1e2d] focus:ring-4 focus:ring-[#8b1e2d]/15"
              />
            </div>

            <div>
              <label className="block text-left text-sm mb-2">
                Password
              </label>

              <input
                type="password"
                required
                placeholder="Enter your password"
                className="w-full p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#8b1e2d] focus:ring-4 focus:ring-[#8b1e2d]/15"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-red-600 to-[#4a1625] hover:shadow-lg transition"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-1 border-t"></div>
          </div>

          {/* Google Button */}
          <button className="w-full border border-gray-200 rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-gray-50">
            <span>🔵</span>
            Continue with Google
          </button>

          <p className="text-xs text-gray-400 text-center mt-6">
            By continuing you agree to our community guidelines
          </p>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            to="/home"
            className="text-gray-500 hover:text-[#8b1e2d]"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login; 