import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { authProvider } from "@/infrastructure/providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password — Book My Venue" }] }),
  component: ForgotPasswordPage,
});

const schema = z.object({ email: z.string().email() });

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    setLoading(true);
    try {
      await authProvider.resetPasswordForEmail(parsed.data.email, {
        redirectUri: `${window.location.origin}/reset-password`,
      });
    } catch {
      // Swallow to avoid account enumeration
    } finally {
      setLoading(false);
      setSent(true);
      toast.success("If an account exists, we sent a reset link.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center font-serif text-3xl mb-8">
          Book My Venue
        </Link>
        <div className="bg-white ring-1 ring-black/5 rounded-2xl p-8 shadow-xl shadow-zinc-950/5">
          <h1 className="font-serif text-3xl mb-1">Forgot password?</h1>
          <p className="text-sm text-lead/60 mb-6">
            Enter your email and we'll send you a reset link.
          </p>

          {sent ? (
            <div className="space-y-4">
              <p className="text-sm text-lead/80">
                If an account exists for <strong>{email}</strong>, you'll receive an email with a
                link to reset your password.
              </p>
              <Link to="/login" className="text-sm text-brand font-medium">
                ← Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
              >
                {loading ? "Sending…" : "Send reset link"}
              </Button>
              <p className="text-sm text-center text-lead/60">
                Remembered it?{" "}
                <Link to="/login" className="text-brand font-medium">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
