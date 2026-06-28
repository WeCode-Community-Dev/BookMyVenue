import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Camera,
  ChevronRight,
  Crown,
  MapPin,
  ShieldCheck,
  X,
} from "lucide-react";

const responsibilities = [
  "List only genuine venues",
  "Keep venue information accurate",
  "Upload real venue photos",
  "Maintain up-to-date availability",
  "Honour confirmed bookings",
  "Follow community guidelines",
];

const nextSteps = [
  { label: "Create venue", icon: Building2 },
  { label: "Add photos", icon: Camera },
  { label: "Set location", icon: MapPin },
  { label: "Add slots", icon: CalendarCheck },
  { label: "Get bookings", icon: ShieldCheck },
];

const BecomeHostModal = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,
  error = "",
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef(null);
  const [accepted, setAccepted] = useState(false);

  const handleClose = useCallback(() => {
    if (isLoading) return;
    setAccepted(false);
    onClose();
  }, [isLoading, onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    const focusable = dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isLoading) {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, isLoading, handleClose]);

  if (!open) return null;

  const handleConfirm = () => {
    if (!accepted || isLoading) return;
    onConfirm();
  };

  const stopDialogClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 z-0 bg-gray-900/45 backdrop-blur-sm"
        onClick={handleClose}
        aria-label="Close dialog"
        disabled={isLoading}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={stopDialogClick}
        onMouseDown={stopDialogClick}
        className="relative z-10 flex w-full max-w-[34rem] flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-[0_24px_80px_-12px_rgba(0,0,0,0.28)] ring-1 ring-gray-200/80 sm:max-w-xl sm:rounded-3xl"
      >
        <header className="relative shrink-0 border-b border-gray-100 px-5 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-6">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleClose();
            }}
            disabled={isLoading}
            className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:opacity-60 sm:right-5 sm:top-5"
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="relative z-10 pr-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-600 ring-1 ring-gray-200/80">
              <Crown className="h-3 w-3 shrink-0 text-gray-500" aria-hidden="true" />
              Host program
            </span>

            <h2
              id={titleId}
              className="mt-3 text-[1.35rem] font-bold tracking-tight text-gray-900 sm:text-2xl"
            >
              Become a Host
            </h2>

            <p
              id={descriptionId}
              className="mt-2 max-w-md text-sm leading-relaxed text-gray-600"
            >
              Start hosting venues on BookMyVenue and manage bookings from one
              dashboard.
            </p>
          </div>
        </header>

        <div className="shrink-0 border-b border-gray-100 bg-gray-50/60 px-5 py-4 sm:px-7 sm:py-5">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
            What happens next
          </p>

          <ol className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {nextSteps.map(({ label, icon: Icon }, index) => (
              <li key={label} className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-gray-200/80">
                  <Icon
                    className="h-3.5 w-3.5 shrink-0 text-gray-500"
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap">{label}</span>
                </span>
                {index < nextSteps.length - 1 && (
                  <ChevronRight
                    className="hidden h-3.5 w-3.5 shrink-0 text-gray-300 sm:block"
                    aria-hidden="true"
                  />
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="px-5 py-4 sm:px-7 sm:py-5">
          <section aria-labelledby="become-host-responsibilities">
            <h3
              id="become-host-responsibilities"
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400"
            >
              Your responsibilities
            </h3>

            <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {responsibilities.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[13px] leading-snug text-gray-600"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <label
            className={`mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gray-400 has-[:focus-visible]:ring-offset-2 ${
              accepted
                ? "border-gray-300 bg-white"
                : "border-gray-200 bg-gray-50/80"
            }`}
          >
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
              disabled={isLoading}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-gray-700 focus:ring-gray-400"
            />
            <span className="text-sm leading-relaxed text-gray-700">
              I understand my responsibilities as a venue provider on Book
              MyVenue.
            </span>
          </label>

          {error && (
            <p
              className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-800"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>

        <footer className="flex shrink-0 flex-col-reverse gap-2.5 border-t border-gray-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-7 sm:py-5">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-gray-200 px-5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:opacity-60 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!accepted || isLoading}
            className="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-700 px-6 text-sm font-semibold text-white shadow-md shadow-red-600/15 ring-1 ring-red-500/15 transition-all hover:from-red-700 hover:to-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none sm:w-auto sm:min-w-[10.5rem]"
          >
            {isLoading ? "Setting up..." : "Become a Host"}
            {!isLoading && (
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default BecomeHostModal;
