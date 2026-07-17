"use client";

import { AppText, getText } from "@/lib/language/LanguageHelper";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog/Dialog";
import { useEffect, useRef, useState } from "react";

import { LoginStatus } from "@/lib/Constants";
import NxtImage from "next/image";
import { SuccessStepContent } from "./SuccessModal";
import googleIcon from "../../../../public/assets/images/login/google-color.svg";
import { loginStyle } from "./LoginStyle";
import { useAuthService } from "@/features/auth/services/AuthService";

type LoginModalProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {

    const { loading, requestOtp, verifyOtp, loginWithGoogle } = useAuthService();
    const [
        error, setError
    ] = useState<string | null>(null);

    const [
        step, setStep 
    ] = useState<LoginStatus>(LoginStatus.LOGIN);

    const [
        email, setEmail
    ] = useState("");

    const [
        otpValues, setOtpValues
    ] = useState<string[]>(Array(6).fill(""));

    const inputRefs = useRef<(HTMLInputElement | null)[]>([
    ]);

    useEffect(() => {
        
        if (isOpen) {
            setError(null);
            setStep(LoginStatus.LOGIN);
            setEmail("");
            setOtpValues(Array(6).fill(""));
        }
    }, [
        isOpen
    ]);

    useEffect(() => {
        if (step === LoginStatus.OTP) {
            setTimeout(() => {
                inputRefs.current[ 0 ]?.focus();
            }, 50);
        }
    }, [
        step
    ]);

    const handleContinue = async (evt: React.FormEvent) => {
        evt.preventDefault();
        if (!email) return;
        const res = await requestOtp(email);
        if (res.success) {
            setStep(LoginStatus.OTP);
        } else {
            setError(res.error || "Failed to send OTP");
        }
    };

    const triggerAutoVerify = async (otp: string) => {
        const res = await verifyOtp(email, otp);
        if (res.success) {
            setStep(LoginStatus.SUCCESS);
            setOtpValues(Array(6).fill(""));
            setTimeout(() => {
                onOpenChange(false);
                setOtpValues(Array(6).fill(""));
            }, 2000);
        } else {
            setError(res.error || "Verification failed");
        }
    };

    const handleVerify = async (evt: React.FormEvent) => {
        evt.preventDefault();
        const otpString = otpValues.join("");
        if (otpString.length !== 6) return;
        await triggerAutoVerify(otpString);
    };

    const handleOtpChange = (index: number, val: string) => {
        if (val && !/^\d$/.test(val)) return;

        setError(null);

        const newOtpValues = [
            ...otpValues
        ];
        newOtpValues[ index ] = val;
        setOtpValues(newOtpValues);

        if (val && index < 5) {
            inputRefs.current[ index + 1 ]?.focus();
        }

        const otpString = newOtpValues.join("");
        if (otpString.length === 6) {
            triggerAutoVerify(otpString);
        }
    };

    const handleOtpKeyDown = (index: number, evt: React.KeyboardEvent<HTMLInputElement>) => {
        setError(null);
        if (evt.key === "Backspace") {
            if (!otpValues[ index ] && index > 0) {
                const newOtpValues = [
                    ...otpValues
                ];
                newOtpValues[ index - 1 ] = "";
                setOtpValues(newOtpValues);
                inputRefs.current[ index - 1 ]?.focus();
            } else {
                const newOtpValues = [
                    ...otpValues
                ];
                newOtpValues[ index ] = "";
                setOtpValues(newOtpValues);
            }
        }
    };

    const handleOtpPaste = (evt: React.ClipboardEvent<HTMLInputElement>) => {
        evt.preventDefault();
        const pastedData = evt.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        setError(null);

        const newOtpValues = [
            ...otpValues
        ];
        for (let index = 0; index < pastedData.length; index++) {
            newOtpValues[ index ] = pastedData[ index ];
        }
        setOtpValues(newOtpValues);

        const otpString = newOtpValues.join("");
        if (otpString.length === 6) {
            triggerAutoVerify(otpString);
        } else {
            const focusIndex = Math.min(pastedData.length, 5);
            inputRefs.current[ focusIndex ]?.focus();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className={loginStyle.dialogContent} showCloseButton={false}>

                {/* LOGIN STEP */}
                {step === LoginStatus.LOGIN && (
                    <div className={loginStyle.loginStep}>

                        <div className="flex justify-center">
                            <div className={loginStyle.iconContainer}>
                                <ShieldCheck className={loginStyle.icon} />
                            </div>
                        </div>

                        <DialogTitle className={loginStyle.title}>
                            <AppText textName="WELCOME_BACK" textModule="LABEL" />
                        </DialogTitle>

                        <p className={loginStyle.subtitle}>
                            <AppText textName="LOGIN_OR_SIGNIN" textModule="LABEL" />
                        </p>

                        {error && (
                            <div className={loginStyle.errorContainer}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleContinue}>
                            {/* Google */}
                            <button
                                type="button"
                                onClick={loginWithGoogle}
                                className={loginStyle.googleButton}
                            >
                                <NxtImage src={googleIcon} alt="Google"
                                    className={loginStyle.googleIcon}
                                />
                                <AppText textName="CONTINUE_GOOGLE" textModule="BUTTON" />
                            </button>

                            <div className={loginStyle.separatorWrapper}>
                                <div className={loginStyle.separatorLine} />
                                <span className={loginStyle.separatorText}>
                                    <AppText textName="OR" textModule="LABEL" />
                                </span>
                                <div className={loginStyle.separatorLine} />
                            </div>

                            <p className={loginStyle.formPrompt}>
                                <AppText textName="ENTER_EMAIL_PROMPT" textModule="LABEL" />
                            </p>

                            <div className={loginStyle.inputWrapper}>
                                <Mail className={loginStyle.inputIcon} />

                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(evt) => {
                                        return setEmail(evt.target.value);
                                    }}
                                    placeholder={getText("EMAIL_ADDRESS", "INPUT_LABELS")}
                                    className={loginStyle.inputField}
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                className={loginStyle.primaryButton}
                                disabled={loading}
                            >
                                {loading ?
                                    (
                                        <AppText textName="SENDING" textModule="BUTTON" />
                                    )
                                    :
                                    (
                                        <AppText textName="CONTINUE" textModule="BUTTON" />
                                    )}
                            </button>
                        </form>

                        <p className={loginStyle.disclaimer}>
                            <AppText textName="OTP_DISCLAIMER" textModule="LABEL" />
                        </p>

                    </div>
                )}

                {/* OTP STEP */}
                {step === LoginStatus.OTP && (
                    <div className={loginStyle.otpStep}>

                        <button
                            type="button"
                            onClick={() => {
                                setStep(LoginStatus.LOGIN);
                            }}
                            className={loginStyle.backButton}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>

                        <div className="flex justify-center">
                            <div className={loginStyle.iconContainer}>
                                <Mail className={loginStyle.icon} />
                            </div>
                        </div>

                        <DialogTitle className={loginStyle.otpTitle}>
                            <AppText textName="ENTER_OTP" textModule="LABEL" />
                        </DialogTitle>

                        <p className={loginStyle.subtitle}>
                            <AppText textName="SENT_OTP" textModule="LABEL" append={{ email }} />
                        </p>

                        {error && (
                            <div className={loginStyle.errorContainer}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleVerify}>
                            <div className={loginStyle.otpInputsContainer}>
                                {[
                                    0, 1, 2, 3, 4, 5
                                ].map((index) => {
                                    return (
                                        <input
                                            key={index}
                                            ref={(el) => {
                                                inputRefs.current[ index ] = el;
                                            }}
                                            value={otpValues[ index ]}
                                            onChange={(evt) => {
                                                return handleOtpChange(index, evt.target.value);
                                            }}
                                            onKeyDown={(evt) => {
                                                return handleOtpKeyDown(index, evt);
                                            }}
                                            onPaste={handleOtpPaste}
                                            maxLength={1}
                                            disabled={loading}
                                            className={loginStyle.otpInputItem}
                                        />
                                    );
                                })}
                            </div>
                        </form>

                        <p
                            onClick={async () => {
                                if (loading) return;
                                await requestOtp(email);
                            }}
                            className={loginStyle.resendOtp}
                        >
                            {loading
                                ? (
                                    <AppText textName="SENDING" textModule="BUTTON" />
                                )
                                : (
                                    <AppText textName="RESEND_OTP" textModule="BUTTON" />
                                )}
                        </p>

                    </div>
                )}

                {/* SUCCESS STEP */}
                {step === LoginStatus.SUCCESS && (
                    <SuccessStepContent titleTextName="LOGIN_SUCCESSFUL" />
                )}

            </DialogContent>
        </Dialog>
    );
}
