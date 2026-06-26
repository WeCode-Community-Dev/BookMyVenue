type ListVenueWizardHeaderProps = {
  title: string;
  subtitle: string;
  currentStep: number;
  totalSteps: number;
};

export function ListVenueWizardHeader({
  title,
  subtitle,
  currentStep,
  totalSteps,
}: ListVenueWizardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-headline-md font-semibold text-on-surface">{title}</h1>
        {subtitle ? (
          <p className="text-body-sm text-on-surface-variant">{subtitle}</p>
        ) : null}
      </div>
      <p className="text-sm font-medium text-on-surface-variant">
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  );
}
