"use client";

import { CalendarDays, MapPin, PartyPopper, ShieldCheck } from "lucide-react";
import { AppText, getText } from "@/lib/language/LanguageHelper";

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
                            <AppText textName="EVERY_CELEBRATION" textModule="LABEL" />
                            <span className="ml-2 text-teal-600">
                                <AppText textName="PERFECT_VENUE" textModule="LABEL" />
                            </span>
                        </h1>
                        <p className={authStyle.descriptionClass}>
                            <AppText textName="AUTH_DESCRIPTION" textModule="MESSAGES" />
                        </p>

                        <div className={authStyle.featureGrid}>
                            <div className={authStyle.featureCard}>
                                <div className={authStyle.featureIconWrapper}>
                                    <MapPin className={authStyle.featureIcon} />
                                </div>
                                <h3 className={authStyle.featureTitle}>
                                    <AppText textName="DISCOVER" textModule="LABEL" />
                                </h3>
                                <p className={authStyle.featureText}>
                                    <AppText textName="AMAZING_VENUES" textModule="LABEL" />
                                </p>
                            </div>

                            <div className={authStyle.featureCard}>
                                <div className={authStyle.featureIconWrapper}>
                                    <CalendarDays className={authStyle.featureIcon} />
                                </div>
                                <h3 className={authStyle.featureTitle}>
                                    <AppText textName="BOOK" textModule="LABEL" />
                                </h3>
                                <p className={authStyle.featureText}>
                                    <AppText textName="WITH_EASE" textModule="LABEL" />
                                </p>
                            </div>

                            <div className={authStyle.featureCard}>
                                <div className={authStyle.featureIconWrapper}>
                                    <PartyPopper className={authStyle.featureIcon} />
                                </div>
                                <h3 className={authStyle.featureTitle}>
                                    <AppText textName="CELEBRATE" textModule="LABEL" />
                                </h3>
                                <p className={authStyle.featureText}>
                                    <AppText textName="MEMORIES_FOREVER" textModule="LABEL" />
                                </p>
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

                            <h2 className={authStyle.title}>
                                <AppText textName="CREATE_ACCOUNT" textModule="BUTTON" />
                            </h2>
                            <p className={authStyle.subtitle}>
                                <AppText textName="START_DISCOVERING" textModule="LABEL" />
                            </p>
                        </div>
                        <form className={authStyle.form} onSubmit={handleRegistration}>
                            <input className={authStyle.input} placeholder={getText("FULL_NAME", "INPUT_LABELS")} />
                            <input className={authStyle.input} placeholder={getText("EMAIL_ADDRESS", "INPUT_LABELS")} />
                            <input className={authStyle.input} placeholder={getText("MOBILE_NUMBER", "INPUT_LABELS")} />
                            <input className={authStyle.input} placeholder={getText("PASSWORD", "INPUT_LABELS")} />
                            <button type="submit" className={authStyle.buttonPrimary}>
                                <AppText textName="CREATE_ACCOUNT" textModule="BUTTON" />
                            </button>
                        </form>

                        <div className={authStyle.divider}>
                            <div className={authStyle.dividerLine} />
                            <span className={authStyle.dividerText}>
                                <AppText textName="OR" textModule="LABEL" />
                            </span>
                            <div className={authStyle.dividerLine} />
                        </div>

                        <button className={authStyle.googleButton}>
                            <AppText textName="CONTINUE_GOOGLE" textModule="BUTTON" />
                        </button>

                        <div className={authStyle.loginText}>
                            <span>
                                <AppText textName="ALREADY_HAVE_ACCOUNT" textModule="LABEL" />
                            </span>
                            <button className={authStyle.loginButton} type="button">
                                <AppText textName="SIGN_IN" textModule="BUTTON" />
                            </button>
                        </div>

                        <div className={authStyle.trustGrid}>
                            <div className={authStyle.trustItem}>
                                <ShieldCheck className={authStyle.trustIcon} />
                                <p className={authStyle.trustText}>
                                    <AppText textName="SECURE" textModule="LABEL" />
                                </p>
                            </div>
                            <div className={authStyle.trustItem}>
                                <ShieldCheck className={authStyle.trustIcon} />
                                <p className={authStyle.trustText}>
                                    <AppText textName="FAST" textModule="LABEL" />
                                </p>
                            </div>

                            <div className={authStyle.trustItem}>
                                <ShieldCheck className={authStyle.trustIcon} />
                                <p className={authStyle.trustText}>
                                    <AppText textName="TRUSTED" textModule="LABEL" />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
