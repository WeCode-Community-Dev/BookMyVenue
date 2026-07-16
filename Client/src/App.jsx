import React, { useState } from "react";
import {
  Calendar,
  Home,
  Users,
  ChevronDown,
  Star,
  KeyRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "./assets/logo.png";
import useAuth from "./Auth/useAuth";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-screen w-full relative font-sans overflow-hidden flex flex-col bg-slate-900">
      <div
        className="absolute inset-0 z-0 animate-fade-in"
        style={{ animationDuration: "7s" }}
      >
        <img
          src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2000&auto=format&fit=crop"
          alt="Cabin in nature"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 mix-blend-multiply"></div>
      </div>

      <div
        className="w-full absolute top-0 left-0 right-0 z-30 px-4 md:px-8 pt-6 animate-fade-in-up"
        style={{ opacity: 0 }}
      >
        <nav className="flex items-center justify-between px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md p-1">
              <img
                src={logo}
                alt=""
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML =
                    '<span class="text-ticket-orange font-bold text-xl">TS</span>';
                }}
              />
            </div>
            <span className="text-white text-xl md:text-2xl font-bold tracking-tight">
              Book My Venue
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-white/90 text-base font-medium">
            <Link
              to={"/"}
              href="#"
              className="transition-opacity hover:opacity-75"
            >
              Home
            </Link>
            <Link
              to={"/venues"}
              className="transition-opacity hover:opacity-75"
            >
              Venues
            </Link>
            {hasRole(["admin", "organizer"]) && (
              <Link
                to={"/dashboard"}
                className="transition-opacity hover:opacity-75"
              >
                Dashboard
              </Link>
            )}
            <Link href="#" className="transition-opacity hover:opacity-75">
              Contact
            </Link>
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <div
                onClick={() => handleLogout()}
                className="bg-ticket-yellow hover:bg-ticket-yellow/90 text-slate-900 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-[0_0_15px_rgba(255,193,7,0.3)] hover:shadow-[0_0_20px_rgba(255,193,7,0.5)]"
              >
                Logout
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="hidden sm:block text-white font-medium text-sm hover:text-ticket-yellow transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-ticket-yellow hover:bg-ticket-yellow/90 text-slate-900 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-[0_0_15px_rgba(255,193,7,0.3)] hover:shadow-[0_0_20px_rgba(255,193,7,0.5)]"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-4 text-center min-h-0">
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "0.2s", opacity: 0 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-bold text-white tracking-tight leading-[1.1] drop-shadow-lg">
            Find Your <br />
            Perfect <span className="text-ticket-yellow">Space</span>
          </h1>
          <p className="mt-6 text-white/90 text-sm md:text-base lg:text-lg max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
            Find handpicked venues in stunning locations for weddings, corporate
            events, parties, and special celebrations. Book the perfect space
            and create unforgettable memories.
          </p>
        </div>

        <div
          className="mt-8 relative w-full max-w-4xl mx-auto h-24 hidden md:block animate-fade-in-up"
          style={{ animationDelay: "0.4s", opacity: 0 }}
        >
          <div className="absolute top-8 left-[5%] lg:left-[15%] glass-panel text-white px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium hover:scale-105 transition-transform cursor-default">
            <span className="w-2 h-2 rounded-full bg-white/70"></span>
            Fast Network
          </div>
          <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 glass-panel text-white px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium hover:scale-105 transition-transform cursor-default">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            100% Authenticity
          </div>
          <div className="absolute top-10 right-[5%] lg:right-[15%] glass-panel text-white px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium hover:scale-105 transition-transform cursor-default">
            <span className="w-2 h-2 rounded-full bg-white/70"></span>
            Flexible Spaces
          </div>
        </div>
      </main>

      <div
        className="relative z-20 w-full px-6 md:px-12 pb-8 animate-fade-in-up"
        style={{ animationDelay: "0.6s", opacity: 0 }}
      >
        <div className="bg-white rounded-3xl md:rounded-full p-1  shadow-2xl w-full max-w-sm mx-auto border border-slate-100">
          <Link to={"/venues"}>
            <button
              className="group relative w-full  inline-flex items-center justify-center gap-3 px-10 py-4 
          rounded-full font-bold text-2xl text-slate-900 bg-gradient-to-b from-[#FCECA1] to-[#E5B83B] border
           border-[#D4A32A] shadow-[0_4px_10px_rgba(229,184,59,0.3)] transition-all duration-300 ease-out 
           hover:from-[#FDF0B5] hover:to-[#EAC255] hover:shadow-[0_6px_15px_rgba(229,184,59,0.4)]
            hover:-translate-y-0.5 active:translate-y-0"
            >
              <Calendar
                className="w-5 h-5 text-slate-800 transition-transform duration-300 group-hover:scale-110"
                strokeWidth={2}
              />
              <span>Book Your Venue</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
