const features = [
    "5,000+ Verified Venues",
    "Secure Booking Process",
    "24/7 Customer Support"
]

const AuthBanner = () => {
    return (
        <div className="hidden lg:flex bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden flex-col justify-center px-16 py-20">

            {/* Background image overlay */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800')] bg-cover bg-center opacity-20" />

            <div className="relative z-10">
                <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                    Find Your Perfect Event Venue
                </h2>

                <p className="text-slate-300 text-lg mb-10">
                    Access thousands of verified venues across India. Book with confidence for your special occasions.
                </p>

                <ul className="space-y-4">
                    {features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-white font-medium">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default AuthBanner
