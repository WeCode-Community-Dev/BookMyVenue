interface AuthSubmitButtonProps {
  isSubmitting: boolean;
  disabled?: boolean;
  loadingText?: string;
  text: string;
}

export function AuthSubmitButton({
  isSubmitting,
  disabled = false,
  loadingText = 'Processing...',
  text,
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting || disabled}
      className="group flex h-14 w-full items-center justify-center rounded-2xl bg-[var(--bg-secondary)] text-base font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSubmitting ? (
        <>
          <svg
            className="mr-2 h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-20"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          {loadingText}
        </>
      ) : (
        <>
          {text}
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </>
      )}
    </button>
  );
}
