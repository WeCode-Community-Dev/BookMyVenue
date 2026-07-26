import { useModalStore } from "@/store/useModalStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const SIZE_CLASS = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
  "2xl": "sm:max-w-6xl",
};

export function ModalRoot() {
  const { modal, close } = useModalStore();

  if (!modal) return null;

  const Component = modal.component;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && close()}>
      <DialogContent
        className={cn(
          SIZE_CLASS[modal.size ?? "lg"],
          "max-h-[90vh] flex flex-col",
        )}
      >
        <DialogHeader>
          <DialogTitle>{modal.title}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pr-1">
          <Component data={modal.data} />
        </div>
        {modal.actions.length > 0 && (
          <DialogFooter className="flex-wrap gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={close}>
              Close
            </Button>
            {modal.actions.map((action, i) => (
              <Button
                key={i}
                variant={action.variant ?? "default"}
                disabled={action.disabled || action.isLoading}
                onClick={action.onClick}
              >
                {action.isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {!action.isLoading && action.icon && (
                  <span className="mr-2">{action.icon}</span>
                )}
                {action.label}
              </Button>
            ))}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
