import { AuthDivider } from "@/components/auth/auth-divider";
import { SignupForm } from "@/components/auth/signup-form";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SignupCard({ className }: { className?: string }) {
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
          Join our community of venue owners and event planners.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 px-6 pt-6 pb-6">
        <SignupForm />
        <AuthDivider label="Or sign up with" />
        <SocialLoginButtons />
      </CardContent>
    </Card>
  );
}
