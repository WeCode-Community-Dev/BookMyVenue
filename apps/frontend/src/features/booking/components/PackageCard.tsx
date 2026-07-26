/* eslint-disable */

import {
    Check,
    Moon,
    Sun,
    Users,
} from "lucide-react";

type PackageCardProps = {
    date: string;
    title: string;
    time: string;
    guests: string;
    price: string;
    available?: string;
    selected?: boolean;
    evening?: boolean;
};

export default function PackageCard({
    date,
    title,
    time,
    guests,
    price,
    available,
    selected = false,
    evening = false,
}: PackageCardProps) {
    return (
        <div
            className={`
                w-[330px]
                rounded-2xl
                border
                bg-white
                shadow-sm
                transition-all
                ${
                    selected
                        ? "border-[#0F8C84] ring-1 ring-[#0F8C84]"
                        : "border-slate-200"
                }
            `}
        >

            {/* Top */}

            <div className="p-4">

                <div className="flex items-start justify-between">

                    <span
                        className="
                            rounded-full
                            bg-teal-50
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-[#0F8C84]
                        "
                    >
                        {date}
                    </span>

                    <div
                        className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-orange-50
                        "
                    >
                        {evening ? (
                            <Moon className="h-6 w-6 text-purple-500" />
                        ) : (
                            <Sun className="h-6 w-6 text-orange-400" />
                        )}
                    </div>

                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    {time}
                </p>

                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">

                    <Users className="h-4 w-4" />

                    {guests}

                </div>

                <div className="mt-5 flex items-center justify-between">

                    <span className="text-[28px] font-bold text-slate-900">
                        {price}
                    </span>

                    {available && (
                        <span
                            className="
                                rounded-full
                                bg-emerald-50
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                text-emerald-700
                            "
                        >
                            {available}
                        </span>
                    )}

                </div>

            </div>

            {/* Bottom Button */}

            {selected ? (
                <button
                    className="
                        flex
                        h-12
                        w-full
                        items-center
                        justify-center
                        rounded-b-2xl
                        bg-[#0F8C84]
                        text-white
                        font-semibold
                    "
                >
                    <Check className="mr-2 h-4 w-4" />
                    Selected
                </button>
            ) : (
                <button
                    className="
                        h-12
                        w-full
                        rounded-b-2xl
                        border-t
                        border-slate-200
                        font-semibold
                        hover:bg-slate-50
                    "
                >
                    Select Package
                </button>
            )}

        </div>
    );
}