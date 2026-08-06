import { Progress } from "@/components/ui/progress";

type ListVenueProgressProps = {
  currentStep: number;
  totalSteps: number;
};

export function ListVenueProgress({
  currentStep,
  totalSteps,
}: ListVenueProgressProps) {
  const progressValue = (currentStep / totalSteps) * 100;

  return <Progress value={progressValue} className="h-2" />;
}
