import { inputClass } from "./inputClasses.js";

// Labeled text input with a leading icon and inline error message.
// `icon` is a lucide-react component. `error` is the matching RHF error object
// (e.g. errors.email). `registration` is the spread of register("field", rules).
// `rightSlot` renders inside the input wrapper on the right (e.g. a show/hide
// button) — pass it and the caller is responsible for the input's right padding.
// Any extra props (type, placeholder, ...) pass through to the <input>.
export function InputWithIcon({
    id,
    label,
    icon: Icon,
    error,
    registration,
    rightSlot,
    ...inputProps
}) {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-1.5 block text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            <div className="relative">
                <Icon
                    size={18}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                    id={id}
                    className={inputClass(error) + (rightSlot ? " pr-10" : "")}
                    {...registration}
                    {...inputProps}
                />
                {rightSlot}
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-red-600">{error.message}</p>
            )}
        </div>
    );
}
