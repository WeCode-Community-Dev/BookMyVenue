import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type ListVenueFormActionsProps = {
  currentStep: number;
  totalSteps: number;
  continueLabel?: string;
  hideContinue?: boolean;
  onPrevious: () => void;
  onContinue: () => void;
};

export function ListVenueFormActions({
  currentStep,
  totalSteps,
  continueLabel = "Continue",
  hideContinue = false,
  onPrevious,
  onContinue,
}: ListVenueFormActionsProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex flex-col-reverse gap-3 border-t border-outline-variant/40 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <Button
        type="button"
        variant="outline"
        className="h-10 gap-2"
        onClick={onPrevious}
        disabled={isFirstStep}
      >
        <ArrowLeft className="size-4" />
        Previous
      </Button>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="button"
          variant="ghost"
          className="h-10 text-on-surface-variant"
          onClick={() => {}}
        >
          Save as Draft
        </Button>
        {!hideContinue ? (
          <Button
            type="button"
            className="h-10 gap-2"
            onClick={onContinue}
            disabled={isLastStep}
          >
            {isLastStep ? "Finish" : continueLabel}
            {!isLastStep && <ArrowRight className="size-4" />}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
