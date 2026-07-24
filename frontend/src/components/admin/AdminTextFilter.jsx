const AdminTextFilter = ({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  min,
  className = "",
}) => (
  <label className={`block ${className}`}>
    <span className="mb-1 block text-xs font-medium text-gray-500">{label}</span>
    <input
      type={type}
      min={min}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full min-w-[8rem] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
    />
  </label>
);

export default AdminTextFilter;
