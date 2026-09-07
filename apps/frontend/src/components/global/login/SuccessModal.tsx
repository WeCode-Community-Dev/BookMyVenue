"use client";

import { AppText } from "@/lib/language/LanguageHelper";
import { CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog/Dialog";
import { loginStyle } from "./LoginStyle";

interface SuccessModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    titleTextName: string;
}

export function SuccessStepContent({ titleTextName }: { titleTextName: string }) {
    return (
        <div className={loginStyle.successStep}>
            <div className="flex justify-center">
                <div className={loginStyle.successIconContainer}>
                    <CheckCircle2 className={loginStyle.successIcon} />
                </div>
            </div>

            <DialogTitle className={loginStyle.successTitle}>
                <AppText textName={titleTextName} textModule="LABEL" />
            </DialogTitle>

            <p className={loginStyle.successSubtitle}>
                <AppText textName="WELCOME_BACK_EMOJI" textModule="LABEL" />
            </p>

            <div className={loginStyle.progressBarContainer}>
                <div className={loginStyle.progressBarFill} />
            </div>

            <p className={loginStyle.redirectText}>
                <AppText textName="REDIRECTING" textModule="LABEL" />
            </p>
        </div>
    );
}

export default function SuccessModal({
    isOpen,
    onOpenChange,
    titleTextName,
}: SuccessModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className={loginStyle.dialogContent} showCloseButton={false}>
                <SuccessStepContent titleTextName={titleTextName} />
            </DialogContent>
        </Dialog>
    );
}
