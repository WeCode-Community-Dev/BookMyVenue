import React, { useState, useRef } from "react";
import AXIOS_API from "../Api/api";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate } from "react-router-dom";

const OtpModal = ({ onClose, data }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (isNaN(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    setIsLoading(true);

    try {
      const otpResponse = await AXIOS_API.post("/api/v1/register/verify", {
        email: data.email,
        otp: otpCode,
      });

      if (otpResponse.status === 200) {
        console.log("verified..");

        navigate("/login", { replace: true });

        onClose();
      }

      setIsLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-opacity">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-8 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Verify your account
          </h2>
          <p className="text-slate-500 text-sm">
            We've sent a 4-digit verification code to your email address.
          </p>
        </div>
        {error && (
          <div
            className="p-3 mb-4 text-base text-center bg-rose-600 text-white  rounded-lg animate-fade-in"
            style={{ animationDuration: "0.3s" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3 sm:gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-semibold text-slate-800 
                           bg-white border border-slate-200 rounded-xl shadow-sm
                           focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 focus:outline-none 
                           transition-all"
              />
            ))}
          </div>

          {isLoading ? (
            <button
              className="flex items-center justify-center w-32 h-10 bg-ticket-yellow hover:bg-ticket-yellow/90
                         text-slate-900 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(255,193,7,0.2)] 
                         hover:shadow-[0_0_20px_rgba(255,193,7,0.4)]"
            >
              <DotLottieReact
                className="w-32 h-32 brightness-0"
                src="https://lottie.host/07edc8d8-86af-40f2-ba5b-fbc869fbfded/YTDgtXR0cO.lottie"
                loop
                autoplay
              />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              type="submit"
              className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-slate-900 rounded-lg py-3.5 
                       font-bold transition-colors shadow-sm mt-4 flex items-center justify-center gap-2"
            >
              Verify & Continue <span aria-hidden="true">&rarr;</span>
            </button>
          )}
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-slate-500">Didn't receive the code? </span>
          <button
            type="button"
            className="font-bold text-[#FFC107] hover:text-[#FFB300] transition-colors"
          >
            Resend
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
