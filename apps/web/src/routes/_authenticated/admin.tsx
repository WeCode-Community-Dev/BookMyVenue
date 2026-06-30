import { createFileRoute, Outlet, Link, redirect, useRouterState } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { requireAdmin } from "@/server-adapters/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Book My Venue" }] }),
  beforeLoad: async () => {
    try {
      await requireAdmin();
    } catch {
      throw redirect({ to: "/" });
    }
  },
  component: AdminLayout,
});

const tabs: { to: string; label: string; exact?: boolean }[] = [
  { to: "/admin", label: "Overview", exact: true },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/venues", label: "Venues" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/coupons", label: "Coupons" },
  { to: "/admin/reviews", label: "Reviews" },
];

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-surface">
      <SiteNav />
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <div className="mb-6">
          <h1 className="font-serif text-4xl">Admin console</h1>
          <p className="text-sm text-lead/60">Platform-wide users, venues, bookings & content.</p>
        </div>
        <div className="flex gap-1 border-b border-black/10 overflow-x-auto">
          {tabs.map((t) => {
            const active = t.exact ? path === t.to : path.startsWith(t.to);
            return (
              <Link
                key={t.to}
                to={t.to as "/admin"}
                className={`whitespace-nowrap px-4 py-2 text-sm font-medium border-b-2 -mb-px ${active ? "border-brand text-lead" : "border-transparent text-lead/50 hover:text-lead"}`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
        <div className="py-8">
          <Outlet />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
