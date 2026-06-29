"use client";

import React from "react";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { LogoTicket } from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1A1A19] text-[#E2E2DE] border-t border-neutral-dark">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Tagline */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center">
              <LogoTicket variant="dark" showTagline />
            </Link>
            <p className="text-sm text-neutral-muted leading-relaxed">
              Simplifying event planning. Find, compare, and book the perfect venue for your next wedding, meeting, or celebration.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-muted hover:text-white transition-colors" aria-label="Facebook">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="text-neutral-muted hover:text-white transition-colors" aria-label="Twitter">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="#" className="text-neutral-muted hover:text-white transition-colors" aria-label="Instagram">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="text-neutral-muted hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">For Customers</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/venues" className="text-sm text-neutral-muted hover:text-white transition-colors">
                  Browse Venues
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-neutral-muted hover:text-white transition-colors">
                  Customer Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-neutral-muted hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm text-neutral-muted hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* For Partners */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">For Venue Owners</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/partner" className="text-sm text-neutral-muted hover:text-white transition-colors">
                  List Your Venue
                </Link>
              </li>
              <li>
                <Link href="/partner/login" className="text-sm text-neutral-muted hover:text-white transition-colors">
                  Partner Login
                </Link>
              </li>
              <li>
                <Link href="/partner/register" className="text-sm text-neutral-muted hover:text-white transition-colors">
                  Partner Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Top Cities</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/venues?location=Kochi" className="text-sm text-neutral-muted hover:text-white transition-colors">
                  Kochi
                </Link>
              </li>
              <li>
                <Link href="/venues?location=Bangalore" className="text-sm text-neutral-muted hover:text-white transition-colors">
                  Bangalore
                </Link>
              </li>
              <li>
                <Link href="/venues?location=Mumbai" className="text-sm text-neutral-muted hover:text-white transition-colors">
                  Mumbai
                </Link>
              </li>
              <li>
                <Link href="/venues?location=Pune" className="text-sm text-neutral-muted hover:text-white transition-colors">
                  Pune
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-dark pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-muted">
          <p>&copy; {new Date().getFullYear()} BookMyVenue Inc. All rights reserved.</p>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <Building2 className="h-4 w-4 text-amber-cta" />
            <Link href="/partner" className="hover:text-white transition-colors font-medium text-amber-cta">
              Are you a Venue Partner? List your Venue
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
