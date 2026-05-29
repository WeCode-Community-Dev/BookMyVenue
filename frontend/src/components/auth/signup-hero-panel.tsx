import Image from "next/image";
import Link from "next/link";
import { Building2, Star } from "lucide-react";

const AVATARS = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtpOecp2RqmATdEgb5T0YSkFsiNuMXfE24BGpuSyO1KiErj6D2KCWMfRRURc7LaPQfS4U7KBcALvRxIvgauopLFL5ZC1WnrUruzuCy5OzSkLLjGROeH1U1H_HCnYasH4ImkGD0Cl6vLNKVWHL2oR7SO5pKgSenyB8Uy284LSUFpmQIFOzRtvhAjtx1DBtMsdjD9qeSvoei1nF3BY5rJMyKTZ5OY0iqJdA_BpAungPgIFniZdNdaDXJB-PWUf57XV77e468awusxa1O",
    alt: "Female event planner headshot",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBibvpo-lF8BCRfgGCk6QbyBK1H9VujIS7MJM6FzIGe2v9neX8ko3K0eDG2X2fqLZfemRdhGoJ3iCbnd7e6SfwkerPRUD6LWM7zrkSVz5YlXd_fvnKriXmcZPunqiBQUiNJlf2wr85dyBVSg5sJD6HCJuirg4XQqBtx8BTv-qg-q41Ga7xYrWrLMk2m5iy7arkADM_teNqza84cqckpWvqtFhrS__7zSz0Vuzbc_Lo4yAz7aZ8rHSFH05ffeQbWrlCx0XON9THwiqGk",
    alt: "Male venue owner headshot",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4TkKZJ7pfQDJsGMbm0aGTWPiNP3C_TkcmpZf2jYq_pavW-wZfjvuljoiWuBmA8qnjJghwxJoX1ejk_MN7DCjphewVo7kVa2i-S4FE5KQKvY4VibY2DTZFLE8AAU9q1lI7hCWdGUX4BT4m9ci6JX65QKdU9LCH6eELKJDYf2mKRfEE4Q7yZnBV-oxr5Fo3cQJExCDHufuNlfytXhpYFXqRuqZkZ_wTn1iyWqqmmi3H38vcNkxSs9QoJ5-0ydQ1FB-ietUC7yxwsf9a",
    alt: "Creative professional portrait",
  },
] as const;

export function SignupHeroPanel() {
  return (
    <section className="relative hidden h-screen items-end overflow-hidden p-12 md:flex md:w-1/2 lg:w-3/5">
      <div className="absolute inset-0 z-0">
        <Image
          src='/signup-hero.png'
          alt="Sun-drenched modern event space with floor-to-ceiling glass walls"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 50vw, 60vw"
        />
        <div className="hero-gradient absolute inset-0" />
      </div>

      <Link
        href="/"
        className="group absolute top-12 left-12 z-10 flex cursor-pointer items-center gap-2"
      >
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary-container shadow-lg transition-transform group-hover:scale-105">
          <Building2 className="size-5 fill-white text-white" />
        </div>
        <span className="font-display text-headline-sm text-white drop-shadow-md">
          BookMy<span className="text-secondary-container">Venue</span>
        </span>
      </Link>

      <div className="glass-card relative z-10 max-w-sm rounded-2xl p-6">
        <div className="mb-4 flex -space-x-3">
          {AVATARS.map((avatar) => (
            <Image
              key={avatar.src}
              src={avatar.src}
              alt={avatar.alt}
              width={40}
              height={40}
              className="size-10 rounded-full border-2 border-white/50 object-cover"
            />
          ))}
          <div className="flex size-10 items-center justify-center rounded-full border-2 border-white/50 bg-primary-container text-[10px] font-bold tracking-tighter text-white uppercase">
            +10k
          </div>
        </div>
        <p className="text-label-md leading-relaxed text-white">
          Join 10k+ hosts and event planners worldwide.
        </p>
        <div className="mt-4 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="size-3.5 fill-secondary-container text-secondary-container"
            />
          ))}
          <span className="ml-1 text-xs font-medium text-white/80">
            4.9/5 from 2k reviews
          </span>
        </div>
      </div>
    </section>
  );
}
