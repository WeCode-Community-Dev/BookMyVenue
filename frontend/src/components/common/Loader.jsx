const Loader = ({ label = "Loading..." }) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-20"
      role="status"
      aria-label={label}
    >
      <div className="h-11 w-11 animate-spin rounded-full border-2 border-gray-100 border-t-red-500/70" />
      <p className="text-sm font-medium tracking-wide text-gray-400">{label}</p>
    </div>
  );
};

export default Loader;
