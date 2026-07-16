import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/logo.png"

export default function AuthLayout({ children, imageSrc, title, subtitle }) {
  return (
    <div className="min-h-screen w-full flex bg-white font-sans animate-fade-in" style={{ animationDuration: '0.3s' }}>
    
      <div className="w-full lg:w-[45%] xl:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-24 relative z-10">
        
   
        <div className="absolute top-8 left-8 sm:top-12 sm:left-12">
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 p-1 group-hover:scale-105 transition-transform">
               <img src={logo} alt="" className="w-full h-full object-contain" onError={(e) => {
                 e.target.style.display = 'none';
                 e.target.parentElement.innerHTML = '<span class="text-ticket-orange font-bold text-xl">TS</span>';
               }} />
             </div>
             <span className="text-slate-900 text-xl font-bold tracking-tight">Book my Venue</span>
          </Link>
        </div>

        
        <div className="w-full max-w-md mt-16 lg:mt-0 animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
          {children}
        </div>
      </div>


      <div className="hidden lg:flex lg:w-[55%] xl:w-1/2 bg-slate-50 relative flex-col items-center justify-center p-12 overflow-hidden border-l border-slate-100">
        
       
        <div className="absolute inset-0 opacity-40">
          <svg className="h-full w-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dot-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#cbd5e1"></circle>
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#dot-pattern)"></rect>
          </svg>
        </div>

        <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}>
     
          <div className="w-full aspect-[16/10] rounded-2xl shadow-2xl overflow-hidden mb-12 border-8 border-white bg-white">
            <img src={imageSrc} alt="Platform visualization" className="w-full h-full object-cover" />
          </div>

          <div className="text-ticket-orange font-semibold text-sm tracking-wider uppercase mb-4">Book My Venue Platform</div>
          <h2 className="text-3xl font-bold text-slate-800 leading-snug mb-4">
            {title}
          </h2>
          <p className="text-slate-500 font-medium">
            {subtitle}
          </p>

        
          <div className="flex gap-2 mt-12">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-ticket-orange"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
