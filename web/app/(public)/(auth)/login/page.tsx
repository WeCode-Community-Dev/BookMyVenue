import { AuthBrandHeader } from "@/components/auth/auth-brand-header";
import { AuthFooterLink } from "@/components/auth/auth-footer-link";
import { LoginCard } from "@/components/auth/login-card";

export default function LoginPage() {
  return (
    <>
      <AuthBrandHeader />
      <LoginCard />
      <AuthFooterLink
        prompt="Don't have an account?"
        linkText="Sign up"
        href="/signup"
      />
    </>
  );
}
