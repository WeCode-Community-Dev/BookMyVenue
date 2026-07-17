"use client";

import { ArrowLeft, Check } from "lucide-react";

import Link from "next/link";
import clsx from "clsx";

const steps = [
    { id: 1, title: "Choose Date" },
    { id: 2, title: "Choose Package" },
    { id: 3, title: "Review Booking" },
    { id: 4, title: "Payment" },
];

interface BookingStepperProps {
    currentStep: number;
}

export default function BookingStepper({
    currentStep,
}: BookingStepperProps) {
    return (
        <div className="flex items-center gap-8 mb-6">
            {/* Back Button */}
            <div className="ml-0">
                <Link
                    href="/venues"
                    className="ml-0 flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-800"
                >
                    <ArrowLeft size={18} />
                    Back to Venue Details
                </Link>
            </div>

            {/* Stepper */}
            <div className="flex-1 flex items-center ml-8">
                {steps.map((step, index) => {
                    const completed = currentStep > step.id;
                    const active = currentStep === step.id;

                    return (
                        <div
                            key={step.id}
                            className="flex items-center flex-1 last:flex-none"
                        >
                            <div className="flex items-center gap-3">
                                {/* Circle */}
                                <div
                                    className={clsx(
                                        "flex h-10 w-10 items-center justify-center rounded-full border text-base" +
                                        "font-medium leading-none text-sm font-semibold transition-colors",
                                        completed &&
                                        "bg-teal-600 border-teal-600 text-white",
                                        active &&
                                        "bg-teal-600 border-teal-600 text-white",
                                        !completed &&
                                        !active &&
                                        "bg-white border-gray-300 text-gray-600"
                                    )}
                                >
                                    {completed
                                        ? (
                                            <Check size={16} strokeWidth={3} />
                                        )
                                        : (
                                            step.id
                                        )}
                                </div>

                                {/* Title */}
                                <span
                                    className={clsx(
                                        "text-sm whitespace-nowrap",
                                        active
                                            ? "font-semibold text-gray-900"
                                            : "text-gray-500"
                                    )}
                                >
                                    {step.title}
                                </span>
                            </div>

                            {/* Connector */}
                            {index !== steps.length - 1 && (
                                <div className="flex-1 mx-5 border-t border-dashed border-gray-300" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
