import { Search } from "lucide-react";

const AdminSearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) => (
  <label className={`relative block w-full sm:max-w-xs ${className}`}>
    <Search
      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      aria-hidden="true"
    />
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-full border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-red-300 focus:ring-2 focus:ring-red-100"
    />
  </label>
);

export default AdminSearchInput;
