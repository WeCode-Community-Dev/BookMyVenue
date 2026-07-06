function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      <div
        className={`flex items-center gap-2 border rounded-xl px-3.5 py-2 text-gray-400 transition
          ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-rose-300 focus-within:border-transparent"}`}
      >
        {children}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">⚠ {error}</p>}
    </div>
  );
}

export default Field;