// src/components/shared/footer.tsx
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="text-lg font-extrabold tracking-tight text-black">
              BOOKMY<span className="text-gray-500">VENUE</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 max-w-sm leading-relaxed">
              Discover, book, and experience premium spaces curated perfectly for your next memorable event.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Explore</h5>
            <ul className="space-y-2 text-sm text-gray-600 font-medium">
              <li>
                <Link href="/venues" className="hover:text-black transition-colors">Browse Venues</Link>
              </li>
              <li>
                <Link href="/venues?category=wedding" className="hover:text-black transition-colors">Weddings</Link>
              </li>
              <li>
                <Link href="/venues?category=cafes" className="hover:text-black transition-colors">Cafes</Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Hosting</h5>
            <ul className="space-y-2 text-sm text-gray-600 font-medium">
              <li>
                <Link href="/host" className="hover:text-black transition-colors">List Your Space</Link>
              </li>
              <li>
                <Link href="/host/guidelines" className="hover:text-black transition-colors">Host Guidelines</Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-black transition-colors">Help Center</Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-400">
          <div>
            &copy; {currentYear} BOOKMYVENUE Inc. All rights reserved.
          </div>
          
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}