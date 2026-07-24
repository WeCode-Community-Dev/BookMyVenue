import {Building2,FileSearch,CalendarCheck,CheckCircle2} from "lucide-react";

const steps = [
  {
    title: "Browse Venues",
    description:
      "Discover venues by city, category, and capacity for your event.",
    icon: Building2,
  },
  {
    title: "View Venue Details",
    description:
      "See photos, pricing, capacity, and available slots before you book.",
    icon: FileSearch,
  },
  {
    title: "Book Your Slot",
    description:
      "Choose a date and time slot that works for your celebration.",
    icon: CalendarCheck,
  },
  {
    title: "Pay & Confirm",
    description:
      "Complete secure online payment and receive instant booking confirmation.",
    icon: CheckCircle2,
  },
];

const HowItWorksBackdrop = () => (
  <div
    className="pointer-events-none absolute inset-0 overflow-hidden"
    aria-hidden="true"
  >
    <div className="absolute inset-0 bg-white" />
    <div className="absolute inset-x-0 top-20 bottom-12 bg-gradient-to-b from-transparent via-red-50/55 to-transparent sm:top-24 sm:bottom-16" />
    <div className="absolute left-1/2 top-[38%] h-72 w-[min(100%,28rem)] -translate-x-1/2 rounded-full bg-red-100/20 blur-3xl" />
    <div className="absolute -left-24 bottom-8 h-56 w-56 rounded-full bg-rose-100/20 blur-3xl" />
    <div className="absolute -right-20 bottom-4 h-48 w-48 rounded-full bg-red-100/15 blur-3xl" />
  </div>
);

const HowItWorks = () => {
  return (
    <div className="relative overflow-hidden">
      <HowItWorksBackdrop />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10 sm:py-12 lg:py-14">
        <h2 className="text-left text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          How it Works
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:mt-12 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-8">
        {steps.map(({ title, description, icon: Icon }) => (
          <article
            key={title}
            className="flex flex-col items-center text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-[3px] ring-red-500 sm:h-20 sm:w-20">
              <Icon
                className="h-7 w-7 text-red-600 sm:h-9 sm:w-9"
                aria-hidden="true"
                strokeWidth={1.5}
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-gray-900 sm:mt-6 sm:text-lg">
              {title}
            </h3>

            <p className="mt-2 max-w-[11rem] text-xs leading-relaxed text-gray-500 sm:mt-3 sm:max-w-[15rem] sm:text-sm">
              {description}
            </p>
          </article>
        ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
