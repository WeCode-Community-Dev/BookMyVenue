import { Dispatch, SetStateAction } from "react";
import { Venue } from "@bookmyvenue/types";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DeleteConformationProps = {
    deletingVenue: Venue | null;
    setDeletingVenue: Dispatch<SetStateAction<Venue | null>>;
    isPending: boolean;
    handleDeleteVenue: () => void;
};

const DeleteConformation = ({
    deletingVenue,
    setDeletingVenue,
    isPending,
    handleDeleteVenue,
}: DeleteConformationProps) => {
    return (
        <AlertDialog
            open={deletingVenue !== null}
            onOpenChange={(open) => {
                if (!open && !isPending) {
                    setDeletingVenue(null);
                }
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete venue?</AlertDialogTitle>

                    <AlertDialogDescription>
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-foreground">{deletingVenue?.name}</span>? This
                        action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleDeleteVenue}
                        disabled={isPending}
                        className="bg-red-600 text-white hover:bg-red-700"
                    >
                        {isPending ? "Deleting..." : "Delete venue"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteConformation;
