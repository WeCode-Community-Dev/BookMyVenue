import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "@/redux/slices/UserProfileSlice";
import { toast } from "react-hot-toast";
import PasswordStrength from "./PasswordStrength";

const PasswordField = ({ label, name, value, show, setShow, onChange }) => {
  return (
    <div>
      <label className="block mb-2 font-medium text-gray-700">{label}</label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-amber-500"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

const ChangePasswordForm = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.userProfile);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const message = await dispatch(changePassword(formData)).unwrap();

      toast.success(message);

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border p-8 space-y-6"
    >
      <PasswordField
        label="Current Password"
        name="currentPassword"
        value={formData.currentPassword}
        show={showCurrent}
        setShow={setShowCurrent}
        onChange={handleChange}
      />

      <PasswordField
        label="New Password"
        name="newPassword"
        value={formData.newPassword}
        show={showNew}
        setShow={setShowNew}
        onChange={handleChange}
      />
      <PasswordStrength password={formData.newPassword} />

      <PasswordField
        label="Confirm Password"
        name="confirmPassword"
        value={formData.confirmPassword}
        show={showConfirm}
        setShow={setShowConfirm}
        onChange={handleChange}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2"
      >
        <Lock size={18} />

        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
};

export default ChangePasswordForm;
