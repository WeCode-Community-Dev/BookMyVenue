"use client";

import { Mail } from "lucide-react";

import { IconInput } from "@/components/auth/icon-input";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/useFrom";
import { login, LoginResponse } from "@/services/authServices";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const initialData = {
    email: "",
    password: "",
  };

  const { formData, errors, isSubmitting, handleChange, handleSubmit, result } = useForm<typeof initialData>(initialData, login);

  useEffect(() => {
    if (result as LoginResponse && result.success) {
      localStorage.setItem('accessToken', result.data.accessToken);
      localStorage.setItem('role', result.data.role);
      if (result.data.role === "VENUE_OWNER") {
      router.push('/dashboard');
      } else {
        // router.push('/');
      }
    }
  }, [result]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <IconInput
        label="Email Address"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="name@company.com"
        icon={<Mail />}
        value={formData.email}
        onChange={handleChange}
        required
      />
      <PasswordField
        value={formData.password}
        onChange={handleChange}
        name="password"
        autoComplete="current-password" 
        required
      />
      {errors && <p className="text-red-500">{errors}</p>}

      <Button type="submit" disabled={isSubmitting} className="h-10 w-full text-sm font-medium">
        Login
      </Button>
    </form>
  );
}
