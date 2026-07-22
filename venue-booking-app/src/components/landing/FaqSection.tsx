"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "Can I explore and view venue details without creating an account?",
    a: "Yes! BookMyVenue allows all public users to browse spaces, inspect high-resolution photos, view amenities, and check pricing rates freely. You will only be prompted to log in when you click 'Book Space' or confirm a time slot reservation."
  },
  {
    q: "How does the hourly booking and slot selection work?",
    a: "Every venue displays a real-time interactive calendar scheduler. You can choose any date and select available 1-hour time slots or full-day bookings. Time slots that are already reserved or blocked by host exception rules will automatically appear disabled."
  },
  {
    q: "What happens if a venue host cancels or changes availability?",
    a: "Host exception rules (such as maintenance blocks or holiday closures) are synchronized in real-time. If an exception rule is added for a date, the slots on that date are updated immediately. Confirmed guests receive instant notifications."
  },
  {
    q: "How do I list my own space on BookMyVenue?",
    a: "Switch to the Host Portal using your account menu or click 'List Your Space'. You can define hourly/daily rates, upload photos, list amenities, and manage pending guest requests."
  }
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="py-16 bg-muted/20 dark:bg-muted/5 border-b border-border/80">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
            <HelpCircle className="h-4 w-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Everything you need to know about space reservations and guest access.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border/80 bg-card overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-foreground cursor-pointer hover:bg-muted/30 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4.5 w-4.5 text-muted-foreground transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground leading-relaxed animate-in fade-in duration-200 border-t border-border/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
