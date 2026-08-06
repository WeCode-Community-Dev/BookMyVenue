import { Clock, Search, Shield } from "lucide-react";

const VALUES = [
    {
        icon: Search,
        title: "Easy Search",
        description:
            "Browse thousands of verified venues across all 14 districts of Kerala. Filter by location, capacity, and budget in seconds.",
    },
    {
        icon: Shield,
        title: "Secure Booking",
        description:
            "Every booking is protected with our encrypted payment gateway. Pay with confidence — full refund policy on eligible cancellations.",
    },
    {
        icon: Clock,
        title: "24/7 Support",
        description:
            "Our dedicated team is available around the clock to help you plan, book, and coordinate your perfect event.",
    },
];

export function WhyChooseUs() {
    return (
        <section id="about" className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
                        Why Choose Us
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                        Simple. Secure. Stress-Free.
                    </h2>
                    <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                        We make venue booking in Kerala effortless — from first search to final confirmation.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {VALUES.map(({ icon: Icon, title, description }) => (
                        <div
                            key={title}
                            className="group text-center p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                                <Icon className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
