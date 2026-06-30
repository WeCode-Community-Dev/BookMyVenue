"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import RoleDropdown from "./RoleDropdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

export default function DeveloperLogin() {
  const { login } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("User");

  const handleDeveloperLogin = () => {
    login(selectedRole as "User" | "Venue Owner" | "Admin");
    router.push("/");
  };

  return (
    <div className="w-full max-w-md mt-6 border border-slate-200/60 bg-slate-50/50 rounded-2xl p-4 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Developer Tools</span>
          <Badge variant="interactive" className="text-[9px] px-2 py-0.5 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100/50 select-none">
            Dev Helpers
          </Badge>
        </div>
        
        {/* Visual Toggle Switch */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none border-0 ${
            isOpen ? "bg-rose-600" : "bg-slate-200"
          }`}
          aria-label="Toggle developer panel"
        >
          <span
            className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              isOpen ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-200/50 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 select-none">
              Login As
            </label>
            <RoleDropdown value={selectedRole} onChange={setSelectedRole} />
          </div>

          <Button
            type="button"
            onClick={handleDeveloperLogin}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold h-9 rounded-xl text-xs gap-1.5 cursor-pointer shadow-xs active:translate-y-px transition-all border-none"
          >
            <span>Login as Selected Role</span>
            <span className="text-[9px] uppercase bg-amber-500/20 text-amber-700 px-1.5 py-0.5 rounded-sm font-black select-none leading-none">
              Development Only
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
