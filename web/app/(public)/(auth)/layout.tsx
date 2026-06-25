import { AuthPageShellClient } from "@/components/auth/auth-page-shell-client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthPageShellClient>{children}</AuthPageShellClient>;
}
