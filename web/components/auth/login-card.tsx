import { AuthDivider } from "@/components/auth/auth-divider";
import { LoginForm } from "@/components/auth/login-form";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function LoginCard({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "w-full gap-0 rounded-2xl border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0",
        className
      )}
    >
      <CardHeader className="gap-1.5 px-6 pt-6 pb-0">
        <CardTitle className="text-headline-md font-semibold text-on-surface">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-body-sm text-on-surface-variant">
          Login to manage your venues and bookings
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 px-6 pt-6 pb-6">
        <LoginForm />
        <AuthDivider />
        <SocialLoginButtons />
      </CardContent>
    </Card>
  );
}
