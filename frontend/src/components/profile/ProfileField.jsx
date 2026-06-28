const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition-colors focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70";

const hasDisplayValue = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";

const ProfileField = ({
  label,
  value,
  placeholder,
  children,
  className = "",
  isEditing = false,
  name,
  onChange,
  inputType = "text",
  options = [],
  rows = 3,
}) => {
  if (isEditing) {
    const fieldId = name || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={className}>
        <label
          htmlFor={fieldId}
          className="text-xs font-medium uppercase tracking-wide text-gray-400"
        >
          {label}
        </label>

        {inputType === "select" ? (
          <select
            id={fieldId}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            className={inputClass}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : inputType === "textarea" ? (
          <textarea
            id={fieldId}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            className={inputClass}
          />
        ) : (
          <input
            id={fieldId}
            name={name}
            type={inputType}
            value={value ?? ""}
            onChange={onChange}
            placeholder={placeholder}
            className={inputClass}
          />
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
      {hasDisplayValue(value) ? (
        <div className="mt-1 text-sm text-gray-900">{children ?? value}</div>
      ) : (
        <p className="mt-1 text-sm italic text-gray-400">{placeholder}</p>
      )}
    </div>
  );
};

export default ProfileField;
