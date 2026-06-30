"use client";
import { CalendarCheck, ChevronDown } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { landingNavLinks } from "@/lib/data/landing";
import { getDashboardUser } from "@/lib/data/dashboard";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";

export function PublicSiteHeader() {
  const user = getDashboardUser();
  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/30 bg-surface-container-lowest">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-surface-tint">
            <CalendarCheck className="size-5 text-white" strokeWidth={2} />
          </div>
          <span className="text-lg font-bold tracking-tight text-on-surface">
            BookMyVenue
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {landingNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-body-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user.role === 'CUSTOMER' ?
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 gap-2 px-2 hover:bg-surface-container-low"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-surface-tint text-xs font-medium text-on-primary">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium text-on-surface sm:inline">
                    {user.name}
                  </span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            :
            <>
              <Button asChild variant="outline">
                <Link href="/login">Login</Link>
              </Button>

              <Button asChild variant="outline">
                <Link href="/signup">Signup</Link>
              </Button>

              <Button asChild className="hidden sm:inline-flex">
                <Link href="/signup">List Your Venue</Link>
              </Button>

            </>
          }


        </div>
      </div>
    </header>
  );
}
