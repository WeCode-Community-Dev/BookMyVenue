import React from "react";

interface RoleDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RoleDropdown({ value, onChange }: RoleDropdownProps) {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 outline-none transition duration-150 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 cursor-pointer select-none"
      >
        <option value="User">User</option>
        <option value="Venue Owner">Venue Owner (Host)</option>
        <option value="Admin">Admin</option>
      </select>
    </div>
  );
}
