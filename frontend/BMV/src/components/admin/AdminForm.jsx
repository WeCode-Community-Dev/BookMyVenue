import { Link } from "react-router-dom";

export const inputCls =
  "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mt-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-shadow";

export const labelCls = "block text-sm font-medium text-slate-600";

export function AdminCard({ title, subtitle, children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-5 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-sm font-semibold text-slate-800">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatTile({ label, value, color = "text-slate-800" }) {
  return (
    <div className="text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
    </div>
  );
}

export function AdminPageHeader({ title, subtitle, action, backTo, backLabel = "Back" }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        {backTo && (
          <Link to={backTo} className="text-xs text-blue-600 hover:underline mb-1 inline-block">
            ← {backLabel}
          </Link>
        )}
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function AdminLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function FormField({ label, hint, children }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

export function FormActions({ onCancel, saving, saveLabel = "Save changes", cancelTo }) {
  return (
    <div className="flex gap-3 pt-2">
      <PrimaryButton type="submit" disabled={saving} className="flex-1">
        {saving ? "Saving..." : saveLabel}
      </PrimaryButton>
      {cancelTo && (
        <Link
          to={cancelTo}
          className="flex-1 text-center border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          Cancel
        </Link>
      )}
    </div>
  );
}

export function AdminFormLayout({ title, subtitle, backTo, error, children }) {
  return (
    <div className="max-w-2xl">
      <AdminPageHeader title={title} subtitle={subtitle} backTo={backTo} />
      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 px-4 py-2.5 rounded-xl mb-4">{error}</p>
      )}
      <AdminCard>{children}</AdminCard>
    </div>
  );
}

export function AdminTable({ columns, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80 text-left text-xs uppercase tracking-wide text-slate-400">
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    approved: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
    rejected: "bg-rose-50 text-rose-700",
    booked: "bg-blue-50 text-blue-700",
    pending_payment: "bg-orange-50 text-orange-700",
    cancelled: "bg-slate-100 text-slate-500",
    active: "bg-emerald-50 text-emerald-700",
    inactive: "bg-slate-100 text-slate-500",
  };
  const cls = styles[status] || "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status?.replace("_", " ")}
    </span>
  );
}

export function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({ children, to, className = "" }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors ${className}`}
    >
      {children}
    </Link>
  );
}

export function ToggleField({ label, name, checked, onChange, hint }) {
  return (
    <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors">
      <input
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
      <div>
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
      </div>
    </label>
  );
}
