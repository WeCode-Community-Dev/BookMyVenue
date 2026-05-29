import type { Metadata } from "next";
import Link from "next/link";

import {
  AuthBrand,
  AuthDivider,
  AuthSplitLayout,
  GoogleIcon,
  inputClassName,
} from "@/components/auth/auth-split-layout";
import { AuthForm } from "@/components/auth/auth-form";
import { PasswordField } from "@/components/auth/password-field";

export const metadata: Metadata = {
  title: "Login | BookMyVenue",
  description: "Sign in to your BookMyVenue account",
};

export default function LoginPage() {
  return (
    <AuthSplitLayout>
      <div className="w-full max-w-md space-y-8">
        <AuthBrand
          title="Welcome back"
          description="Please enter your details to sign in."
        />

        <AuthForm className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-label-md text-on-surface" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                className={inputClassName}
              />
            </div>

            <PasswordField id="password" label="Password" />
          </div>

          <div className="flex items-center justify-between">
            <label className="group flex cursor-pointer items-center gap-2">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  className="peer size-5 cursor-pointer appearance-none rounded-md border border-border-subtle transition-all checked:border-primary-container checked:bg-primary-container"
                />
                <span
                  className="pointer-events-none absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100"
                  aria-hidden
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              <span className="text-label-md text-text-muted transition-colors group-hover:text-on-surface">
                Remember me
              </span>
            </label>
            <Link
              href="#"
              className="text-label-md font-semibold text-primary-container decoration-2 underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="space-y-4 pt-2">
            <button
              type="submit"
              className="w-full rounded-full bg-primary-container py-4 text-label-md text-white shadow-lg shadow-primary-container/20 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Sign In
            </button>

            <AuthDivider />

            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-full border border-border-subtle bg-white py-3.5 transition-all duration-200 hover:bg-stone-50 active:scale-[0.98]"
            >
              <GoogleIcon />
              <span className="text-label-md text-on-surface">
                Continue with Google
              </span>
            </button>
          </div>
        </AuthForm>

        <div className="pt-8 text-center">
          <p className="text-body-md text-text-muted">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="ml-1 font-bold text-primary-container decoration-2 underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
