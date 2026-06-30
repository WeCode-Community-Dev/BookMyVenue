import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listAllUsers, setUserRole, setUserSuspended } from "@/server-adapters/admin.functions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const fn = useServerFn(listAllUsers);
  const roleFn = useServerFn(setUserRole);
  const suspendFn = useServerFn(setUserSuspended);
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"" | "customer" | "host" | "admin">("");

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-users", search, role],
    queryFn: () => fn({ data: { search: search || undefined, role: role || undefined } }),
  });

  async function toggleRole(userId: string, r: "host" | "admin", has: boolean) {
    await roleFn({ data: { userId, role: r, grant: !has } });
    qc.invalidateQueries({ queryKey: ["admin-users"] });
  }
  async function toggleSuspend(userId: string, suspended: boolean) {
    await suspendFn({ data: { userId, suspended: !suspended } });
    qc.invalidateQueries({ queryKey: ["admin-users"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          className="border rounded-md px-3 text-sm bg-white"
          value={role}
          onChange={(e) => setRole(e.target.value as "" | "customer" | "host" | "admin")}
        >
          <option value="">All roles</option>
          <option value="customer">Customer</option>
          <option value="host">Host</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl ring-1 ring-black/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-[11px] uppercase tracking-widest text-lead/40 font-bold text-left">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Roles</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-950/5">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-lead/50">
                  Loading…
                </td>
              </tr>
            )}
            {data.map((u) => (
              <tr key={u.id} className={u.is_suspended ? "bg-amber-50/40" : ""}>
                <td className="px-4 py-3">
                  <div className="font-medium">
                    {[u.first_name, u.last_name].filter(Boolean).join(" ") || "—"}
                  </div>
                  <div className="text-xs text-lead/50">{u.email}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {u.roles.map((r) => (
                      <span
                        key={r}
                        className="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full bg-stone-100"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-lead/60">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {u.is_suspended ? (
                    <span className="text-amber-700 text-xs">Suspended</span>
                  ) : (
                    <span className="text-emerald-700 text-xs">Active</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleRole(u.id, "host", u.roles.includes("host"))}
                  >
                    {u.roles.includes("host") ? "Demote host" : "Make host"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleRole(u.id, "admin", u.roles.includes("admin"))}
                  >
                    {u.roles.includes("admin") ? "Demote admin" : "Make admin"}
                  </Button>
                  <Button
                    size="sm"
                    variant={u.is_suspended ? "default" : "destructive"}
                    onClick={() => toggleSuspend(u.id, u.is_suspended)}
                  >
                    {u.is_suspended ? "Unsuspend" : "Suspend"}
                  </Button>
                </td>
              </tr>
            ))}
            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-lead/50">
                  No users.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
