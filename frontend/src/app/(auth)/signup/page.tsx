import type { Metadata } from "next";
import Link from "next/link";
import { Building2 } from "lucide-react";

import { SignupForm } from "@/components/auth/signup-form";
import { SignupHeroPanel } from "@/components/auth/signup-hero-panel";

export const metadata: Metadata = {
  title: "Sign Up | BookMyVenue",
  description: "Create your BookMyVenue account",
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden bg-background text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed md:flex-row">
      <SignupHeroPanel />

      <section className="flex min-h-screen w-full items-center justify-center bg-background px-6 py-12 md:w-1/2 md:px-12 lg:w-2/5 lg:px-20">
        <div className="w-full max-w-md">
          <div className="mb-12 flex items-center gap-2 md:hidden">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary-container">
              <Building2 className="size-4 text-white" />
            </div>
            <span className="font-display text-headline-sm text-on-surface">
              BookMy<span className="text-brand-muted">Venue</span>
            </span>
          </div>

          <div className="mb-10">
            <h1 className="mb-3 font-display text-4xl text-on-surface">
              Create your account
            </h1>
            <p className="text-body-md text-on-surface-variant">
              Start your journey with the world&apos;s most unique venues.
            </p>
          </div>

          <SignupForm />

          <p className="mt-10 text-center text-body-md text-on-surface-variant">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-primary transition-all hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
