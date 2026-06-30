import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/site-nav";

export const Route = createFileRoute("/_authenticated/host")({
  head: () => ({ meta: [{ title: "Host dashboard — Book My Venue" }] }),
  component: HostLayout,
});

const tabs: { to: string; label: string; exact?: boolean }[] = [
  { to: "/host", label: "Overview", exact: true },
  { to: "/host/venues", label: "Venues" },
  { to: "/host/bookings", label: "Bookings" },
  { to: "/host/coupons", label: "Coupons" },
];

function HostLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-surface">
      <SiteNav />
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif text-4xl">Host dashboard</h1>
            <p className="text-sm text-lead/60">Manage your listings, bookings, and promotions.</p>
          </div>
          <Link
            to="/host/venues/new"
            className="bg-lead text-surface rounded-full px-4 py-2 text-sm font-medium hover:bg-lead/90"
          >
            + New listing
          </Link>
        </div>
        <div className="flex gap-1 border-b border-black/10">
          {tabs.map((t) => {
            const active = t.exact ? path === t.to : path.startsWith(t.to);
            return (
              <Link
                key={t.to}
                to={t.to as "/host"}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${active ? "border-brand text-lead" : "border-transparent text-lead/50 hover:text-lead"}`}
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
