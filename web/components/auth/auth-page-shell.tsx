import { AuthBackgroundBlur } from "@/components/auth/auth-background-blur";
import { cn } from "@/lib/utils";

type AuthPageShellProps = {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
};

export function AuthPageShell({
  children,
  className,
  maxWidth = "420px",
}: AuthPageShellProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-full flex-1 flex-col items-center justify-center bg-surface px-4 py-12 sm:px-6",
        className
      )}
    >
      <AuthBackgroundBlur />
      <div
        className="relative z-10 flex w-full flex-col items-center gap-8"
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
}
