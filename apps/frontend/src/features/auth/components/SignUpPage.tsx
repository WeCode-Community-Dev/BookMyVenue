"use client";

import { CalendarDays, MapPin, PartyPopper, ShieldCheck } from "lucide-react";

import NextImage from "next/image";
import { authService } from "../services/AuthService";
import { authStyle } from "../styles/AuthStyle";

export default function SignupPage() {
    // const { submitRegistration } = authService();

    const handleRegistration = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        // submitRegistration();
    };

    return (
        <div className={authStyle.pageWrapper}>
            <div className={authStyle.container}>
                {/* LEFT SECTION */}
                <div className={authStyle.leftSection}>
                    <div>
                        <NextImage
                            src="/assets/logos/logo.png"
                            alt="BookMyVenue"
                            width={280}
                            height={80}
                            priority
                            className="mb-6 h-auto w-[180px] md:w-[220px]"
                        />
                        <h1 className={authStyle.headingClass}>
                            Every celebration starts at the
                            <span className="ml-2 text-teal-600">perfect venue</span>
                        </h1>
                        <p className={authStyle.descriptionClass}>
                            Join thousands of people who discover, book and celebrate
                            unforgettable moments.
                        </p>

                        <div className={authStyle.featureGrid}>
                            <div className={authStyle.featureCard}>
                                <div className={authStyle.featureIconWrapper}>
                                    <MapPin className={authStyle.featureIcon} />
                                </div>
                                <h3 className={authStyle.featureTitle}>Discover</h3>
                                <p className={authStyle.featureText}>Amazing Venues</p>
                            </div>

                            <div className={authStyle.featureCard}>
                                <div className={authStyle.featureIconWrapper}>
                                    <CalendarDays className={authStyle.featureIcon} />
                                </div>
                                <h3 className={authStyle.featureTitle}>Book</h3>
                                <p className={authStyle.featureText}>With Ease</p>
                            </div>

                            <div className={authStyle.featureCard}>
                                <div className={authStyle.featureIconWrapper}>
                                    <PartyPopper className={authStyle.featureIcon} />
                                </div>
                                <h3 className={authStyle.featureTitle}>Celebrate</h3>
                                <p className={authStyle.featureText}>Memories Forever</p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className={authStyle.rightSection}>
                    <div className={authStyle.formWrapper}>

                        <div className={authStyle.headerWrapper}>
                            <div className={authStyle.avatarWrapper}>
                                <div className={authStyle.avatar} />
                            </div>

                            <h2 className={authStyle.title}>Create Account</h2>
                            <p className={authStyle.subtitle}>
                                Start discovering amazing venues today.
                            </p>
                        </div>
                        <form className={authStyle.form} onSubmit={handleRegistration}>
                            <input className={authStyle.input} placeholder="Full Name" />
                            <input className={authStyle.input} placeholder="Email Address" />
                            <input className={authStyle.input} placeholder="Mobile Number" />
                            <input className={authStyle.input} placeholder="Password" />
                            <button type="submit" className={authStyle.buttonPrimary}>
                                Create Account
                            </button>
                        </form>

                        <div className={authStyle.divider}>
                            <div className={authStyle.dividerLine} />
                            <span className={authStyle.dividerText}>OR</span>
                            <div className={authStyle.dividerLine} />
                        </div>

                        <button className={authStyle.googleButton}>
                            Continue with Google
                        </button>

                        <div className={authStyle.loginText}>
                            <span>Already have an account?</span>
                            <button className={authStyle.loginButton} type="button">
                                Sign In
                            </button>
                        </div>

                        <div className={authStyle.trustGrid}>
                            <div className={authStyle.trustItem}>
                                <ShieldCheck className={authStyle.trustIcon} />
                                <p className={authStyle.trustText}>Secure</p>
                            </div>
                            <div className={authStyle.trustItem}>
                                <ShieldCheck className={authStyle.trustIcon} />
                                <p className={authStyle.trustText}>Fast</p>
                            </div>

                            <div className={authStyle.trustItem}>
                                <ShieldCheck className={authStyle.trustIcon} />
                                <p className={authStyle.trustText}>Trusted</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
