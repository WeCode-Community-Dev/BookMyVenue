import { Link } from "react-router-dom"

function UserRow({ name, email, status }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3">
      <div>
        <div className="text-sm font-medium">{name}</div>
        <div className="mt-1 text-xs text-muted-foreground">{email}</div>
      </div>
      <div className="text-xs text-muted-foreground">{status}</div>
    </div>
  )
}

export default function AdminUsersListPage() {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sample nested route at <code className="font-mono">/admin/users</code>.
          </p>
        </div>
        <Link
          className="rounded-xl bg-muted px-4 py-2 text-sm font-medium hover:opacity-90"
          to=".."
        >
          Back to dashboard
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        <UserRow name="Aarav Menon" email="aarav@example.com" status="Active" />
        <UserRow name="Diya Sharma" email="diya@example.com" status="Active" />
        <UserRow name="Kabir Nair" email="kabir@example.com" status="Blocked" />
      </div>
    </div>
  )
}

