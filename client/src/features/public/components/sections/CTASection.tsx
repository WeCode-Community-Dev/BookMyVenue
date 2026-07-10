import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Building } from 'lucide-react';
import bgImage from '@/features/public/assets/hero-venue.png';

export default function CTASection() {
  return (
    <section className="bg-transparent text-foreground py-16 relative overflow-hidden">
      {/* Ambient decorative glow */}
      <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] bg-[#e21a47]/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute -top-24 -left-24 w-[400px] h-[400px] bg-[#e21a47]/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="relative rounded-[32px] overflow-hidden bg-zinc-950 text-white shadow-2xl border border-zinc-800/80">
          {/* Subtle background image overlay */}
          <div className="absolute inset-0 z-0 opacity-15 select-none pointer-events-none">
            <img
              src={bgImage}
              alt="Venue background"
              className="w-full h-full object-cover mix-blend-luminosity scale-105"
            />
          </div>

          {/* Grid pattern / Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-900/95 z-0" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#e21a47]/15 rounded-full blur-[120px] pointer-events-none z-0" />

          {/* Content Wrapper */}
          <div className="relative z-10 p-8 md:p-14 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Heading and main call */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e21a47]/10 border border-[#e21a47]/20 text-[#e21a47] text-[10px] md:text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Your Perfect Space Awaits</span>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                  Ready to host an <br />
                  <span className="font-serif italic font-light text-zinc-300">
                    unforgettable
                  </span>{' '}
                  event?
                </h2>

                <p className="text-sm md:text-base text-zinc-400 max-w-xl leading-relaxed">
                  BookMyVenue connects you with Kerala's most exquisite heritage villas, luxury
                  waterfront spaces, and premium conference centers. Seamless planning starts here.
                </p>
              </div>

              {/* Right Column: Dual CTAs */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* CTA Card 1: For Planners */}
                <div className="group bg-zinc-900/60 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700/60 p-6 rounded-2xl transition-all duration-300">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white group-hover:text-[#e21a47] transition-colors">
                        Explore Venues
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Find and book the perfect location for your special occasion.
                      </p>
                    </div>
                    <Link
                      to="/venues"
                      className="flex-shrink-0 w-10 h-10 rounded-full bg-[#e21a47] hover:bg-[#c81239] text-white flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* CTA Card 2: For Owners */}
                <div className="group bg-zinc-900/60 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700/60 p-6 rounded-2xl transition-all duration-300">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white group-hover:text-[#e21a47] transition-colors">
                        List Your Venue
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Partner with us and showcase your venue to premier planners.
                      </p>
                    </div>
                    <Link
                      to="/owner/register"
                      className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-850 hover:bg-zinc-800 border border-zinc-700/80 text-white flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    >
                      <Building className="w-4 h-4 text-zinc-300 group-hover:text-white" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
