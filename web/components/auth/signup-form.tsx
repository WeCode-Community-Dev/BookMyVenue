"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

import { IconInput } from "@/components/auth/icon-input";
import {
  PhoneInput,
  type PhoneCountryCode,
} from "@/components/auth/phone-input";
import { PasswordField } from "@/components/auth/password-field";
import { RoleSelector, type UserRole } from "@/components/auth/role-selector";
import { Button } from "@/components/ui/button";

export function SignupForm() {
  const [role, setRole] = React.useState<UserRole>("CUSTOMER");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [countryCode, setCountryCode] = React.useState<PhoneCountryCode>("US");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <RoleSelector value={role} onChange={setRole} />
      <div className="grid grid-cols-2 gap-3">
        <IconInput
          label="First Name"
          name="firstName"
          autoComplete="given-name"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <IconInput
          label="Last Name (Optional)"
          name="lastName"
          autoComplete="family-name"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <IconInput
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="name@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <PhoneInput
        countryCode={countryCode}
        onCountryCodeChange={setCountryCode}
        value={phone}
        onChange={setPhone}
      />
      <div className="grid grid-cols-2 gap-3">
        <PasswordField
          value={password}
          onChange={setPassword}
          name="password"
          autoComplete="new-password"
          showForgotPassword={false}
          required
        />
        <PasswordField
          label="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
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
      <Button type="submit" className="h-10 w-full gap-2 text-sm font-medium">
        Create Account
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
