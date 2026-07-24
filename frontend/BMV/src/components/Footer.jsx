import { Link } from "react-router-dom";

function ArrowRightIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
  
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold">
                BMV
              </div>
              <span className="font-bold text-slate-800">BookMyVenue</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              © {new Date().getFullYear()} BookMyVenue. All rights reserved.
              Elevating your milestone celebrations with world-class venues and
              premium care.
            </p>
          </div>


          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-3">Explore</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link to="/venues" className="hover:text-rose-600 transition-colors">Venues</Link></li>
              <li><Link to="/" className="hover:text-rose-600 transition-colors">How It Works</Link></li>
              <li><Link to="/" className="hover:text-rose-600 transition-colors">About Us</Link></li>
              <li><Link to="/" className="hover:text-rose-600 transition-colors">Contact Us</Link></li>
            </ul>
          </div>


          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-3">For Customers</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link to="/venues" className="hover:text-rose-600 transition-colors">Search Venues</Link></li>
              <li><Link to="/my-bookings" className="hover:text-rose-600 transition-colors">My Bookings</Link></li>
              <li><Link to="/" className="hover:text-rose-600 transition-colors">Help Center</Link></li>
              <li><Link to="/" className="hover:text-rose-600 transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link to="/" className="hover:text-rose-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>


          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-3">Newsletter</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Get venue deals and inspiration directly in your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-rose-400 transition-colors"
              />
              <button className="bg-rose-600 hover:bg-rose-700 text-white w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex gap-4">
            <Link to="/" className="hover:text-rose-600">Privacy Policy</Link>
            <Link to="/" className="hover:text-rose-600">Cookie Policy</Link>
            <Link to="/" className="hover:text-rose-600">Sitemap</Link>
          </div>
          <Link to="/admin/login" className="hover:text-rose-600 text-slate-300">Superadmin</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;