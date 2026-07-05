import { MapPin, Phone, Mail } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import Image from "next/image";

export function Footer() {
    return (
        <footer id="contact" className="bg-foreground text-background/80 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full  flex items-center justify-center">
                                <Image src="/logo.svg" alt="BookMyVenue" width={40} height={40} />
                            </div>
                            <span className="text-xl font-bold text-background">BookMyVenue</span>
                        </div>
                        <p className="text-sm leading-relaxed mb-5">
                            Kerala&apos;s most trusted venue discovery and booking platform. Covering all 14
                            districts from Kasaragod to Thiruvananthapuram.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-background font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            {["Explore Venues", "Categories", "Pricing", "Blog", "FAQs"].map((link) => (
                                <li key={link}>
                                    <a href="#" className="hover:text-accent transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-background font-bold mb-4">Categories</h4>
                        <ul className="space-y-2 text-sm">
                            {CATEGORIES.map(({ label }) => (
                                <li key={label}>
                                    <a href="#" className="hover:text-accent transition-colors">
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-background font-bold mb-4">Contact Us</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                                <span>Kochi, Kerala, India — PIN 682001</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-accent shrink-0" />
                                <a href="tel:+919876543210" className="hover:text-accent transition-colors">
                                    +91 98765 43210
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-accent shrink-0" />
                                <a
                                    href="mailto:hello@BookMyVenue.co.in"
                                    className="hover:text-accent transition-colors"
                                >
                                    hello@BookMyVenue.co.in
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-background/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/40">
                    <span>© 2026 BookMyVenue. All rights reserved.</span>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-background/70 transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-background/70 transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="hover:text-background/70 transition-colors">
                            Cookie Policy
                        </a>
                    </div>
                    <span>English (IN) · INR ₹</span>
                </div>
            </div>
        </footer>
    );
}
