"use client";

import { useState } from "react";
import { Search, Eye, Ban, UserCheck, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { fmt, UserRole, User, USERS } from "../data";

export function UsersPage() {
  const [users, setUsers] = useState<User[]>(USERS);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<UserRole | "All">("All");

  const suspendUser = (id: string) =>
    setUsers((u) =>
      u.map((x) =>
        x.id === id ? { ...x, status: x.status === "Suspended" ? "Active" : "Suspended" } : x,
      ),
    );

  const filteredUsers = users.filter((u) => {
    const mr = userRoleFilter === "All" || u.role === userRoleFilter;
    const mq =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    return mr && mq;
  });

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Filters */}
      <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full pl-9 pr-4 py-2 bg-input-background border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Search by name or email…"
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(["All", "Owner", "Customer"] as const).map(r => (
            <button
              key={r}
              onClick={() => setUserRoleFilter(r)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${userRoleFilter === r ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              {["User", "Role", "Status", "Joined", "Venues / Bookings", "Revenue", "Actions"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {u.name.slice(0, 1)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.role === "Owner" ? "bg-primary/10 text-primary" : "bg-blue-50 text-blue-600"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`flex items-center gap-1.5 text-xs font-semibold w-fit px-2.5 py-1 rounded-full border ${u.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-emerald-500" : "bg-gray-400"}`} />
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-foreground/70 whitespace-nowrap">{u.joined}</td>
                <td className="px-5 py-3.5 text-foreground/70">
                  {u.role === "Owner" ? `${u.venues} venues` : `${u.bookings} bookings`}
                </td>
                <td className="px-5 py-3.5 font-semibold text-foreground">
                  {u.revenue > 0 ? fmt(u.revenue) : "—"}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-secondary transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => suspendUser(u.id)}
                      className={`p-1.5 rounded-lg transition-colors ${u.status === "Active" ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}
                      title={u.status === "Active" ? "Suspend" : "Reactivate"}
                    >
                      {u.status === "Active" ? <Ban className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-25" />
            <p className="font-medium">No users match your filter.</p>
          </div>
        )}
      </div>

      <div className="px-5 py-3.5 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>Showing {filteredUsers.length} of {users.length} users</span>
        <div className="flex gap-1">
          <button className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors"><ChevronLeft className="w-3.5 h-3.5" /></button>
          <button className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors"><ChevronRight className="w-3.5 h-3.5" /></button>
        </div>
      </div>
    </div>
  );
}
