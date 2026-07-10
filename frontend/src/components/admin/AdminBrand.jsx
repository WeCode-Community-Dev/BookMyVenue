import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import Logo from "../../assets/logo.jpeg";

const AdminBrand = ({ compact = false, onClick }) => {
  return (
    <Link
      to="/admin/dashboard"
      onClick={onClick}
      className="group block min-w-0"
      aria-label="Book My Venue Admin"
    >
      <span className="inline-flex items-center gap-1 rounded-full bg-violet-950/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-900 ring-1 ring-violet-900/10">
        <Shield className="h-3 w-3 shrink-0 text-violet-800" aria-hidden="true" />
        Admin Console
      </span>

      <span className="mt-2 inline-flex min-w-0 items-center gap-2.5">
        <img
          src={Logo}
          alt=""
          className={`w-auto shrink-0 object-contain ${compact ? "h-8" : "h-10 sm:h-11"}`}
          aria-hidden="true"
        />
        <span
          className={`truncate font-brand leading-tight text-red-900 ${
            compact ? "text-base" : "text-lg sm:text-xl"
          }`}
        >
          Book My Venue
        </span>
      </span>

    </Link>
  );
};

export default AdminBrand;
