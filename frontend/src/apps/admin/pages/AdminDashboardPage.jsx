import { Link } from "react-router-dom"

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Admin overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Starter admin page to prove separate UI + shared portal styling.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            className="rounded-xl bg-muted px-4 py-2 text-sm font-medium hover:opacity-90"
            to="users"
          >
            Users list
          </Link>
          <button className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90">
            Review reports
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <Row label="New users (7d)" value="148" />
        <Row label="New venues (7d)" value="19" />
        <Row label="Bookings (24h)" value="62" />
        <Row label="Flagged listings" value="4" />
      </div>

      <section className="mt-6 rounded-2xl border border-border/60 bg-card p-5">
        <h2 className="text-base font-semibold">Moderation queue (sample)</h2>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-muted p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium">Venue “Riverside Hall”</div>
              <div className="text-xs text-muted-foreground">Missing license doc</div>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90">
                Request docs
              </button>
              <button className="rounded-lg border border-border/60 px-3 py-2 text-xs font-medium hover:bg-card/60">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

