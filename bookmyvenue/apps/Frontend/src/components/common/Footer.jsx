import { Link } from "react-router-dom";
import Logo from "./Logo";

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Terms", to: "/terms" },
    { label: "Privacy", to: "/privacy" },
  ];

  return (
    <footer className="border-t border-gray-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <Logo to="/" />
            <p className="mt-1 text-sm text-gray-500">
              Find and book the perfect venue for your next event.
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm text-gray-600 transition-colors hover:text-red-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} BookMyVenue. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;


