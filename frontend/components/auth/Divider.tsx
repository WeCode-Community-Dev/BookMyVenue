import React from "react";

interface DividerProps {
  children?: React.ReactNode;
}

export default function Divider({ children }: DividerProps) {
  return (
    <div className="relative flex py-3 items-center w-full my-1">
      <div className="flex-grow border-t border-slate-200/50"></div>
      {children && (
        <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider select-none">
          {children}
        </span>
      )}
      <div className="flex-grow border-t border-slate-200/50"></div>
    </div>
  );
}
