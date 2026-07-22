"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Heart } from "lucide-react";

export default function SaasFooter() {
  return (
    <footer className="bg-card border-t border-border/80 pt-16 pb-12 text-xs text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand & Status Column */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                BookMyVenue
              </span>
            </Link>

            <p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
              The modern venue operating platform for reserving verified meeting spaces, studios, ballrooms, and outdoor lounges in real-time.
            </p>

            {/* Live System Operational Status Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Column 1: Marketplace */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-foreground text-xs uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="/venues?type=conference" className="hover:text-foreground transition-colors">Boardrooms</Link></li>
              <li><Link href="/venues?type=wedding" className="hover:text-foreground transition-colors">Wedding Halls</Link></li>
              <li><Link href="/venues?type=coworking" className="hover:text-foreground transition-colors">Co-working Lofts</Link></li>
              <li><Link href="/venues?type=studio" className="hover:text-foreground transition-colors">Creative Studios</Link></li>
              <li><Link href="/venues?type=rooftop" className="hover:text-foreground transition-colors">Rooftops</Link></li>
            </ul>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-foreground text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/venues" className="hover:text-foreground transition-colors">Public Directory</Link></li>
              <li><Link href="/login" className="hover:text-foreground transition-colors">Customer Portal</Link></li>
              <li><Link href="/login?message=Host+Portal+Access" className="hover:text-foreground transition-colors">Host Portal</Link></li>
              <li><Link href="/login?message=Admin+Portal+Access" className="hover:text-foreground transition-colors">Admin Governance</Link></li>
            </ul>
          </div>

          {/* Column 3: Trust & Compliance */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-foreground text-xs uppercase tracking-wider">Security</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-1">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>Verified Host Audits</span>
              </li>
              <li><span className="hover:text-foreground cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-foreground cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-foreground cursor-pointer">Cancellation Rules</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <div>
            &copy; {new Date().getFullYear()} BookMyVenue Inc. All rights reserved.
          </div>
          <div className="flex items-center space-x-1">
            <span>Built with precision for seamless space reservation.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
