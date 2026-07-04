import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Later you'll call your backend API here

    navigate("/");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#faf7f5] px-4">
      <div className="w-full max-w-[450px] bg-white p-10 rounded-3xl shadow-lg text-center">
        <h1 className="text-[#4a1625] text-[38px] font-bold mb-2">
          Create Account
        </h1>

        <p className="text-gray-500 mb-8">
          Join BookMyVenue and start booking venues
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full p-3.5 border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:border-[#8b1e2d] focus:ring-4 focus:ring-[#8b1e2d]/15"
          />

          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-3.5 border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:border-[#8b1e2d] focus:ring-4 focus:ring-[#8b1e2d]/15"
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3.5 border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:border-[#8b1e2d] focus:ring-4 focus:ring-[#8b1e2d]/15"
          />

          <select
            required
            className="w-full p-3.5 border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:border-[#8b1e2d] focus:ring-4 focus:ring-[#8b1e2d]/15"
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="owner">Owner</option>
          </select>

          <button
            type="submit"
            className="w-full p-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-[#8b1e2d] to-[#4a1625] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            Register
          </button>
        </form>

        <p className="mt-5 text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#8b1e2d] font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register; 