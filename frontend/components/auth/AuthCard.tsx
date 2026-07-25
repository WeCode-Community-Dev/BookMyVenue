import React from "react";

interface AuthCardProps {
  children: React.ReactNode;
}

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md bg-white border border-slate-200/65 shadow-xl rounded-3xl p-8 md:p-10 transition-shadow hover:shadow-2xl">
      {children}
    </div>
  );
}
