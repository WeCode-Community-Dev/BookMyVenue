import { useId, useState } from "react";
import { X } from "lucide-react";
import { addUniqueChipValue } from "../../../utils/venueForm";

const ChipInput = ({
  id: idProp,
  label,
  labelledBy,
  hint,
  placeholder,
  value = [],
  onChange,
  disabled = false,
  error,
}) => {
  const generatedId = useId();
  const inputId = idProp || generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const [draft, setDraft] = useState("");

  const commitValue = (raw) => {
    const parts = String(raw)
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.length === 0) return;

    let next = value;
    parts.forEach((part) => {
      next = addUniqueChipValue(next, part);
    });

    onChange(next);
    setDraft("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitValue(draft);
      return;
    }

    if (event.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleChange = (event) => {
    const nextValue = event.target.value;

    if (nextValue.includes(",")) {
      commitValue(nextValue);
      return;
    }

    setDraft(nextValue);
  };

  const handleBlur = () => {
    if (draft.trim()) {
      commitValue(draft);
    }
  };

  const removeChip = (index) => {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div>
      {label ? (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      ) : null}

      {hint && (
        <p id={hintId} className="mb-2 text-xs text-gray-500">
          {hint}
        </p>
      )}

      <div
        className={[
          "min-h-11 rounded-lg border bg-white px-2 py-2 transition-colors focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100",
          error ? "border-red-400" : "border-gray-200",
          disabled ? "cursor-not-allowed bg-gray-50 opacity-70" : "",
        ].join(" ")}
      >
        <div className="flex flex-wrap gap-2">
          {value.map((chip, index) => (
            <span
              key={`${chip}-${index}`}
              className="inline-flex max-w-full items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-sm text-red-800 ring-1 ring-red-100"
            >
              <span className="truncate">{chip}</span>
              <button
                type="button"
                onClick={() => removeChip(index)}
                disabled={disabled}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-red-700 transition-colors hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label={`Remove ${chip}`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </span>
          ))}

          <input
            id={inputId}
            type="text"
            value={draft}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={value.length === 0 ? placeholder : "Add another..."}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            aria-labelledby={!label && labelledBy ? labelledBy : undefined}
            className="min-w-[8rem] flex-1 border-0 bg-transparent px-1 py-1.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default ChipInput;
