import { MapPin, Instagram, Twitter, Facebook, Linkedin } from "lucide-react"

const columns = [
  {
    title: "Explore",
    links: ["Browse venues", "Weddings", "Corporate events", "Outdoor spaces", "Gift cards"],
  },
  {
    title: "Owners",
    links: ["List your venue", "Owner dashboard", "Pricing", "Resources", "Success stories"],
  },
  {
    title: "Company",
    links: ["About us", "Careers", "Press", "Blog", "Contact"],
  },
]

const socials = [Instagram, Twitter, Facebook, Linkedin]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card px-4 pt-16 pb-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <MapPin className="h-5 w-5" />
              </span>
              <span className="font-serif text-xl font-semibold text-foreground">
                BookMyVenue
              </span>
            </a>
            <p className="mt-4 max-w-xs leading-relaxed text-muted-foreground">
              The easiest way to discover, book, and list venues for every
              occasion.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#top"
                  aria-label="Social link"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#top"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BookMyVenue. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#top" className="hover:text-primary">Privacy</a>
            <a href="#top" className="hover:text-primary">Terms</a>
            <a href="#top" className="hover:text-primary">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
