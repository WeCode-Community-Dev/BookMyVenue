import React from "react";
import { ShieldCheck, Shield, MessageSquare, Zap } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md transition duration-200 flex items-start gap-4">
      <div className="p-3 bg-rose-50 text-rose-600 rounded-xl shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-slate-900 text-base">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed mt-1">{description}</p>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section className="py-12 bg-slate-50/50 border-y border-slate-100/85 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Why Choose BookMyVenue?</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">We make booking venues simple, secure, and hassle-free.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<ShieldCheck className="size-5 sm:size-6" />}
            title="Verified Venues"
            description="Every listed venue undergoes a strict verification process to ensure transparency."
          />
          <FeatureCard
            icon={<Shield className="size-5 sm:size-6" />}
            title="Secure Booking"
            description="Our platform ensures safe payments and protects your personal credentials."
          />
          <FeatureCard
            icon={<MessageSquare className="size-5 sm:size-6" />}
            title="Real Reviews"
            description="Authentic feedback and ratings from verified organizers who booked before."
          />
          <FeatureCard
            icon={<Zap className="size-5 sm:size-6" />}
            title="Instant Confirmation"
            description="No back-and-forth emails. Get instant booking approval and receipt details."
          />
        </div>
      </div>
    </section>
  );
}
