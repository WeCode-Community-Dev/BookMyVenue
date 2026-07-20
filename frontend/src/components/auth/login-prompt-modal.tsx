import React from 'react';
import Link from 'next/link';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  venueName?: string;
}

export function LoginPromptModal({ isOpen, onClose, venueName }: LoginPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top decorative gradient bar */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-full transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 text-center flex flex-col items-center">
          {/* Keyhole/Lock Icon */}
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-indigo-100 animate-bounce">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Login Required</h3>
          
          <p className="text-slate-500 text-sm mt-3 leading-relaxed">
            {venueName ? (
              <>
                To book <span className="font-semibold text-slate-800">{venueName}</span>, you need to sign in or register for an account first.
              </>
            ) : (
              "Please log in or create an account to start booking venues."
            )}
          </p>

          <div className="w-full mt-8 space-y-3">
            <Link
              href="/login"
              className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md shadow-indigo-100 hover:shadow-lg active:scale-[0.98]"
            >
              Sign In to Book
            </Link>
            
            <Link
              href="/register"
              className="block w-full text-center bg-slate-50 hover:bg-slate-105 text-slate-700 py-3 px-4 rounded-xl font-bold text-sm tracking-wide transition-all border border-slate-200 hover:border-slate-300 active:scale-[0.98]"
            >
              Create New Account
            </Link>
          </div>

          <button
            onClick={onClose}
            className="mt-5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
          >
            Cancel and Return
          </button>
        </div>
      </div>
    </div>
  );
}
