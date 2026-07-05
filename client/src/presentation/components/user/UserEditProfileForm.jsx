import { useState } from "react";

const UserEditProfileForm = ({
  user,
  onSave,
  onCancel,
  onRequestEmailOtp,
  onVerifyOtp,
  onResendOtp,
}) => {
  const [formData, setFormData] = useState({
    name: user.fullName || "",
    email: user.email || "",
    phone: user.phone || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const [showEmailSection, setShowEmailSection] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async () => {
    if (!newEmail.trim()) return;

    setOtpLoading(true);

    const result = await onRequestEmailOtp(newEmail);

    setOtpLoading(false);

    if (result.success) {
      setOtpSent(true);
    } else {
      setOtpSent(false);
    }
  };

  const [otp, setOtp] = useState("");

  const handleVerifyOtp = async () => {
    const result = await onVerifyOtp(otp);

    if (!result.success) {
      setOtpError(result.message || "Invalid OTP");
      return;
    }

    setOtpError("");
  };

  const handleResendOtp = async () => {
    setOtpLoading(true);

    await onResendOtp();

    setOtpLoading(false);
  };

  const [otpError, setOtpError] = useState("");

  return (
    <div className="bg-white rounded-3xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-8">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Email */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>

          <div className="flex gap-3">
            <input
              type="email"
              value={formData.email}
              readOnly
              className="flex-1 rounded-xl border border-gray-300 bg-gray-100 px-4 py-3"
            />

            <button
              type="button"
              onClick={() => setShowEmailSection(!showEmailSection)}
              className="rounded-xl border border-amber-500 px-5 py-3 text-amber-600 hover:bg-amber-50"
            >
              Change Email
            </button>
          </div>

          {showEmailSection && (
            <div className="space-y-4 rounded-xl border border-gray-200 bg-slate-50 p-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  New Email
                </label>

                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                />
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading}
                className="rounded-xl bg-amber-500 px-6 py-3 text-white hover:bg-amber-600 disabled:opacity-50"
              >
                {otpLoading ? "Sending..." : "Send OTP"}
              </button>
              {otpSent && (
                <div className="mt-6 space-y-4 border-t pt-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Enter OTP
                    </label>

                    <input
                      type="text"
                      value={otp}
                      maxLength={6}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        setOtpError("");
                      }}
                      placeholder="Enter 6 digit OTP"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3"
                    />

                    {otpError && (
                      <p className="mt-2 text-sm text-red-500">{otpError}</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700"
                    >
                      Verify OTP
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="rounded-xl border border-gray-300 px-6 py-3 hover:bg-gray-100"
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Phone Number
          </label>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-xl bg-amber-500 px-6 py-3 font-medium text-white hover:bg-amber-600 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserEditProfileForm;
