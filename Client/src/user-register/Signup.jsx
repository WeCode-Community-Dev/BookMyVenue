import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import AXIOS_API from "../Api/api";
import OtpModal from "./OtpModal";

export default function Signup() {
  const [userName, setUserName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [data, setData] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("")

    try {
      const response = await AXIOS_API.post("/api/v1/register/signUp", {
        userName,
        number,
        email,
        password,
      });
      console.log("data", response);
      if (response.status === 200) {
        setData(response?.data?.user)
        setEmail("")
        setPassword("")
        setUserName("")
        setNumber("")
        setIsModal(true);
      }

      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      setError(error.response?.data?.message || "Registration failed");

      setIsLoading(false);
    }
  };

  

  return (
    <>
      <AuthLayout
        imageSrc="https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop"
        title="Reduce friction, prevent bad seats and protect customer joy"
        subtitle="Use Book My Venue to discover unique event spaces, compare venue options, manage reservations, and 
        create memorable experiences—all in one place."
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          See Book My Venue In Action
        </h1>
        <p className="text-slate-500 mb-8">
          See how Book My Venue can help you discover perfect spaces.
        </p>

        <form className="space-y-5" onSubmit={() => handleSubmit()}>
          {error && (
            <div
              className="p-3 mb-4 text-base text-center bg-rose-600 text-white  rounded-lg animate-fade-in"
              style={{ animationDuration: "0.3s" }}
            >
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Name
              </label>
              <input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                type="text"
                placeholder="First name"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-ticket-orange focus:ring-2 focus:ring-ticket-orange/20 transition-all outline-none text-slate-700 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Number
              </label>
              <input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                type="text"
                placeholder="Number"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-ticket-orange focus:ring-2 focus:ring-ticket-orange/20 transition-all outline-none text-slate-700 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-ticket-orange focus:ring-2 focus:ring-ticket-orange/20 transition-all outline-none text-slate-700 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-ticket-orange focus:ring-2 focus:ring-ticket-orange/20 transition-all outline-none text-slate-700 font-medium"
            />
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
              className="w-full bg-ticket-yellow hover:bg-ticket-yellow/90 text-slate-900 py-3.5 rounded-lg 
            font-bold transition-all shadow-[0_0_15px_rgba(255,193,7,0.2)] hover:shadow-[0_0_20px_rgba(255,193,7,0.4)] 
            mt-4 active:scale-[0.98]"
            >
              Continue →
            </button>
          )}
        </form>

        <p className="mt-8 text-center text-slate-500 font-medium text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-ticket-orange hover:underline font-bold"
          >
            Log in
          </Link>
        </p>
      </AuthLayout>
      {isModal && <OtpModal data={data} onClose={()=> setIsModal(false)}/>}
    </>
  );
}
