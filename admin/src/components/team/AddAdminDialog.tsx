import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function AddAdminDialog({
  promoteOpen,
  setPromoteOpen,
  promoteEmail,
  setPromoteEmail,
  handlePromote,
  isPending,
}: {
  promoteOpen: boolean;
  setPromoteOpen: (open: boolean) => void;
  promoteEmail: string;
  setPromoteEmail: (email: string) => void;
  handlePromote: () => void;
  isPending: boolean;
}) {
  return (
    <Dialog open={promoteOpen} onOpenChange={setPromoteOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Promote User to Admin</DialogTitle>
          <DialogDescription>
            Enter the email of an existing registered user to grant them
            administrator privileges.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <Label htmlFor="promote-email">User Email *</Label>
          <Input
            id="promote-email"
            type="email"
            value={promoteEmail}
            onChange={(e) => setPromoteEmail(e.target.value)}
            placeholder="user@example.com"
            onKeyDown={(e) => e.key === "Enter" && handlePromote()}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setPromoteOpen(false);
              setPromoteEmail("");
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={!promoteEmail.trim() || isPending}
            onClick={handlePromote}
          >
            {isPending ? "Promoting…" : "Promote User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
