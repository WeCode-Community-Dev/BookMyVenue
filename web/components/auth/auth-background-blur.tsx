export function AuthBackgroundBlur() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute -top-24 -left-24 size-72 rounded-full bg-surface-tint/20 blur-3xl" />
      <div className="absolute -right-24 -bottom-24 size-72 rounded-full bg-secondary-container/40 blur-3xl" />
    </div>
  );
}
