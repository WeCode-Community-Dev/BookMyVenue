import { Link } from "react-router-dom";

function EmptyState({ title, description, actionLabel, actionTo, onAction, icon: Icon }) {
  return (
    <div className="text-center py-8 px-4">
      {Icon && (
        <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
          <Icon size={22} className="text-slate-400" />
        </div>
      )}
      <p className="text-sm font-medium text-slate-700">{title}</p>
      {description && <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">{description}</p>}
      {(actionLabel && actionTo) && (
        <Link
          to={actionTo}
          className="inline-block mt-4 text-sm font-medium text-rose-800 hover:underline"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <button
          type="button"
          onClick={onAction}
          className="inline-block mt-4 text-sm font-medium text-rose-800 hover:underline"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
