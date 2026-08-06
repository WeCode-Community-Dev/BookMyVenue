import { landingStats } from "@/lib/data/landing";

export function LandingStats() {
  return (
    <section className="bg-background px-4 pb-12 pt-28 md:px-8 md:pb-16 md:pt-32">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
        {landingStats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
            <p className="text-headline-md font-bold text-primary md:text-headline-lg">
              {stat.value}
            </p>
            <p className="text-body-sm text-on-surface-variant md:text-body-md">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
