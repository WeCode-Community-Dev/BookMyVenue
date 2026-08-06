import { AuthBrandHeader } from "@/components/auth/auth-brand-header";
import { AuthFooterLink } from "@/components/auth/auth-footer-link";
import { SignupCard } from "@/components/auth/signup-card";

export default function SignupPage() {
  return (
    <>
      <AuthBrandHeader icon="map-pin" showTagline={false} />
      <SignupCard />
      <AuthFooterLink
        prompt="Already have an account?"
        linkText="Login"
        href="/login"
      />
    </>
  );
}
