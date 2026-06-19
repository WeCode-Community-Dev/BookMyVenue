"use client";

import { CATEGORIES } from "@/lib/data";

interface CategoriesProps {
    activeCategory: string;
    setActiveCategory: (cat: string) => void;
}

export function Categories({ activeCategory, setActiveCategory }: CategoriesProps) {
    return (
        <section id="categories" className="py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
                        Browse by Type
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground">What Are You Planning?</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {CATEGORIES.map(({ label, icon: Icon, count }) => {
                        const isActive = activeCategory === label;
                        return (
                            <button
                                key={label}
                                onClick={() => setActiveCategory(isActive ? "All" : label)}
                                className={`group flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 ${
                                    isActive
                                        ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105"
                                        : "border-border bg-card text-foreground hover:border-primary/40 hover:shadow-md"
                                }`}
                            >
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                                        isActive ? "bg-primary-foreground/20" : "bg-secondary group-hover:bg-muted"
                                    }`}
                                >
                                    <Icon className={`w-6 h-6 ${isActive ? "text-accent" : "text-primary"}`} />
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-sm">{label}</p>
                                    <p className={`text-xs mt-0.5 ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                        {count}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
