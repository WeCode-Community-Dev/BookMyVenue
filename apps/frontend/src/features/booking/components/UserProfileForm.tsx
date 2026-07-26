/* eslint-disable */
"use client";

import { AppText, getText } from "@/lib/language/LanguageHelper";
import { CheckCircle, Eye, EyeOff, Lock, Mail, Phone, ShieldAlert, User } from "lucide-react";
import React, { useEffect, useState } from "react";

import { useAuthService } from "@/features/auth/services/AuthService";
import { userProfileFormStyle } from "@/features/booking/styles/UserProfileFormStyle";

interface UserProfileFormProps {
    onConfirmProfile: (confirmed: boolean) => void;
}

export default function UserProfileForm({ onConfirmProfile }: UserProfileFormProps) {
    const { user, updateUserProfile } = useAuthService();

    const [
        formData, setFormData
    ] = useState({
        name: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [
        showPassword, setShowPassword
    ] = useState(false);

    const [
        showConfirmPassword, setShowConfirmPassword
    ] = useState(false);

    const [
        isEditing, setIsEditing
    ] = useState(true);

    const [
        isConfirmed, setIsConfirmed
    ] = useState(false);

    const [
        formError, setFormError
    ] = useState<string | null>(null);

    const [
        formSuccess, setFormSuccess
    ] = useState<string | null>(null);

    const [
        loading, setLoading
    ] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
                password: "",
                confirmPassword: "",
            });
            
            // If user profile is already fully complete (name and phone set, and password set)
            // we can default to showing a confirmed/saved view, but allow editing.
            if (user.name && user.phone && user.isPasswordSet) {
                setIsEditing(false);
                setIsConfirmed(true);
                onConfirmProfile(true);
            }
        }
    }, [
        user
    ]);

    if (!user) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormError(null);
        setFormData((prev) => {
            return {
                ...prev,
                [ e.target.name ]: e.target.value,
            }; 
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);

        const { name, phone, password, confirmPassword } = formData;

        if (!name.trim()) {
            setFormError(getText("NAME_REQUIRED", "MESSAGES"));
            return;
        }

        if (!phone.trim()) {
            setFormError(getText("PHONE_REQUIRED", "MESSAGES"));
            return;
        }

        const requiresPassword = !user.isPasswordSet;
        if (requiresPassword) {
            if (!password) {
                setFormError(getText("PASSWORD_REQUIRED", "MESSAGES"));
                return;
            }

            if (password.length < 6) {
                setFormError(getText("PASSWORD_MIN_LENGTH", "MESSAGES"));
                return;
            }

            if (password !== confirmPassword) {
                setFormError(getText("PASSWORDS_DONT_MATCH", "MESSAGES"));
                return;
            }
        }

        setLoading(true);
        try {
            const res = await updateUserProfile(name, phone, requiresPassword ? password : undefined);
            if (res.success) {
                setFormSuccess(getText("PROFILE_UPDATE_SUCCESS", "MESSAGES"));
                setIsEditing(false);
                setIsConfirmed(true);
                onConfirmProfile(true);
            } else {
                setFormError(res.error || getText("PROFILE_UPDATE_FAILED", "MESSAGES"));
                onConfirmProfile(false);
            }
        } catch (err: any) {
            setFormError(err.message || getText("UNEXPECTED_ERROR", "MESSAGES"));
            onConfirmProfile(false);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setIsConfirmed(false);
        onConfirmProfile(false);
        setFormSuccess(null);
    };

    return (
        <section className={userProfileFormStyle.card}>
            {/* Header */}
            <div className={userProfileFormStyle.header}>
                <div className={userProfileFormStyle.iconWrapper}>
                    <User className={userProfileFormStyle.icon} />
                </div>
                <div className={userProfileFormStyle.headerContent}>
                    <h2 className={userProfileFormStyle.title}>
                        <AppText textName="CONFIRM_PERSONAL_DETAILS" textModule="LABEL" />
                    </h2>
                    <p className={userProfileFormStyle.subtitle}>
                        <AppText textName="CONFIRM_DETAILS_SUBTITLE" textModule="LABEL" />
                    </p>
                </div>
                {isConfirmed && !isEditing && (
                    <span className={userProfileFormStyle.verifiedBadge}>
                        <CheckCircle className="h-3.5 w-3.5" /> 
                        <AppText textName="VERIFIED" textModule="LABEL" />
                    </span>
                )}
            </div>

            {/* Content */}
            <div className={userProfileFormStyle.content}>
                {!isEditing && isConfirmed ? (
                    /* Read-only Summary View */
                    <div className={userProfileFormStyle.summaryView}>
                        <div className={userProfileFormStyle.summaryGrid}>
                            <div className={userProfileFormStyle.summaryField}>
                                <span className={userProfileFormStyle.summaryLabel}>
                                    <AppText textName="FULL_NAME" textModule="INPUT_LABELS" />
                                </span>
                                <p className={userProfileFormStyle.summaryValue}>{user.name}</p>
                            </div>
                            <div className={userProfileFormStyle.summaryField}>
                                <span className={userProfileFormStyle.summaryLabel}>
                                    <AppText textName="EMAIL_ADDRESS" textModule="INPUT_LABELS" />
                                </span>
                                <p className={userProfileFormStyle.summaryValue}>{user.email}</p>
                            </div>
                            <div className={userProfileFormStyle.summaryField}>
                                <span className={userProfileFormStyle.summaryLabel}>
                                    <AppText textName="MOBILE_NUMBER" textModule="INPUT_LABELS" />
                                </span>
                                <p className={userProfileFormStyle.summaryValue}>{user.phone}</p>
                            </div>
                        </div>
                        <div className={userProfileFormStyle.summaryFooter}>
                            <span className={userProfileFormStyle.passwordStatusText}>
                                {user.isPasswordSet ? (
                                    <AppText textName="PASSWORD_IS_SET" textModule="LABEL" />
                                ) : (
                                    <AppText textName="PLEASE_SET_PASSWORD" textModule="LABEL" />
                                )}
                            </span>
                            <button
                                type="button"
                                onClick={handleEdit}
                                className={userProfileFormStyle.editBtn}
                            >
                                <AppText textName="EDIT_DETAILS" textModule="BUTTON" />
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Edit Form View */
                    <form onSubmit={handleSave} className={userProfileFormStyle.form}>
                        {formError && (
                            <div className={userProfileFormStyle.errorAlert}>
                                <ShieldAlert className="h-4 w-4 shrink-0" />
                                <span>{formError}</span>
                            </div>
                        )}
                        {formSuccess && (
                            <div className={userProfileFormStyle.successAlert}>
                                <CheckCircle className="h-4 w-4 shrink-0" />
                                <span>{formSuccess}</span>
                            </div>
                        )}

                        <div className={userProfileFormStyle.grid2}>
                            {/* Email (Read-only) */}
                            <div className={userProfileFormStyle.formField}>
                                <label className={userProfileFormStyle.label}>
                                    <AppText textName="EMAIL_ADDRESS" textModule="INPUT_LABELS" />
                                </label>
                                <div className={userProfileFormStyle.relative}>
                                    <div className={userProfileFormStyle.inputIconWrapper}>
                                        <Mail className={userProfileFormStyle.inputIcon} />
                                    </div>
                                    <input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className={userProfileFormStyle.inputDisabled}
                                    />
                                </div>
                                <p className={userProfileFormStyle.hintText}>
                                    <AppText textName="EMAIL_CANNOT_CHANGE" textModule="LABEL" />
                                </p>
                            </div>

                            {/* Name */}
                            <div className={userProfileFormStyle.formField}>
                                <label className={userProfileFormStyle.label}>
                                    <AppText textName="FULL_NAME" textModule="INPUT_LABELS" />
                                </label>
                                <div className={userProfileFormStyle.relative}>
                                    <div className={userProfileFormStyle.inputIconWrapper}>
                                        <User className={userProfileFormStyle.inputIcon} />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder={getText("FULL_NAME_PLACEHOLDER", "LABEL")}
                                        className={userProfileFormStyle.input}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={userProfileFormStyle.grid2}>
                            {/* Phone */}
                            <div className={userProfileFormStyle.formField}>
                                <label className={userProfileFormStyle.label}>
                                    <AppText textName="MOBILE_NUMBER" textModule="INPUT_LABELS" />
                                </label>
                                <div className={userProfileFormStyle.relative}>
                                    <div className={userProfileFormStyle.inputIconWrapper}>
                                        <Phone className={userProfileFormStyle.inputIcon} />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder={getText("PHONE_PLACEHOLDER", "LABEL")}
                                        className={userProfileFormStyle.input}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password Fields (Only if password not set) */}
                        {!user.isPasswordSet && (
                            <div className={userProfileFormStyle.passwordCard}>
                                <p className={userProfileFormStyle.warningBox}>
                                    <ShieldAlert className="h-3.5 w-3.5" />
                                    <AppText textName="ACCOUNT_SECURITY_WARNING" textModule="LABEL" />
                                </p>

                                <div className={userProfileFormStyle.grid2}>
                                    {/* Password */}
                                    <div className={userProfileFormStyle.formField}>
                                        <label className={userProfileFormStyle.label}>
                                            <AppText textName="NEW_PASSWORD" textModule="LABEL" />
                                        </label>
                                        <div className={userProfileFormStyle.relative}>
                                            <div className={userProfileFormStyle.inputIconWrapper}>
                                                <Lock className={userProfileFormStyle.inputIcon} />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder={getText("PASSWORD_PLACEHOLDER", "LABEL")}
                                                className={userProfileFormStyle.inputPassword}
                                                required={!user.isPasswordSet}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    return setShowPassword(!showPassword); 
                                                }}
                                                className={userProfileFormStyle.eyeBtn}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className={userProfileFormStyle.formField}>
                                        <label className={userProfileFormStyle.label}>
                                            <AppText textName="CONFIRM_PASSWORD" textModule="LABEL" />
                                        </label>
                                        <div className={userProfileFormStyle.relative}>
                                            <div className={userProfileFormStyle.inputIconWrapper}>
                                                <Lock className={userProfileFormStyle.inputIcon} />
                                            </div>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder={getText("CONFIRM_PASSWORD_PLACEHOLDER", "LABEL")}
                                                className={userProfileFormStyle.inputPassword}
                                                required={!user.isPasswordSet}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    return setShowConfirmPassword(!showConfirmPassword); 
                                                }}
                                                className={userProfileFormStyle.eyeBtn}
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={userProfileFormStyle.formFooter}>
                            {user.name && user.phone && user.isPasswordSet && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setIsConfirmed(true);
                                        onConfirmProfile(true);
                                        setFormError(null);
                                    }}
                                    className={userProfileFormStyle.cancelBtn}
                                >
                                    <AppText textName="CANCEL" textModule="BUTTON" />
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className={userProfileFormStyle.saveBtn}
                            >
                                {loading ? (
                                    <AppText textName="SAVING" textModule="BUTTON" />
                                ) : (
                                    <AppText textName="SAVE_CONTINUE" textModule="BUTTON" />
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}
