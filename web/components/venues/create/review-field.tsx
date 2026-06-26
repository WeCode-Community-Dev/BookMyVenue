type ReviewFieldProps = {
  label: string;
  value: string;
  className?: string;
};

export function ReviewField({ label, value, className }: ReviewFieldProps) {
  return (
    <div className={className}>
      <p className="text-xs font-medium tracking-wide text-on-surface-variant uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm text-on-surface">{value || "—"}</p>
    </div>
  );
}
