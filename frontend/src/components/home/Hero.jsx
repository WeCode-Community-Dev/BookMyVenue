import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import event1 from "../../assets/event1.jpg";
import event2 from "../../assets/event2.webp";
import event4 from "../../assets/event4.webp";
import event6 from "../../assets/event6.webp";
import event7 from "../../assets/event7.jfif";

const EVENT_IMAGES = [
  { src: event1, alt: "Outdoor wedding venue setup" },
  { src: event2, alt: "Elegant banquet hall" },
  { src: event4, alt: "Garden party venue" },
  { src: event6, alt: "Decorated event mandap" },
  { src: event7, alt: "Premium event space" },
];

const U_CURVE_OFFSETS = [
  "translate-y-0",
  "translate-y-3 sm:translate-y-5",
  "translate-y-8 sm:translate-y-10 md:translate-y-12",
  "translate-y-3 sm:translate-y-5",
  "translate-y-0",
];

const HeroPremiumBackdrop = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <div className="absolute inset-0 bg-gradient-to-b from-red-50/70 via-white to-gray-50/90" />

    <div className="absolute -top-20 left-1/2 h-72 w-[min(100%,36rem)] -translate-x-1/2 rounded-full bg-red-100/35 blur-3xl" />
    <div className="absolute top-24 -left-16 h-56 w-56 rounded-full bg-rose-200/25 blur-3xl sm:top-28" />
    <div className="absolute top-16 -right-12 h-48 w-48 rounded-full bg-red-100/30 blur-3xl sm:top-20" />

    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent via-white/70 to-white sm:h-32" />
  </div>
);

const Hero = () => {
  const { user, loading, authReady } = useAuth();

  const scrollToProviderCta = (event) => {
    if (window.location.pathname !== "/") return;

    event.preventDefault();

    document.getElementById("provider-cta")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", "/#provider-cta");
  };

  return (
    <section className="bg-white">
      <div className="relative overflow-hidden pb-10 sm:pb-12 lg:pb-14">
        <HeroPremiumBackdrop />

        <div className="relative z-10 mx-auto max-w-3xl px-6 pt-16 text-center sm:pt-20 lg:pt-24">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-red-600/90">
            Find your space
          </p>

          <h1 className="mt-5 text-balance">
            <span className="block text-3xl font-semibold leading-[1.15] tracking-tight text-gray-900 sm:text-4xl lg:text-[2.75rem]">
              Find the Perfect Venue
            </span>
            <span className="mt-3 block text-xl font-normal leading-relaxed text-gray-600 sm:text-2xl lg:text-[1.65rem] lg:leading-snug">
              for Every Celebration, Event, and Milestone That Matters Most
            </span>
          </h1>

          <div className="mx-auto mt-7 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-red-200/80 sm:w-14" />
            <span className="h-1.5 w-1.5 rounded-full bg-red-500/70" />
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-red-200/80 sm:w-14" />
          </div>

          <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4">
            <Link
              to="/venues"
              className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-red-600 to-red-700 px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-red-600/25 ring-1 ring-red-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:shadow-red-600/30 sm:px-9 sm:text-base"
            >
              Browse venues
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>

            {!loading && authReady && !user && (
              <Link
                to={{ pathname: "/", hash: "#provider-cta" }}
                onClick={scrollToProviderCta}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-gray-200/90 bg-white/80 px-8 py-3.5 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-red-200 hover:bg-red-50/60 hover:text-red-700 sm:px-9 sm:text-base"
              >
                Become a provider
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="relative w-full px-4 pb-14 sm:px-6 md:px-8 lg:px-10 lg:pb-20">
        <div className="grid grid-cols-5 items-start gap-2 py-5 sm:gap-3 sm:py-7 md:gap-4 md:py-8 lg:gap-5 lg:py-10">
          {EVENT_IMAGES.map((image, index) => (
            <div
              key={image.alt}
              className={`min-w-0 transition-transform duration-300 ${U_CURVE_OFFSETS[index]}`}
            >
              <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200/60">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                  loading={index < 2 ? "eager" : "lazy"}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
