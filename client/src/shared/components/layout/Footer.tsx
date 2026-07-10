const Footer = () => {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-primary text-2xl font-bold">BookMyVenue</h2>
            <p className="text-muted mt-4 max-w-md">
              Discover and book the perfect venue for weddings, parties, corporate events, meetings,
              and special occasions.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-foreground mb-4 font-semibold">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-muted hover:text-primary transition">
                  Browse Venues
                </a>
              </li>
              <li>
                <a href="#" className="text-muted hover:text-primary transition">
                  Categories
                </a>
              </li>
              <li>
                <a href="#" className="text-muted hover:text-primary transition">
                  Popular Venues
                </a>
              </li>
              <li>
                <a href="#" className="text-muted hover:text-primary transition">
                  Featured Listings
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-foreground mb-4 font-semibold">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-muted hover:text-primary transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted hover:text-primary transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-muted hover:text-primary transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-muted hover:text-primary transition">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-foreground mb-4 font-semibold">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-muted hover:text-primary transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-muted hover:text-primary transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted hover:text-primary transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted hover:text-primary transition">
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-border mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm md:flex-row">
          <p className="text-muted">
            © {new Date().getFullYear()} BookMyVenue. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a href="#" className="text-muted hover:text-primary transition">
              Instagram
            </a>
            <a href="#" className="text-muted hover:text-primary transition">
              Facebook
            </a>
            <a href="#" className="text-muted hover:text-primary transition">
              Twitter
            </a>
            <a href="#" className="text-muted hover:text-primary transition">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
