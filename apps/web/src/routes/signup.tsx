import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { authProvider } from "@/infrastructure/providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — Book My Venue" }] }),
  beforeLoad: async () => {
    const session = await authProvider.getSession();
    if (session) throw redirect({ to: "/" });
  },
  component: SignupPage,
});

const schema = z.object({
  first_name: z.string().min(1).max(60),
  last_name: z.string().min(1).max(60),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["customer", "host"]),
});

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "customer" as "customer" | "host",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setLoading(true);
    try {
      await authProvider.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        emailRedirectTo: window.location.origin,
        metadata: {
          first_name: parsed.data.first_name,
          last_name: parsed.data.last_name,
          role: parsed.data.role,
        },
      });
      toast.success("Account created! You can now sign in.");
      navigate({ to: "/login", search: {} });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    sessionStorage.setItem("pending_role", form.role);
    const res = await authProvider.signInWithOAuth("google", {
      redirectUri: window.location.origin,
    });
    if (res.error) return toast.error("Google sign-in failed");
    if (res.redirected) return;
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center font-serif text-3xl mb-8">
          Book My Venue
        </Link>
        <div className="bg-white ring-1 ring-black/5 rounded-2xl p-8 shadow-xl shadow-zinc-950/5">
          <h1 className="font-serif text-3xl mb-1">Create your account</h1>
          <p className="text-sm text-lead/60 mb-6">Book venues, host spaces, or both.</p>

          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-2 ring-1 ring-black/10 rounded-full py-2.5 text-sm font-medium hover:bg-stone-50"
          >
            <svg className="size-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.12c-.22-.66-.35-1.36-.35-2.12s.13-1.46.35-2.12V7.04H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.96l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84c.87-2.6 3.3-4.5 6.16-4.5z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-6 text-xs text-lead/40">
            <div className="h-px bg-black/10 flex-1" /> OR{" "}
            <div className="h-px bg-black/10 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>I want to…</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {(
                  [
                    { v: "customer", title: "Book venues", sub: "Find and reserve spaces" },
                    { v: "host", title: "List my venue", sub: "Host events at my space" },
                  ] as const
                ).map((opt) => {
                  const active = form.role === opt.v;
                  return (
                    <button
                      type="button"
                      key={opt.v}
                      onClick={() => setForm({ ...form, role: opt.v })}
                      className={`text-left rounded-xl p-3 ring-1 transition ${active ? "ring-brand bg-brand/5" : "ring-black/10 hover:ring-black/20"}`}
                    >
                      <div className="text-sm font-medium">{opt.title}</div>
                      <div className="text-xs text-lead/50 mt-0.5">{opt.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="first_name">First name</Label>
                <Input
                  id="first_name"
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last name</Label>
                <Input
                  id="last_name"
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <p className="text-xs text-lead/40 mt-1">At least 8 characters.</p>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {loading ? "Creating…" : "Create account"}
            </Button>
          </form>

          <p className="text-sm text-center mt-6 text-lead/60">
            Already a member?{" "}
            <Link to="/login" className="text-brand font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
