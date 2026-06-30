import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight select-none">
              <Image
                src="/logo.jpg"
                alt="BookMyVenue Logo"
                width={32}
                height={32}
                className="rounded-lg object-contain border border-slate-100 shadow-xs"
              />
              <span className="text-slate-900 font-extrabold">
                BookMy<span className="text-rose-600">Venue</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Combining the discovery experience of Airbnb with the location-first booking of BookMyShow. Find the perfect venue for your next event.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <a href="#" className="hover:text-rose-600 transition-colors" aria-label="Facebook">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="hover:text-rose-600 transition-colors" aria-label="Instagram">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="hover:text-rose-600 transition-colors" aria-label="Twitter">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="#" className="hover:text-rose-600 transition-colors" aria-label="LinkedIn">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Column 1: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-rose-600 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-rose-600 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-rose-600 transition-colors">
                  Press & Media
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-rose-600 transition-colors">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-rose-600 transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-rose-600 transition-colors">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-rose-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-rose-600 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-rose-600 transition-colors">
                  Cookie Preferences
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} BookMyVenue Inc. All rights reserved. Made for visual demonstration.
          </p>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            Developed with <span className="text-red-500">♥</span> using Next.js & Tailwind.
          </p>
        </div>
      </div>
    </footer>
  );
}
