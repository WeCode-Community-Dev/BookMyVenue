import { SpinnerOne } from "@mynaui/icons-react";

export default function Loading({LoadingText}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#2b5155]">
            <SpinnerOne className="w-10 h-10 animate-spin mb-4 text-[#2a5660]" />
            <p className="font-semibold text-lg tracking-wide">{LoadingText}</p>
        </div>
    );
}