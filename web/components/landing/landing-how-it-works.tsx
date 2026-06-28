import { landingHowItWorksSteps } from "@/lib/data/landing";

export function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 bg-surface-container-low px-4 py-12 md:px-8 md:py-16"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-headline-md font-bold text-on-surface md:text-headline-lg">
            How It Works
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Book your perfect venue in three simple steps.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {landingHowItWorksSteps.map((item) => (
            <div
              key={item.step}
              className="flex flex-col gap-3 rounded-lg bg-surface-container-lowest p-6 shadow-elevation-1"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary-container text-sm font-bold text-primary">
                {item.step}
              </span>
              <h3 className="text-headline-md text-on-surface">{item.title}</h3>
              <p className="text-body-sm text-on-surface-variant">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
