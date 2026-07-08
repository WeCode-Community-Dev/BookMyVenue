"use client";

import { useState, useEffect } from "react";
import { Search, Users, Eye } from "lucide-react";
import { fetchOwners, fetchCustomers } from "../../app/actions/user";
import type { Owner, Customer } from "../../app/actions/user";
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

type UserRole = "Owner" | "Customer";


type Row = Owner | Customer;

export function UsersPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<UserRole>("Owner");
  const [page, setPage] = useState(1);

  const fetchPage = async (role: UserRole, p: number) => {
    if (role === "Owner") {
      const result = await fetchOwners(p, PAGE_SIZE);
      setRows(result.owners);
      setTotal(result.total);
    } else {
      const result = await fetchCustomers(p, PAGE_SIZE);
      setRows(result.customers);
      setTotal(result.total);
    }
  };

  useEffect(() => {
    fetchOwners(1, PAGE_SIZE).then((result) => {
      setRows(result.owners);
      setTotal(result.total);
    });
  }, []);

  const handleRoleChange = async (role: UserRole) => {
    setUserRoleFilter(role);
    setPage(1);
    await fetchPage(role, 1);
  };

  const handlePageChange = async (p: number) => {
    setPage(p);
    await fetchPage(userRoleFilter, p);
  };

  const isOwner = userRoleFilter === "Owner";

  const filteredRows = rows.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      (u.name?.toLowerCase().includes(q) ?? false) ||
      u.email.toLowerCase().includes(q)
    );
  });

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

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
          {(["Owner", "Customer"] as const).map(r => (
            <button
              key={r}
              onClick={() => handleRoleChange(r)}
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
            {["Name", "Email", "Role", "Joined", isOwner ? "Venues" : "Bookings", "Actions"].map(h => (
              <TableHead key={h} className="px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border">
          {filteredRows.map(u => (
            <TableRow key={u.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {(u.name ?? u.email).slice(0, 1).toUpperCase()}
                  </div>
                  <p className="font-semibold text-foreground">{u.name ?? "—"}</p>
                </div>
              </TableCell>
              <TableCell className="px-5 py-3.5 text-foreground/70">{u.email}</TableCell>
              <TableCell className="px-5 py-3.5">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isOwner ? "bg-primary/10 text-primary" : "bg-blue-50 text-blue-600"}`}>
                  {userRoleFilter}
                </span>
              </TableCell>
              <TableCell className="px-5 py-3.5 text-foreground/70">{u.joined}</TableCell>
              <TableCell className="px-5 py-3.5 text-foreground/70">
                {"venues" in u ? `${u.venues} venues` : `${u.bookings} bookings`}
              </TableCell>
              <TableCell className="px-5 py-3.5">
                <button
                  className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-secondary transition-colors"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filteredRows.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-25" />
          <p className="font-medium">No users match your filter.</p>
        </div>
      )}

      <div className="px-5 py-3.5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>
          {total === 0
            ? "Showing 0 users"
            : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total} users`}
        </span>
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={page <= 1}
                className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
                onClick={e => { e.preventDefault(); handlePageChange(Math.max(1, page - 1)); }}
              />
            </PaginationItem>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map(p => (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === page}
                  onClick={e => { e.preventDefault(); handlePageChange(p); }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={page >= pageCount}
                className={page >= pageCount ? "pointer-events-none opacity-50" : undefined}
                onClick={e => { e.preventDefault(); handlePageChange(Math.min(pageCount, page + 1)); }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
