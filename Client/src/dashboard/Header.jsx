import React, { useState } from "react";
import { Search, Bell, Sparkles, X, Menu, Check } from "lucide-react";

export default function Header({ onToggleMobileSidebar }) {
  return (
    <header
      className="h-20 bg-[#F7F5EE] border-b border-slate-200 flex items-center justify-between px-6 md:px-8 
    relative z-30 flex-shrink-0"
    >
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-655 hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
