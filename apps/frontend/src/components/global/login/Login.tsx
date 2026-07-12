"use client";

import {
    ArrowLeft,
    CheckCircle2,
    Mail,
    ShieldCheck,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog/Dialog";

import { LoginStatus } from "@/lib/Constants";
import NxtImage from "next/image";
import googleIcon from "../../../../public/assets/images/login/google-color.svg";
import { loginStyle } from "./LoginStyle";
import { useEffect, useRef, useState } from "react";
import { useAuthService } from "@/features/auth/services/AuthService";

type LoginModalProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function LoginModal({
    isOpen,
    onOpenChange,
}: LoginModalProps) {
    const {
        loading,
        error,
        requestOtp,
        verifyOtp,
        changeEmail,
        clearError
    } = useAuthService();


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
            clearError();
            setStep(LoginStatus.LOGIN);
            setEmail("");
            setOtpValues(Array(6).fill(""));
            changeEmail();
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
        }
    };

    const triggerAutoVerify = async (otpString: string) => {
        const res = await verifyOtp(email, otpString);
        if (res.success) {
            setStep(LoginStatus.SUCCESS);
            setTimeout(() => {
                onOpenChange(false);
                setStep(LoginStatus.LOGIN);
                setEmail("");
                setOtpValues(Array(6).fill(""));
            }, 2000);
        }
    };

    const handleVerify = async (evt: React.FormEvent) => {
        evt.preventDefault();
        const otpString = otpValues.join("");
        if (otpString.length !== 6) return;
        await triggerAutoVerify(otpString);
    };

    const handleGoogleLogin = () => {
        console.log("Google login clicked");
    };

    const handleOtpChange = (index: number, val: string) => {
        if (val && !/^\d$/.test(val)) return;

        clearError();

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
        clearError();
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

        clearError();

        const newOtpValues = [
            ...otpValues
        ];
        for (let i = 0; i < pastedData.length; i++) {
            newOtpValues[ i ] = pastedData[ i ];
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
            <DialogContent className={loginStyle.dialogContent}>

                {/* LOGIN STEP */}
                {step === LoginStatus.LOGIN && (
                    <div className={loginStyle.loginStep}>

                        <div className="flex justify-center">
                            <div className={loginStyle.iconContainer}>
                                <ShieldCheck className={loginStyle.icon} />
                            </div>
                        </div>

                        <DialogTitle className={loginStyle.title}>
                            Welcome Back
                        </DialogTitle>

                        <p className={loginStyle.subtitle}>
                            Login or sign in to continue
                        </p>

                        {error && (
                            <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-100 text-center font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleContinue}>
                            {/* Google */}
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className={loginStyle.googleButton}
                            >
                                <NxtImage src={googleIcon} alt="Google"
                                    className={loginStyle.googleIcon}
                                />
                                Continue with Google
                            </button>

                            <div className={loginStyle.separatorWrapper}>
                                <div className={loginStyle.separatorLine} />
                                <span className={loginStyle.separatorText}>
                                    OR
                                </span>
                                <div className={loginStyle.separatorLine} />
                            </div>

                            <p className={loginStyle.formPrompt}>
                                Enter your email address
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
                                    placeholder="Email address"
                                    className={loginStyle.inputField}
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                className={loginStyle.primaryButton}
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Continue"}
                            </button>
                        </form>

                        <p className={loginStyle.disclaimer}>
                            We&apos;ll send a one-time password (OTP)
                        </p>

                    </div>
                )}

                {/* OTP STEP */}
                {step === LoginStatus.OTP && (
                    <div className={loginStyle.otpStep}>

                        <button
                            type="button"
                            onClick={() => {
                                changeEmail();
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
                            Enter OTP
                        </DialogTitle>

                        <p className={loginStyle.subtitle}>
                            We sent a 6-digit OTP to <span className="font-semibold">{email}</span>
                        </p>

                        {error && (
                            <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-100 text-center font-medium">
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
                            {loading ? "Sending..." : "Resend OTP"}
                        </p>

                    </div>
                )}

                {/* SUCCESS STEP */}
                {step === LoginStatus.SUCCESS && (
                    <div className={loginStyle.successStep}>

                        <div className="flex justify-center">
                            <div className={loginStyle.successIconContainer}>
                                <CheckCircle2 className={loginStyle.successIcon} />
                            </div>
                        </div>

                        <DialogTitle className={loginStyle.successTitle}>
                            Login Successful!
                        </DialogTitle>

                        <p className={loginStyle.successSubtitle}>
                            Welcome back 👋
                        </p>

                        <div className={loginStyle.progressBarContainer}>
                            <div className={loginStyle.progressBarFill} />
                        </div>

                        <p className={loginStyle.redirectText}>
                            Redirecting...
                        </p>

                    </div>
                )}

            </DialogContent>
        </Dialog>
    );
}
