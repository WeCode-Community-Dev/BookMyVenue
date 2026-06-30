import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { authProvider } from "@/infrastructure/providers";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — Book My Venue" }] }),
  component: ResetPasswordPage,
});

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type RecoveryState = "checking" | "ready" | "invalid";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<RecoveryState>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    // Better Auth password reset: the reset token is in the URL query string.
    // If the user has an active session (from the reset link), they can update.
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token || session?.user) {
      setState("ready");
    } else {
      const timer = setTimeout(() => {
        setState("invalid");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [session]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ password, confirm });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setLoading(true);
    try {
      await authProvider.updatePassword(parsed.data.password);
      await authProvider.signOut();
      toast.success("Password updated. Please sign in.");
      navigate({ to: "/login" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center font-serif text-3xl mb-8">
          Book My Venue
        </Link>
        <div className="bg-white ring-1 ring-black/5 rounded-2xl p-8 shadow-xl shadow-zinc-950/5">
          <h1 className="font-serif text-3xl mb-1">Reset password</h1>

          {state === "checking" && (
            <p className="text-sm text-lead/60 mt-4">Verifying reset link…</p>
          )}

          {state === "invalid" && (
            <div className="mt-4 space-y-4">
              <p className="text-sm text-lead/80">This reset link is invalid or has expired.</p>
              <Link to="/forgot-password" className="text-sm text-brand font-medium">
                Request a new link
              </Link>
            </div>
          )}

          {state === "ready" && (
            <>
              <p className="text-sm text-lead/60 mb-6">Choose a new password for your account.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password">New password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirm">Confirm password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
                >
                  {loading ? "Updating…" : "Update password"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
