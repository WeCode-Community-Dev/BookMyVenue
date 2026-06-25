"use client";

import { useState } from "react";
import { Search, Users } from "lucide-react";
import { fmt, UserRole, User, USERS } from "../data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

const PAGE_SIZE = 10;

export function UsersPage() {
  const [users] = useState<User[]>(USERS);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<UserRole>("Owner");
  const [page, setPage] = useState(1);

  const filteredUsers = users.filter((u) => {
    const mr = u.role === userRoleFilter;
    const mq =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    return mr && mq;
  });

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  // Clamp during render so the page stays valid when the result set shrinks.
  const currentPage = Math.min(page, pageCount);
  const pagedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
            onChange={e => { setUserSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex gap-2">
          {(["Owner", "Customer"] as const).map(r => (
            <button
              key={r}
              onClick={() => { setUserRoleFilter(r); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${userRoleFilter === r ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
            {["User", "Role", "Joined", "Venues / Bookings", "Revenue"].map(h => (
              <TableHead key={h} className="px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border">
          {pagedUsers.map(u => (
            <TableRow key={u.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {u.name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-5 py-3.5">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.role === "Owner" ? "bg-primary/10 text-primary" : "bg-blue-50 text-blue-600"}`}>
                  {u.role}
                </span>
              </TableCell>
              <TableCell className="px-5 py-3.5 text-foreground/70">{u.joined}</TableCell>
              <TableCell className="px-5 py-3.5 text-foreground/70">
                {u.role === "Owner" ? `${u.venues} venues` : `${u.bookings} bookings`}
              </TableCell>
              <TableCell className="px-5 py-3.5 font-semibold text-foreground">
                {u.revenue > 0 ? fmt(u.revenue) : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filteredUsers.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-25" />
          <p className="font-medium">No users match your filter.</p>
        </div>
      )}

      <div className="px-5 py-3.5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>
          {filteredUsers.length === 0
            ? "Showing 0 users"
            : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filteredUsers.length)} of ${filteredUsers.length} users`}
        </span>
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={currentPage <= 1}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : undefined}
                onClick={e => { e.preventDefault(); setPage(p => Math.max(1, p - 1)); }}
              />
            </PaginationItem>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map(p => (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === currentPage}
                  onClick={e => { e.preventDefault(); setPage(p); }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={currentPage >= pageCount}
                className={currentPage >= pageCount ? "pointer-events-none opacity-50" : undefined}
                onClick={e => { e.preventDefault(); setPage(p => Math.min(pageCount, p + 1)); }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
