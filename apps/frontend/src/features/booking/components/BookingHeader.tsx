"use client";

import { ArrowLeft, Check } from "lucide-react";

import { Button } from "@/components/ui/button/Button";
import Link from "next/link";
import { cn } from "@/lib/Utils";

interface BookingHeaderProps {
    currentStep: 1 | 2 | 3 | 4;
}

const steps = [
    { id: 1, label: "Choose Date" },
    { id: 2, label: "Choose Package" },
    { id: 3, label: "Review Booking" },
    { id: 4, label: "Payment" },
];

export default function BookingHeader({
    currentStep,
}: BookingHeaderProps) {
    return (
        <header className="w-full border-b bg-white">
            <div className="mx-auto max-w-7xl px-5 py-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    {/* Back Button */}

                    <div className="shrink-0">
                        <Button
                            asChild
                            variant="ghost"
                            className="
                h-auto
                p-0
                text-sm
                font-semibold
                text-teal-700
                hover:bg-transparent
                hover:text-teal-800
              "
                        >
                            <Link
                                href="/"
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />

                                Back to Venue Details
                            </Link>
                        </Button>
                    </div>

                    {/* Progress */}

                    <div className="flex-1 overflow-x-auto">
                        <div className="flex min-w-[720px] items-center">
                            {steps.map((step, index) => {
                                const completed = step.id < currentStep;
                                const active = step.id === currentStep;

                                return (
                                    <div
                                        key={step.id}
                                        className="flex flex-1 items-center"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={cn(
                                                    `
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-full
                          border
                          text-xs
                          font-semibold
                          transition-all
                          `,
                                                    completed &&
                                                    "border-teal-600 bg-teal-600 text-white",
                                                    active &&
                                                    "border-teal-600 bg-teal-600 text-white",
                                                    !completed &&
                                                    !active &&
                                                    "border-slate-300 bg-white text-slate-500"
                                                )}
                                            >
                                                {completed
                                                    ? (
                                                        <Check className="h-3.5 w-3.5" />
                                                    )
                                                    : (
                                                        step.id
                                                    )}
                                            </div>

                                            <span
                                                className={cn(
                                                    "whitespace-nowrap text-sm font-medium",
                                                    active
                                                        ? "text-teal-700"
                                                        : "text-slate-600"
                                                )}
                                            >
                                                {step.label}
                                            </span>
                                        </div>

                                        {index < steps.length - 1 && (
                                            <div className="mx-4 flex-1">
                                                <div className="relative h-px bg-slate-200">
                                                    <div
                                                        className={cn(
                                                            "absolute left-0 top-0 h-px bg-teal-600",
                                                            completed ? "w-full" : "w-0"
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
