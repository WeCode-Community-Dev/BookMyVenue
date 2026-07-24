const AdminFilterSelect = ({
  label,
  value,
  onChange,
  options,
  className = "",
}) => (
  <label className={`block ${className}`}>
    {label && (
      <span className="mb-1 block text-xs font-medium text-gray-500">
        {label}
      </span>
    )}
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full min-w-[8rem] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-red-300 focus:ring-2 focus:ring-red-100"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

export default AdminFilterSelect;
