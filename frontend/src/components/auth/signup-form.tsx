"use client";

import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Search,
  Store,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import { AuthForm } from "@/components/auth/auth-form";
import { GoogleIcon } from "@/components/auth/auth-split-layout";
import { cn } from "@/lib/utils";

type Role = "booker" | "owner";

const ROLES: {
  id: Role;
  title: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    id: "booker",
    title: "Venue Booker",
    description: "Discover and book unique spaces",
    icon: <Search className="size-5" />,
  },
  {
    id: "owner",
    title: "Venue Owner",
    description: "List and manage your property",
    icon: <Store className="size-5" />,
  },
];

function RoleSelector({
  value,
  onChange,
}: {
  value: Role;
  onChange: (role: Role) => void;
}) {
  return (
    <div className="mb-8 space-y-4">
      <label className="ml-1 block text-label-md text-on-surface-variant">
        What&apos;s your primary role?
      </label>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ROLES.map((role) => {
          const selected = value === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onChange(role.id)}
              className={cn(
                "role-card group flex flex-col gap-2 p-4 focus:outline-none focus:ring-2 focus:ring-primary/20",
                selected ? "role-card-selected" : "hover:bg-surface-bright"
              )}
            >
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl bg-surface-container transition-colors",
                  selected && "bg-primary-container text-white"
                )}
              >
                {role.icon}
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-on-surface">
                  {role.title}
                </h3>
                <p className="text-xs leading-tight text-on-surface-variant">
                  {role.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function IconField({
  id,
  label,
  icon,
  type = "text",
  placeholder,
  autoComplete,
  trailing,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        className="ml-1 block text-label-md text-on-surface-variant"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="group relative transition-transform duration-200 focus-within:scale-[1.01]">
        <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary">
          {icon}
        </span>
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(
            "auth-input pl-12 focus:auth-input-focus",
            trailing ? "pr-12" : "pr-4"
          )}
        />
        {trailing}
      </div>
    </div>
  );
}

export function SignupForm() {
  const [role, setRole] = useState<Role>("booker");
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <AuthForm className="space-y-5">
      <RoleSelector value={role} onChange={setRole} />
      <input type="hidden" name="role" value={role} />

      <IconField
        id="name"
        label="Full Name"
        icon={<User className="size-5" />}
        placeholder="Jane Doe"
        autoComplete="name"
      />

      <IconField
        id="email"
        label="Email Address"
        icon={<Mail className="size-5" />}
        type="email"
        placeholder="name@example.com"
        autoComplete="email"
      />

      <IconField
        id="password"
        label="Password"
        icon={<Lock className="size-5" />}
        type={passwordVisible ? "text" : "password"}
        placeholder="••••••••"
        autoComplete="new-password"
        trailing={
          <button
            type="button"
            onClick={() => setPasswordVisible((v) => !v)}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-outline transition-colors hover:text-on-surface"
            aria-label={passwordVisible ? "Hide password" : "Show password"}
          >
            {passwordVisible ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        }
      />

      <div className="flex items-start gap-3 pt-1">
        <div className="flex h-5 items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="size-4 cursor-pointer rounded border-outline-variant text-primary focus:ring-primary/20"
          />
        </div>
        <label
          className="cursor-pointer text-label-sm text-on-surface-variant"
          htmlFor="terms"
        >
          I agree to the{" "}
          <Link href="#" className="font-bold text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="font-bold text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </label>
      </div>

      <button
        type="submit"
        className="mt-2 w-full rounded-xl bg-primary-container py-4 text-label-md text-white shadow-lg shadow-primary-container/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary-container active:scale-[0.98]"
      >
        Create Account
      </button>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-solid border-[var(--outline-variant)]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-label-sm text-outline">
            OR
          </span>
        </div>
      </div>

      <button
        type="button"
        className="group flex w-full items-center justify-center gap-3 rounded-xl border border-solid border-[var(--outline-variant)] bg-white py-3.5 text-label-md text-on-surface transition-all duration-200 hover:bg-surface-container-low active:scale-[0.98]"
      >
        <GoogleIcon />
        Continue with Google
      </button>
    </AuthForm>
  );
}
