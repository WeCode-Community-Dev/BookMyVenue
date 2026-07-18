import { MapPin, Star, Users, Clock } from "lucide-react";

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 px-8 py-16 text-white shadow-2xl sm:px-12 sm:py-24">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-white/5 blur-2xl" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Find &amp; Book the
          <span className="block text-yellow-300">Perfect Venue</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-red-100 sm:text-xl">
          Discover thousands of stunning venues for weddings, conferences,
          parties, and every special moment. Book with confidence.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-red-100">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-yellow-300" />
            <span>Top locations nationwide</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-300" />
            <span>Verified reviews</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-yellow-300" />
            <span>50,000+ happy customers</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-300" />
            <span>Instant booking</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;