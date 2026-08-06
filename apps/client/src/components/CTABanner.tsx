import Link from "next/link";

export function CTABanner() {
    return (
        <section id="register_venue" className="relative overflow-hidden bg-primary py-20">
            <div className="absolute top-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="relative max-w-3xl mx-auto px-4 text-center">
                <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-4">
                    List Your Venue
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-5">
                    Own a Venue in Kerala?
                    <br />
                    Reach Thousands of Customers
                </h2>
                <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
                    Join 700+ venues already on our platform. List for free and start receiving bookings from
                    across the state within days.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/sign-up/owner"
                        className="bg-accent text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-accent/90 transition-colors"
                    >
                        List Your Venue — Free
                    </Link>
                </div>
            </div>
        </section>
    );
}
