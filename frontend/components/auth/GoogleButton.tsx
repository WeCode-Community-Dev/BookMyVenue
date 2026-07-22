import React from "react";
import { Button } from "@/components/ui/button";

interface GoogleButtonProps {
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  label?: string;
}

export default function GoogleButton({ onClick, disabled = false, label = "Continue with Google" }: GoogleButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-xl border-slate-200 hover:border-slate-300 text-slate-700 bg-white font-semibold shadow-xs hover:bg-slate-50 cursor-pointer h-10 px-4 transition-all duration-150 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <svg className="size-4 shrink-0" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.37c0,-0.67 -0.06,-1.3 -0.17,-2H21.35z" fill="#4285F4" />
        <path d="M12,20.6c2.59,0 4.77,-0.86 6.36,-2.33l-3.3,-2.57c-0.91,0.61 -2.08,0.97 -3.06,0.97c-2.95,0 -5.45,-1.99 -6.34,-4.67H2.22v2.65C3.84,17.86 7.64,20.6 12,20.6z" fill="#34A853" />
        <path d="M5.66,12c-0.22,-0.67 -0.35,-1.39 -0.35,-2.1c0,-0.71 0.13,-1.43 0.35,-2.1V5.15H2.22v2.65c-0.81,1.62 -1.27,3.43 -1.27,5.35c0,1.92 0.46,3.73 1.27,5.35L5.66,12z" fill="#FBBC05" />
        <path d="M12,5.13c1.41,0 2.68,0.49 3.68,1.44l2.76,-2.76C16.77,2.27 14.59,1.4 12,1.4c-4.36,0 -8.16,2.74 -9.78,6.4L5.66,10.45C6.55,7.77 9.05,5.13 12,5.13z" fill="#EA4335" />
      </svg>
      <span>{label}</span>
    </Button>
  );
}
