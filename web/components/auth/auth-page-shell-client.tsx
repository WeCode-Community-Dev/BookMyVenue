"use client";

import { usePathname } from "next/navigation";

import { AuthPageShell } from "@/components/auth/auth-page-shell";

export function AuthPageShellClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const maxWidth = pathname === "/signup" ? "480px" : "420px";

  return <AuthPageShell maxWidth={maxWidth}>{children}</AuthPageShell>;
}
