import { CalendarCheck } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { label: "About Us", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Support", href: "#" },
  { label: "Contact", href: "#" },
];

export function PublicSiteFooter() {
  return (
    <footer className="border-t border-outline-variant/30 bg-surface-container-lowest">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-surface-tint">
              <CalendarCheck className="size-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-base font-bold tracking-tight text-on-surface">
              BookMyVenue
            </span>
          </Link>
          <p className="text-sm text-on-surface-variant">
            © {new Date().getFullYear()} BookMyVenue. All rights reserved.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-on-surface-variant transition-colors hover:text-on-surface"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
