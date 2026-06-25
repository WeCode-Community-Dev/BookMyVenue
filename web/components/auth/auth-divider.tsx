import { Separator } from "@/components/ui/separator";

type AuthDividerProps = {
  label?: string;
};

export function AuthDivider({ label = "Or continue with" }: AuthDividerProps) {
  return (
    <div className="relative flex items-center">
      <Separator className="flex-1" />
      <span className="px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </span>
      <Separator className="flex-1" />
    </div>
  );
}
