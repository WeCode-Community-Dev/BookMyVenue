import React from "react";
import { Check } from "lucide-react";

const StepIndicator = ({ currentStep }) => {
  const steps = [
    "Venue Details",
    "Amenities",
    "Pricing",
    "Review",
  ];

  return (
    <div className="flex items-center justify-between mb-10">

      {steps.map((step, index) => {
        const stepNumber = index + 1;

        return (
          <React.Fragment key={step}>

            <div className="flex flex-col items-center">

              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all
                ${
                  stepNumber < currentStep
                    ? "bg-green-500 text-white"
                    : stepNumber === currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {stepNumber < currentStep ? (
                  <Check size={18} />
                ) : (
                  stepNumber
                )}
              </div>

              <span
                className={`mt-2 text-sm font-medium
                ${
                  stepNumber === currentStep
                    ? "text-blue-600"
                    : "text-slate-500"
                }`}
              >
                {step}
              </span>

            </div>

            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 rounded-full
                ${
                  stepNumber < currentStep
                    ? "bg-green-500"
                    : "bg-slate-200"
                }`}
              />
            )}

          </React.Fragment>
        );
      })}

    </div>
  );
};

export default StepIndicator;