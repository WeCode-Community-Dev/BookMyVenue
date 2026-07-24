import { cn } from "@/lib/Utils";

export const steps = [
    "Choose Date", "Choose Package", "Review", "Payment"
];

export const getStepClass = (completed: boolean, active: boolean) => {
    return cn(
        [
            "flex h-11 w-11 items-center justify-center",
            "rounded-full border-2",
            "text-sm font-semibold",
            "transition-all duration-300",
        ].join(" "),
        completed && "border-teal-600 bg-teal-600 text-white",
        active && "border-teal-600 bg-white text-teal-600 shadow-md",
        !completed && !active && "border-slate-300 bg-white text-slate-500",
    ); 
};

export const getStepTextClass = (active: boolean) => {
    return cn("mt-3 text-sm font-medium", active ? "text-teal-700" : "text-slate-500"); 
};

export const getProgressBarClass = (completed: boolean) => {
    return cn(
        "h-full rounded-full transition-all duration-500",
        completed ? "w-full bg-teal-600" : "w-0 bg-teal-600",
    ); 
};
