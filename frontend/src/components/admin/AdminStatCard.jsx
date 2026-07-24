import { Eye, EyeOff } from "lucide-react";

const AdminStatCard = ({
  label,
  value,
  icon: Icon,
  iconClass,
  maskedValue,
  isValueVisible,
  onToggleVisibility,
}) => {
  const isHideable = Boolean(maskedValue && onToggleVisibility);
  const displayValue =
    isHideable && !isValueVisible ? maskedValue : value;

  return (
    <div className="rounded-lg border border-gray-200/80 bg-white px-3 py-2.5 ring-1 ring-gray-100/80 sm:px-4 sm:py-3">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${iconClass}`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold tabular-nums leading-none text-gray-900 sm:text-xl">
              {displayValue}
            </p>
            {isHideable && (
              <button
                type="button"
                onClick={onToggleVisibility}
                className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label={isValueVisible ? "Hide revenue" : "Show revenue"}
              >
                {isValueVisible ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
          <p className="mt-0.5 truncate text-[11px] font-medium text-gray-500 sm:text-xs">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminStatCard;
