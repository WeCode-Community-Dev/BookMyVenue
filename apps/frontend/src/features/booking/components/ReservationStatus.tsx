/* eslint-disable */

import { Check, Clock3 } from "lucide-react";

import { format } from "date-fns";

export default function ReservationStatus({
    selectedDates = [],
    venueName,
}: {
    selectedDates?: Date[];
    venueName?: string;
}) {
    const steps = [
        {
            title: "Venue Selected",
            subtitle: venueName || "Grand Palace Convention Centre",
            completed: !!venueName,
        },
        {
            title: "Event Date Selected",
            subtitle: selectedDates.length > 0 
                ? selectedDates.map(d => format(d, "dd MMM")).join(", ") 
                : "No date selected",
            completed: selectedDates.length > 0,
        },
        {
            title: "Package Selected",
            subtitle: selectedDates.length > 0 
                ? `${selectedDates.length} Package${selectedDates.length > 1 ? "s" : ""}` 
                : "Select packages",
            completed: selectedDates.length > 0,
        },
        {
            title: "Payment Pending",
            subtitle: "Almost there!",
            completed: false,
        },
    ];
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-[18px] font-bold text-slate-900">
                Reservation Status
            </h2>

            <div className="mt-6 flex gap-6">

                {/* Timeline */}

                <div className="flex-1">

                    {steps.map((step, index) => {

                        const isLast = index === steps.length - 1;

                        return (

                            <div
                                key={step.title}
                                className="relative flex gap-4 pb-6"
                            >

                                {/* Icon + Line */}

                                <div className="relative flex flex-col items-center">

                                    {step.completed ? (

                                        <div
                                            className="
                                                z-10
                                                flex
                                                h-7
                                                w-7
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-[#0F8C84]
                                            "
                                        >
                                            <Check
                                                className="h-4 w-4 text-white"
                                            />
                                        </div>

                                    ) : (

                                        <div
                                            className="
                                                z-10
                                                h-7
                                                w-7
                                                rounded-full
                                                border-2
                                                border-slate-300
                                                bg-white
                                            "
                                        />

                                    )}

                                    {!isLast && (

                                        <div
                                            className="
                                                absolute
                                                top-7
                                                h-full
                                                w-[2px]
                                                bg-teal-100
                                            "
                                        />

                                    )}

                                </div>

                                {/* Text */}

                                <div>

                                    <h3
                                        className="
                                            text-[15px]
                                            font-semibold
                                            text-slate-900
                                        "
                                    >
                                        {step.title}
                                    </h3>

                                    <p
                                        className="
                                            mt-1
                                            text-[13px]
                                            text-slate-500
                                        "
                                    >
                                        {step.subtitle}
                                    </p>

                                </div>

                            </div>

                        );

                    })}

                </div>

                {/* Time Card */}

                <div
                    className="
                        flex
                        w-[145px]
                        shrink-0
                        flex-col
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-teal-100
                        bg-[#F2FBF9]
                        p-5
                    "
                >

                    <Clock3
                        className="
                            h-10
                            w-10
                            text-[#0F8C84]
                        "
                    />

                    <p
                        className="
                            mt-4
                            text-center
                            text-[14px]
                            text-slate-600
                        "
                    >
                        Estimated Time
                    </p>

                    <p
                        className="
                            mt-1
                            text-center
                            text-[15px]
                            font-semibold
                            text-slate-700
                        "
                    >
                        Less than
                    </p>

                    <span
                        className="
                            mt-1
                            text-[34px]
                            font-bold
                            text-[#0F8C84]
                        "
                    >
                        2 min
                    </span>

                </div>

            </div>

        </section>
    );
}