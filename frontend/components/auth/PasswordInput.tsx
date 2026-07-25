"use client";

import React, { useState } from "react";
import { Input, InputProps } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput(props: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative w-full">
      <Input
        type={showPassword ? "text" : "password"}
        {...props}
        className={`pr-10 ${props.className || ""}`}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition focus:outline-none cursor-pointer p-0.5 border-0 bg-transparent"
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </button>
    </div>
  );
}
