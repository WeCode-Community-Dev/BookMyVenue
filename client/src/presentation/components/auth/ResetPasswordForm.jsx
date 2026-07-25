import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import { resetPassword } from "@/redux/slices/AuthSlice";
import { ROUTES } from "@/constants/routes";
import { ROLES } from "@/constants/Roles";
import {useSearchParams } from "react-router-dom";

const ResetPasswordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const role = searchParams.get("role");
  

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!token || !role) {
  toast.error("Invalid reset password link.");
  navigate(ROUTES.PUBLIC.LOGIN);
  return;
}

    

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await dispatch(
        resetPassword({
        
          token,
          role,
          password,
          confirmPassword,
          
        })
      ).unwrap();

      toast.success("Password reset successfully.");

      if (role === ROLES.ADMIN) {
        navigate(ROUTES.ADMIN.LOGIN);
      } else if (role === ROLES.VENDOR) {
        navigate(ROUTES.VENDOR.LOGIN);
      } else {
        navigate(ROUTES.PUBLIC.LOGIN);
      }

    } catch (error) {
      toast.error(error || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Reset Password
        </h2>

       

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6"
          required
        />

        <button
          type="submit"
          disabled={loading}
          
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;