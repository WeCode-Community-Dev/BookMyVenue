"use client";

import { useState } from "react";

import { SignupForm } from "@/components/auth/signup-form";
import type { UserRole } from "@/components/auth/role-selector";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  CUSTOMER: "Discover venues and book your next event with ease.",
  VENUE_OWNER: "List your space and connect with event planners near you.",
};

export function SignupCard({ className }: { className?: string }) {
  const [role, setRole] = useState<UserRole>("CUSTOMER");

  return (
    <Card
      className={cn(
        "w-full gap-0 rounded-2xl border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0",
        className
      )}
    >
      <CardHeader className="gap-1.5 px-6 pt-6 pb-0">
        <CardTitle className="text-headline-md font-semibold text-on-surface">
          Create Your Account
        </CardTitle>
        <CardDescription className="text-body-sm text-on-surface-variant">
          {ROLE_DESCRIPTIONS[role]}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 px-6 pt-6 pb-6">
        <SignupForm onRoleChange={setRole} />
        {/* <AuthDivider label="Or sign up with" /> */}
        {/* <SocialLoginButtons /> */}
      </CardContent>
    </Card>
  );
}
