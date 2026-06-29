"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import {
  TrendingUp,
  Percent,
  Calendar,
  Award,
  BarChart3,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Building,
  Menu,
  X
} from "lucide-react";
import { LogoTicket } from "@/components/Logo";

export default function PartnerLanding() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const benefits = [
    {
      icon: <Percent className="h-6 w-6 text-amber-cta" />,
      title: "0% Commission",
      desc: "Pay absolute zero commission fees on your first 10 bookings. Keep 100% of your earnings."
    },
    {
      icon: <Calendar className="h-6 w-6 text-amber-cta" />,
      title: "Real-time Booking Manager",
      desc: "Manage slot availability, guest details, and slot pricing from a simplified calendar dashboard."
    },
    {
      icon: <Award className="h-6 w-6 text-amber-cta" />,
      title: "Verified Partner Badge",
      desc: "Gain customer trust and double search click rates with our verified venue badge of quality."
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-amber-cta" />,
      title: "Analytics Dashboard",
      desc: "Monitor views, inquiry click rates, and monthly revenue performance with simplified graphs."
    }
  ];

  const testimonials = [
    {
      quote: "Joining BookMyVenue boosted our monthly bookings by 45%. The calendar manager saved us hours of coordination work.",
      author: "Rajesh Kumar",
      city: "Kochi",
      role: "Owner, Pearl Banquets"
    },
    {
      quote: "The zero-commission offer for the first 10 bookings let us test the platform with zero risk. Highly recommended!",
      author: "Sneha Hegde",
      city: "Bangalore",
      role: "Manager, Indiranagar Creative Studio"
    }
  ];

  const faqs = [
    {
      q: "How does BookMyVenue charge venue partners?",
      a: "We offer a zero-commission model for your first 10 bookings. After that, we charge a flat 3% platform servicing fee per booking, with no hidden subscription or listing costs."
    },
    {
      q: "How long does it take for my venue to go live?",
      a: "Onboarding takes less than 10 minutes. Once you submit details and proof of ownership/licenses, our moderation team verifies the listing within 24 hours."
    },
    {
      q: "Can I manage multiple venues under one account?",
      a: "Yes! Our partner dashboard is fully multi-venue capable. You can add, edit, and manage calendars for multiple banquet halls, lawns, or rooftops under a single partner profile."
    },
    {
      q: "How are payments routed to partners?",
      a: "Customers pay secure booking amounts online. Payouts are directly deposited into your registered business bank account within 24 hours of successful event completion."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF8] text-neutral-dark font-sans">
      
      {/* PARTNER CUSTOM HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Link href="/">
                <LogoTicket />
              </Link>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-neutral-dark text-white px-2 py-0.5 rounded-md self-center">Partner</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-neutral-muted">
              <a href="#benefits" className="hover:text-teal-primary transition-colors">Benefits</a>
              <a href="#how-it-works" className="hover:text-teal-primary transition-colors">How it works</a>
              <a href="#faqs" className="hover:text-teal-primary transition-colors">FAQs</a>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/partner/login">
              <Button variant="ghost" className="text-neutral-dark hover:bg-neutral-light font-semibold">
                Login
              </Button>
            </Link>
            <Link href="/partner/register">
              <Button className="bg-teal-primary text-white hover:bg-teal-hover rounded-xl px-5 font-semibold">
                List Your Venue
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-2 text-neutral-dark hover:text-teal-primary focus:outline-none"
          >
            {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileNavOpen && (
          <div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-3 shadow-xl animate-fade-in">
            <nav className="flex flex-col space-y-3">
              <a href="#benefits" onClick={() => setMobileNavOpen(false)} className="text-sm font-semibold text-neutral-dark hover:text-teal-primary px-2">Benefits</a>
              <a href="#how-it-works" onClick={() => setMobileNavOpen(false)} className="text-sm font-semibold text-neutral-dark hover:text-teal-primary px-2">How it works</a>
              <a href="#faqs" onClick={() => setMobileNavOpen(false)} className="text-sm font-semibold text-neutral-dark hover:text-teal-primary px-2">FAQs</a>
            </nav>
            <hr className="border-neutral-light" />
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/partner/login" onClick={() => setMobileNavOpen(false)}>
                <Button variant="outline" className="w-full border-input text-neutral-dark">Login</Button>
              </Link>
              <Link href="/partner/register" onClick={() => setMobileNavOpen(false)}>
                <Button className="w-full bg-teal-primary text-white">List Your Venue</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section className="w-full py-16 md:py-24 bg-white border-b border-neutral-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left text */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-light text-teal-primary text-xs font-semibold uppercase tracking-wider">
                  <TrendingUp className="h-3.5 w-3.5" /> High Conversion Listing
                </div>
                <h1 className="font-serif text-4xl sm:text-5xl font-bold text-neutral-dark tracking-tight leading-[1.15]">
                  Grow Your Venue Business with BookMyVenue
                </h1>
                <p className="text-base text-neutral-muted leading-relaxed font-sans font-light">
                  List your banquet halls, outdoor lawns, rooftops, or studios on India's premier venue booking network. Receive direct inquiries, manage automated slots, and boost booking revenue.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link href="/partner/register">
                    <Button className="bg-teal-primary text-white hover:bg-teal-hover py-4 px-8 h-auto text-sm font-bold shadow-lg shadow-teal-primary/25 rounded-xl">
                      List Your Venue — It's Free
                    </Button>
                  </Link>
                  <Link href="/partner/login">
                    <Button variant="outline" className="border-input hover:bg-neutral-light py-4 px-8 h-auto text-sm font-bold rounded-xl">
                      Access Dashboard
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Mockup */}
              <div className="relative aspect-video lg:aspect-square w-full rounded-2xl bg-neutral-light border border-neutral-light shadow-2xl overflow-hidden flex items-center justify-center p-4">
                <div className="w-full h-full bg-white rounded-xl shadow-md p-5 border border-neutral-light flex flex-col justify-between">
                  <div className="border-b border-neutral-light pb-3 flex justify-between items-center">
                    <span className="font-serif font-bold text-base text-teal-primary">Partner Dashboard Mock</span>
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  {/* Grid mockup graphic */}
                  <div className="grid grid-cols-3 gap-3 flex-grow my-4">
                    <div className="bg-teal-light/20 p-3 rounded-lg border border-teal-primary/10 flex flex-col justify-between">
                      <span className="text-[10px] text-neutral-muted uppercase font-bold">Views</span>
                      <span className="text-xl font-bold text-teal-primary font-sans">14,250</span>
                    </div>
                    <div className="bg-amber-light/20 p-3 rounded-lg border border-amber-cta/10 flex flex-col justify-between">
                      <span className="text-[10px] text-neutral-muted uppercase font-bold">Bookings</span>
                      <span className="text-xl font-bold text-amber-cta font-sans">34</span>
                    </div>
                    <div className="bg-neutral-light p-3 rounded-lg border border-neutral-light flex flex-col justify-between">
                      <span className="text-[10px] text-neutral-muted uppercase font-bold">Revenue</span>
                      <span className="text-sm font-bold text-neutral-dark font-sans">₹12.4L</span>
                    </div>
                  </div>
                  {/* Graph line visualization */}
                  <div className="h-20 w-full bg-neutral-light/50 rounded-lg border border-neutral-light flex items-end p-2 gap-1.5">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-teal-primary/60 hover:bg-teal-primary w-full rounded-t-sm transition-all cursor-pointer"
                        style={{ height: `${20 + (i % 3) * 20 + (i % 2) * 15}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* BENEFITS STRIP */}
        <section id="benefits" className="w-full py-16 bg-[#FAFAF8] border-b border-neutral-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs font-bold text-teal-primary uppercase tracking-wider mb-2">Why Partner With Us</p>
              <h2 className="text-3xl font-serif font-bold text-neutral-dark">Designed to Help Your Business Grow</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((b, idx) => (
                <div key={idx} className="bg-white border border-neutral-light rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-xl bg-amber-light flex items-center justify-center mb-5">
                    {b.icon}
                  </div>
                  <h3 className="font-serif font-bold text-lg text-neutral-dark mb-2">{b.title}</h3>
                  <p className="text-xs text-neutral-muted leading-relaxed font-sans font-light">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS FOR PARTNERS */}
        <section id="how-it-works" className="w-full py-16 bg-white border-b border-neutral-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-bold text-teal-primary uppercase tracking-wider mb-2">Simplified Onboarding</p>
            <h2 className="text-3xl font-serif font-bold text-neutral-dark mb-12">How it Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center">
                <div className="h-14 w-14 rounded-full bg-teal-light text-teal-primary flex items-center justify-center font-bold text-lg mb-6 border border-teal-primary/20">
                  1
                </div>
                <h3 className="font-bold text-neutral-dark mb-2">Register Your Business</h3>
                <p className="text-xs text-neutral-muted max-w-xs leading-relaxed">
                  Submit mobile verification, business ownership documents, and details of your staff/managers.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-14 w-14 rounded-full bg-teal-light text-teal-primary flex items-center justify-center font-bold text-lg mb-6 border border-teal-primary/20">
                  2
                </div>
                <h3 className="font-bold text-neutral-dark mb-2">Upload Venue Listings</h3>
                <p className="text-xs text-neutral-muted max-w-xs leading-relaxed">
                  Add photos, select your capacity limits, list available amenities, and configure your slot pricing structure.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-14 w-14 rounded-full bg-teal-light text-teal-primary flex items-center justify-center font-bold text-lg mb-6 border border-teal-primary/20">
                  3
                </div>
                <h3 className="font-bold text-neutral-dark mb-2">Start Receiving Bookings</h3>
                <p className="text-xs text-neutral-muted max-w-xs leading-relaxed">
                  Manage slot reservations from our calendar app, capture reviews, and enjoy direct bank transfers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS / SOCIAL PROOF */}
        <section className="w-full py-16 bg-[#FAFAF8] border-b border-neutral-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs font-bold text-teal-primary uppercase tracking-wider mb-2">Success Stories</p>
              <h2 className="text-3xl font-serif font-bold text-neutral-dark">Trusted by Venue Owners</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((t, idx) => (
                <div key={idx} className="bg-white border border-neutral-light rounded-2xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
                  <p className="text-sm text-neutral-dark leading-relaxed italic mb-6">
                    "{t.quote}"
                  </p>
                  <div>
                    <h4 className="font-bold text-neutral-dark text-sm">{t.author}</h4>
                    <p className="text-xs text-neutral-muted">{t.role} · {t.city}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQS SECTION */}
        <section id="faqs" className="w-full py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-teal-primary uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
                <HelpCircle className="h-4 w-4" /> Have Questions?
              </p>
              <h2 className="text-3xl font-serif font-bold text-neutral-dark">Frequently Asked Questions</h2>
            </div>
            
            <Accordion className="w-full bg-[#FAFAF8] border border-neutral-light rounded-2xl p-4 shadow-sm">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="border-b border-neutral-light py-2 last:border-0">
                  <AccordionTrigger className="text-sm font-bold hover:no-underline text-left text-neutral-dark">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 text-xs text-neutral-muted leading-relaxed font-sans font-light">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* FINAL CTA BANNER */}
        <section className="w-full py-16 bg-[#1A1A19] text-white text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 relative z-10 flex flex-col items-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Ready to list your venue?
            </h2>
            <p className="text-sm text-neutral-muted max-w-md mb-8 leading-relaxed">
              Register now to take advantage of zero-commission bookings and double your local visibility.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <Link href="/partner/register">
                <Button className="w-full sm:w-auto bg-teal-primary hover:bg-teal-hover text-white py-3.5 px-8 h-auto text-sm font-bold shadow-lg shadow-teal-primary/20 rounded-xl">
                  Get Started for Free
                </Button>
              </Link>
              <Link href="/partner/login">
                <Button variant="outline" className="w-full sm:w-auto border-neutral-dark text-white hover:bg-neutral-muted/10 py-3.5 px-8 h-auto text-sm font-bold rounded-xl bg-transparent">
                  Partner Login
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#111110] text-neutral-muted py-8 border-t border-neutral-dark text-xs text-center">
        <p>&copy; {new Date().getFullYear()} BookMyVenue Partner Network. All rights reserved.</p>
      </footer>
    </div>
  );
}
