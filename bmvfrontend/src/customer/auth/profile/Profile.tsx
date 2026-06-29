"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  MapPin, 
  Loader2, 
  Building, 
  Home, 
  Globe, 
  ShieldAlert, 
  CheckCircle, 
  ArrowRight,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getSession, setSession, UserSession } from "@/src/lib/authStore";
import { apiFetch } from "@/src/lib/api";
import { LogoTicket } from "@/components/Logo";

// Define validation schema using Zod
const onboardingSchema = z.object({
  addressLine1: z
    .string()
    .min(1, "Address Line 1 is required")
    .max(255, "Address must be less than 255 characters"),
  addressLine2: z
    .string()
    .max(255, "Address must be less than 255 characters")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City name must be less than 100 characters"),
  state: z
    .string()
    .min(1, "State is required")
    .max(100, "State name must be less than 100 characters"),
  pincode: z
    .string()
    .min(1, "Pincode is required")
    .regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  googleLocationUrl: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val) return true;
        try {
          const url = new URL(val);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      },
      {
        message: "Please enter a valid URL starting with http:// or https:// (e.g. https://maps.app.goo.gl/...)"
      }
    )
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function Profile() {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSessionState] = useState<UserSession | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  const [loadingProfileData, setLoadingProfileData] = useState(false);

  // Load session on mount
  useEffect(() => {
    const currentSession = getSession();
    setSessionState(currentSession);
    setLoadingSession(false);

    // If user is logged in and profile is already completed, but they are NOT in the dashboard profile path, redirect them
    if (currentSession && currentSession.isProfileCompleted && pathname !== "/customer/profile") {
      router.push("/customer");
    }
  }, [router, pathname]);

  // Set up React Hook Form
  const {
    register: registerField,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      googleLocationUrl: ""
    }
  });

  // Fetch profile data if already completed
  useEffect(() => {
    if (session && session.isProfileCompleted) {
      const fetchProfile = async () => {
        setLoadingProfileData(true);
        try {
          const data = await apiFetch<{
            user: any;
            profile: {
              addressLine1: string;
              addressLine2?: string;
              city: string;
              state: string;
              pincode: string;
              googleLocationUrl?: string;
            } | null;
          }>("/users/customer/profile");

          if (data.profile) {
            reset({
              addressLine1: data.profile.addressLine1 || "",
              addressLine2: data.profile.addressLine2 || "",
              city: data.profile.city || "",
              state: data.profile.state || "",
              pincode: data.profile.pincode || "",
              googleLocationUrl: data.profile.googleLocationUrl || "",
            });
          }
        } catch (err: any) {
          setApiError(err.message || "Failed to load existing profile details.");
        } finally {
          setLoadingProfileData(false);
        }
      };
      fetchProfile();
    }
  }, [session, reset]);

  const onSubmit = async (values: OnboardingFormValues) => {
    setIsSubmitting(true);
    setApiError("");

    // Omit optional fields if they are empty
    const payload = {
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2 || undefined,
      city: values.city,
      state: values.state,
      pincode: values.pincode,
      googleLocationUrl: values.googleLocationUrl || undefined
    };

    try {
      await apiFetch<{
        message: string;
        isProfileCompleted: boolean;
        profile: any;
      }>("/users/customer/onboard", {
        method: "POST",
        body: payload
      });

      // Update session in local storage
      const currentSession = getSession();
      if (currentSession) {
        setSession({
          ...currentSession,
          isProfileCompleted: true
        });
      }

      setSuccess(true);
      if (pathname !== "/customer/profile") {
        setTimeout(() => {
          router.push("/customer");
        }, 1500);
      } else {
        setTimeout(() => {
          setSuccess(false);
        }, 2500);
      }
    } catch (err: any) {
      setApiError(err.message || "Failed to complete onboarding. Please check your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading spinner while determining session state
  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center font-sans text-sm text-neutral-muted">
        <Loader2 className="h-6 w-6 animate-spin text-teal-primary" />
        <span className="ml-2">Loading session...</span>
      </div>
    );
  }

  // Redirect to login if user session is not found
  if (!session) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="border border-neutral-light shadow-xl bg-white rounded-2xl overflow-hidden animate-slide-up">
            <CardContent className="p-8 text-center space-y-6">
              <div className="mx-auto h-12 w-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-serif text-neutral-dark">Authentication Required</h3>
                <p className="text-sm text-neutral-muted">
                  Please log in to complete your profile onboarding and access the dashboard.
                </p>
              </div>
              <Link href="/login?returnUrl=/customer/profile" className="inline-block w-full">
                <Button className="w-full bg-teal-primary hover:bg-teal-hover text-white py-2.5 h-auto text-sm font-bold shadow-md rounded-xl">
                  Go to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isDashboardView = pathname === "/customer/profile";
  const isUpdate = session?.isProfileCompleted;

  const formContent = (
    <Card className={isDashboardView ? "border border-[#E2E2DE] shadow-xs bg-white rounded-2xl" : "border border-neutral-light shadow-2xl bg-white rounded-2xl overflow-hidden"}>
      <CardContent className={isDashboardView ? "p-6 space-y-6" : "p-6 sm:p-10 space-y-6"}>
        
        {/* Show success message */}
        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-teal-light flex items-center justify-center text-teal-primary animate-pulse">
              <CheckCircle className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold text-neutral-dark">{isUpdate ? "Profile Updated!" : "Setup Complete!"}</h3>
              <p className="text-sm text-neutral-muted">
                {isUpdate ? "Your profile details have been saved." : "Your location details have been saved. Redirecting to the dashboard..."}
              </p>
            </div>
            {!isUpdate && (
              <div className="flex justify-center pt-2">
                <Loader2 className="h-5 w-5 animate-spin text-teal-primary" />
              </div>
            )}
          </div>
        ) : (
              <>
                {/* Show validation or API error */}
                {apiError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3.5 text-xs flex gap-2 items-start animate-fade-in">
                    <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <span>{apiError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  
                  {/* Address Line 1 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-muted uppercase flex items-center gap-1">
                      <Home className="h-3.5 w-3.5 text-neutral-muted" /> Address Line 1 <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Flat/House No., Building, Apartment, Street"
                      {...registerField("addressLine1")}
                      className={`h-11 border-input rounded-xl bg-white px-4 transition-all focus-visible:ring-teal-primary ${
                        errors.addressLine1 ? "border-red-500 focus-visible:ring-red-500" : ""
                      }`}
                    />
                    {errors.addressLine1 && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{errors.addressLine1.message}</p>
                    )}
                  </div>

                  {/* Address Line 2 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-muted uppercase flex items-center gap-1">
                      <Home className="h-3.5 w-3.5 text-neutral-muted" /> Address Line 2 (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="Area, Sector, Landmark, Road"
                      {...registerField("addressLine2")}
                      className="h-11 border-input rounded-xl bg-white px-4 transition-all focus-visible:ring-teal-primary"
                    />
                    {errors.addressLine2 && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{errors.addressLine2.message}</p>
                    )}
                  </div>

                  {/* City + State Layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* City */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-muted uppercase flex items-center gap-1">
                        <Building className="h-3.5 w-3.5 text-neutral-muted" /> City <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g. Mumbai"
                        {...registerField("city")}
                        className={`h-11 border-input rounded-xl bg-white px-4 transition-all focus-visible:ring-teal-primary ${
                          errors.city ? "border-red-500 focus-visible:ring-red-500" : ""
                        }`}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{errors.city.message}</p>
                      )}
                    </div>

                    {/* State */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-muted uppercase flex items-center gap-1">
                        <Building className="h-3.5 w-3.5 text-neutral-muted" /> State <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g. Maharashtra"
                        {...registerField("state")}
                        className={`h-11 border-input rounded-xl bg-white px-4 transition-all focus-visible:ring-teal-primary ${
                          errors.state ? "border-red-500 focus-visible:ring-red-500" : ""
                        }`}
                      />
                      {errors.state && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{errors.state.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Pincode + Google Location URL Layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Pincode */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-muted uppercase flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-neutral-muted" /> Pincode <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="text"
                        placeholder="6-digit PIN code"
                        maxLength={6}
                        {...registerField("pincode")}
                        className={`h-11 border-input rounded-xl bg-white px-4 transition-all focus-visible:ring-teal-primary ${
                          errors.pincode ? "border-red-500 focus-visible:ring-red-500" : ""
                        }`}
                      />
                      {errors.pincode && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{errors.pincode.message}</p>
                      )}
                    </div>

                    {/* Google Location URL */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-muted uppercase flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5 text-neutral-muted" /> Google Maps Link (Optional)
                      </label>
                      <Input
                        type="text"
                        placeholder="https://maps.app.goo.gl/..."
                        {...registerField("googleLocationUrl")}
                        className={`h-11 border-input rounded-xl bg-white px-4 transition-all focus-visible:ring-teal-primary ${
                          errors.googleLocationUrl ? "border-red-500 focus-visible:ring-red-500" : ""
                        }`}
                      />
                      {errors.googleLocationUrl && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{errors.googleLocationUrl.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Google Maps Link Helper Instructions */}
                  <div className="flex gap-2 p-3 bg-[#e6f1f1] text-[#0d7377] rounded-xl text-xs leading-relaxed font-medium">
                    <Info className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">How to copy Google Maps Link:</span>
                      <p className="text-[11px] text-[#0a5b5e] mt-0.5">
                        Open Google Maps &rarr; Search for your address &rarr; Click Share &rarr; Copy Link &rarr; Paste in the field above.
                      </p>
                    </div>
                  </div>

                  {/* CTA Submit Button */}
                  <Button
                    type="submit"
                     disabled={isSubmitting}
                    className="w-full bg-[#0D7377] hover:bg-[#0a5b5e] text-white py-3 h-auto text-sm font-bold shadow-md shadow-[#0D7377]/25 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {isUpdate ? "Updating Profile..." : "Saving Location details..."}
                      </>
                    ) : (
                      <>
                        {isUpdate ? "Update Profile" : "Complete Setup"}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}
            
          </CardContent>
        </Card>
      );

      if (isDashboardView) {
        return (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-bold text-[#1A1A19]">Profile Information</h2>
              <p className="text-xs text-[#70706e]">Update your address and Google Maps location details below.</p>
            </div>
            {loadingProfileData ? (
              <div className="py-12 flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#0D7377] mr-2" />
                <span className="text-xs text-[#70706e] font-semibold">Loading profile details...</span>
              </div>
            ) : (
              formContent
            )}
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
          
          {/* Decorative background shapes */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-teal-light rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-light rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2" />

          <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
            <div className="text-center mb-8">
              <div className="flex justify-center items-center mb-3">
                <Link href="/" className="inline-block">
                  <LogoTicket />
                </Link>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-9 w-9 rounded-full bg-[#E6F1F1] flex items-center justify-center text-[#0D7377] animate-bounce">
                  <MapPin className="h-5 w-5" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-dark">Complete Your Profile</h2>
              </div>
              <p className="text-sm text-neutral-muted max-w-sm mx-auto">
                Please provide your location details to continue to the dashboard.
              </p>
            </div>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10 animate-slide-up">
            {formContent}
          </div>
        </div>
      );
    }