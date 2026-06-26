type ListVenueStepPlaceholderProps = {
  stepTitle: string;
  stepNumber: number;
};

export function ListVenueStepPlaceholder({
  stepTitle,
  stepNumber,
}: ListVenueStepPlaceholderProps) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-outline-variant/60 bg-surface-container-low/50 p-8 text-center">
      <p className="text-sm font-medium text-on-surface-variant">
        Step {stepNumber}
      </p>
      <p className="text-lg font-semibold text-on-surface">{stepTitle}</p>
      <p className="max-w-sm text-sm text-on-surface-variant">
        This step will be available soon. Continue to preview the wizard flow.
      </p>
    </div>
  );
}
