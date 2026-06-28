import Image from "next/image";
import Link from "next/link";

import { landingCategories } from "@/lib/data/landing";

export function LandingCategories() {
  return (
    <section
      id="categories"
      className="scroll-mt-20 bg-background px-4 py-12 md:px-8 md:py-16"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <h2 className="text-headline-md font-bold text-on-surface md:text-headline-lg">
            Explore by Category
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Find a space that matches your specific event requirements.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {landingCategories.map((category) => (
            <Link
              key={category.name}
              href={`/venues?occasion=${encodeURIComponent(category.name)}`}
              className="group relative aspect-4/3 overflow-hidden rounded-lg shadow-elevation-1 transition-shadow hover:shadow-elevation-2"
            >
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute bottom-3 left-3 text-sm font-semibold text-white md:text-base">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
