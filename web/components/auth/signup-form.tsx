"use client";

import { ArrowRight } from "lucide-react";

import { IconInput } from "@/components/auth/icon-input";
import { PasswordField } from "@/components/auth/password-field";
import { RoleSelector, type UserRole } from "@/components/auth/role-selector";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/useFrom";
import { signup } from "@/services/authServices";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SignupFormProps = {
  onRoleChange?: (role: UserRole) => void;
};

export function SignupForm({ onRoleChange }: SignupFormProps = {}) {
  const initialData = {
    role: "CUSTOMER" as UserRole,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };
  const { formData, errors, isSubmitting, handleChange, handleSubmit, result } = useForm<typeof initialData>(initialData, signup);
  const router = useRouter();
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (result) {
      if (result.success) {
        router.push("/login");
      } else {
      }
    }
  }, [result]);

  useEffect(() => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  }, [formData.password, formData.confirmPassword]);

  useEffect(() => {
    onRoleChange?.(formData.role as UserRole);
  }, [formData.role, onRoleChange]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <RoleSelector value={formData.role as UserRole} onChange={handleChange} />
      <div className="grid grid-cols-2 gap-3">
        <IconInput
          label="First Name"
          name="firstName"
          autoComplete="given-name"
          placeholder="First name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <IconInput
          label="Last Name (Optional)"
          name="lastName"
          autoComplete="family-name"
          placeholder="Last name"
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>
      <IconInput
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="name@company.com"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <IconInput
        label="Phone"
        type="tel"
        name="phone"
        autoComplete="tel"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
      />
      <div className="grid grid-cols-2 gap-3">
        <PasswordField
          value={formData.password}
          onChange={handleChange}
          name="password"
          autoComplete="new-password"
          showForgotPassword={false}
          required
        />
        <PasswordField
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          name="confirmPassword"
          id="confirm-password"
          autoComplete="new-password"
          showForgotPassword={false}
          aria-invalid={passwordError ? true : undefined}
          required
        />
      </div>
      {passwordError && (
        <p className="text-sm text-error" role="alert">
          {passwordError}
        </p>
      )}
      {errors && <p className="text-red-500">{errors}</p>}
      <Button type="submit" disabled={isSubmitting} className="h-10 w-full gap-2 text-sm font-medium">
        {isSubmitting ? "Creating Account..." : "Create Account"}
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
