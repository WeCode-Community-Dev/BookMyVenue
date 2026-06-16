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
import { useState } from "react";

type LoginModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function LoginModal({
    isOpen,
    onOpenChange,
}: LoginModalProps) {
    const [
        step, setStep
    ] = useState<LoginStatus>(LoginStatus.LOGIN);

    const [
        value, setValue
    ] = useState("");

    const handleContinue = () => {
        if (!value) return;
        setStep(LoginStatus.OTP);
    };

    const handleVerify = () => {
        setStep(LoginStatus.SUCCESS);

        setTimeout(() => {
            onOpenChange(false);
            setStep(LoginStatus.LOGIN);
        }, 2000);
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

                        {/* Google */}
                        <button className={loginStyle.googleButton}>
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
              Enter your mobile number or email
                        </p>

                        <div className={loginStyle.inputWrapper}>
                            <Mail className={loginStyle.inputIcon} />

                            <input
                                value={value}
                                onChange={(evt) => {
                                    return setValue(evt.target.value);
                                }}
                                placeholder="Mobile number or email address"
                                className={loginStyle.inputField}
                            />
                        </div>

                        <button
                            onClick={handleContinue}
                            className={loginStyle.primaryButton}
                        >
              Continue
                        </button>

                        <p className={loginStyle.disclaimer}>
              We&apos;ll send a one-time password (OTP)
                        </p>

                    </div>
                )}

                {/* OTP STEP */}
                {step === LoginStatus.OTP && (
                    <div className={loginStyle.otpStep}>

                        <button
                            onClick={() => {
                                return setStep(LoginStatus.LOGIN);
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
              We sent a 6-digit OTP
                        </p>

                        <div className={loginStyle.otpInputsContainer}>
                            {[
                                1, 2, 3, 4, 5, 6
                            ].map((item) => {
                                return (
                                    <input
                                        key={item}
                                        maxLength={1}
                                        className={loginStyle.otpInputItem}
                                    />
                                );
                            })}
                        </div>

                        <button
                            onClick={handleVerify}
                            className={loginStyle.otpButton}
                        >
              Verify & Login
                        </button>

                        <p className={loginStyle.resendOtp}>
              Resend OTP
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
