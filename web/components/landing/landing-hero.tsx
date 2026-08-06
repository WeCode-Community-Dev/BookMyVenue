import Image from "next/image";
import { Calendar, MapPin, PartyPopper, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LandingHero() {
  return (
    <section className="relative flex min-h-[520px] flex-col items-center justify-center px-4 pb-24 pt-16 md:min-h-[580px] md:px-8 md:pb-32 md:pt-20">
      <Image
        src="/hero-image.png"
        alt="Modern venue with floor-to-ceiling windows"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/60" />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-6 text-center">
        <h2 className="text-headline-lg font-bold text-white md:text-headline-xl">
          Find and Book the Perfect Venue for{" "}
          <span className="text-primary italic">Any Occasion</span>
        </h2>
        <p className="max-w-4xl text-body-md text-white/85 md:text-body-lg">
          Discover auditoriums, meeting rooms, wedding halls, sports venues,
          studios, cafes, and community spaces — all in one unified, open-source
          platform.
        </p>
      </div>

      <form
        method="GET"
        action="/venues"
        className="relative z-10 mx-auto -mb-16 mt-10 w-full max-w-5xl rounded-xl bg-surface-container-lowest p-4 shadow-elevation-2 md:-mb-20 md:mt-12 md:p-5"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="grid flex-1 gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5 text-label-sm font-semibold uppercase tracking-wide text-primary">
                <MapPin className="size-3.5" />
                Location
              </span>
              <Input
                name="location"
                placeholder="Where to?"
                className="h-10 bg-background"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5 text-label-sm font-semibold uppercase tracking-wide text-primary">
                <Calendar className="size-3.5" />
                Date
              </span>
              <Input
                type="date"
                name="date"
                className="h-10 bg-background"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5 text-label-sm font-semibold uppercase tracking-wide text-primary">
                <PartyPopper className="size-3.5" />
                Occasion
              </span>
              <Input
                name="occasion"
                placeholder="Search venues..."
                className="h-10 bg-background"
              />
            </label>
          </div>

          <Button type="submit" size="lg" className="h-10 shrink-0 gap-2 px-5">
            <Search className="size-4" />
            Search Venues
          </Button>
        </div>
      </form>
    </section>
  );
}
