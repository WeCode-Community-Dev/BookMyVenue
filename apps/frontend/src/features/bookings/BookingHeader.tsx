/* eslint-disable */

import { ArrowLeft } from "lucide-react";

type BookingHeaderProps = {
    currentStep: number;
};

const steps = [
    "Choose Date",
    "Choose Package",
    "Review Booking",
    "Payment",
];

export default function BookingHeader({
    currentStep,
}: BookingHeaderProps) {
    return (
        <header className="space-y-6 py-4">
            {/* Back Button */}

            <button
                type="button"
                className="
                    inline-flex
                    items-center
                    gap-2
                    text-[15px]
                    font-medium
                    text-teal-700
                    transition-colors
                    hover:text-teal-800
                "
            >
                <ArrowLeft className="h-4 w-4" />

                Back to Venue Details
            </button>

            {/* Stepper */}

            <div className="flex items-center justify-center">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;

                    const active = currentStep === stepNumber;

                    const completed = currentStep > stepNumber;

                    return (
                        <div
                            key={step}
                            className="flex items-center"
                        >
                            {/* Circle + Label */}

                            <div className="flex items-center gap-3">
                                <div
                                    className={`
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        text-sm
                                        font-semibold
                                        transition-all
                                        ${
                                            active
                                                ? "border-teal-700 bg-teal-700 text-white"
                                                : completed
                                                    ? "border-teal-700 bg-teal-700 text-white"
                                                    : "border-slate-300 bg-white text-slate-600"
                                        }
                                    `}
                                >
                                    {stepNumber}
                                </div>

                                <span
                                    className={`
                                        text-[15px]
                                        font-medium
                                        whitespace-nowrap
                                        ${
                                            active
                                                ? "text-teal-700"
                                                : "text-slate-700"
                                        }
                                    `}
                                >
                                    {step}
                                </span>
                            </div>

                            {/* Connector */}

                            {index !== steps.length - 1 && (
                                <div
                                    className="
                                        mx-5
                                        h-px
                                        w-16
                                        border-t
                                        border-dashed
                                        border-slate-300
                                    "
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </header>
    );
}