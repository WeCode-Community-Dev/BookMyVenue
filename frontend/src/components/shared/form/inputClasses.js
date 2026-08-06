// Simple email format check, shared by email-field validation rules.
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Shared text-input styling; swaps the border colour when the field has an error.
export const inputClass = (hasError) =>
    "w-full rounded-lg border py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 " +
    (hasError
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-gray-300 focus:border-red-500 focus:ring-red-100");
