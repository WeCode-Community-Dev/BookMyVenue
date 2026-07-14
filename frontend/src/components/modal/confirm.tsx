import React from "react";

import {
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    DialogContentText,
} from "@mui/material";

export interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    danger?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

function ConfirmDialog({
    open,
    title = "Confirmation",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
    danger = false,
    onConfirm,
    onClose,
}: ConfirmDialogProps) {

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={loading}
                >
                    {cancelText}
                </Button>

                <Button
                    variant="contained"
                    color={danger ? "error" : "primary"}
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        confirmText
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}


export default ConfirmDialog;