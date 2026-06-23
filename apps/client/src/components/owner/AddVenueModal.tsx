import { useState } from "react";
import { z } from "zod";
import { X, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Step1BasicDetails } from "./steps/Step1BasicDetails";
import { Step2AmenitiesInfo } from "./steps/Step2AmenitiesInfo";
import { Step3Sessions, type Session } from "./steps/Step3Sessions";

const step1Schema = z.object({
    name: z.string().min(1, "Venue name is required"),
    district: z.string().min(1, "District is required"),
    category: z.string().min(1, "Category is required"),
    capacity: z
        .string()
        .refine((v) => v !== "" && !isNaN(Number(v)) && Number(v) > 0, "Valid capacity required"),
    location: z.string().min(1, "Full address is required"),
});

const step2Schema = z.object({
    description: z.string().min(1, "Description is required"),
    amenities: z.array(z.string()).min(1, "Select at least one amenity"),
});

const step3Schema = z.object({
    sessions: z.array(z.any()).min(1, "Add at least one session"),
});

const STEP_LABELS = ["Basic Details", "Amenities & Info", "Sessions"];

function AddVenueModal({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState<number>(1);
    const [form, setForm] = useState({
        name: "",
        district: "",
        category: "",
        capacity: "",
        description: "",
        location: "",
        images: [] as string[],
        amenities: [] as string[],
        sessions: [] as Session[],
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
    const setAmenities = (amenities: string[]) => setForm((f) => ({ ...f, amenities }));
    const setSessions = (sessions: Session[]) => setForm((f) => ({ ...f, sessions }));

    const validate1 = () => {
        const result = step1Schema.safeParse(form);
        if (!result.success) {
            const e: Record<string, string> = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as string;
                if (!e[key]) e[key] = issue.message;
            }
            setErrors(e);
            return false;
        }
        setErrors({});
        return true;
    };

    const validate2 = () => {
        const result = step2Schema.safeParse(form);
        if (!result.success) {
            setErrors({ amenities: result.error.issues[0]!.message });
            return false;
        }
        setErrors({});
        return true;
    };

    const validate3 = () => {
        const result = step3Schema.safeParse(form);
        if (!result.success) {
            setErrors({ sessions: result.error.issues[0]!.message });
            return false;
        }
        setErrors({});
        return true;
    };

    const handleNext = () => {
        if (step === 1 && validate1()) setStep(2);
        else if (step === 2 && validate2()) setStep(3);
    };

    const handleBack = () => {
        setErrors({});
        setStep((s) => s - 1);
    };

    const handleSubmit = () => {
        if (!validate3()) return;
        const payload = {
            name: form.name,
            description: form.description,
            capacity: Number(form.capacity),
            category: form.category,
            location: form.location,
            district: form.district,
            images: form.images,
            amenities: form.amenities,
            sessions: form.sessions.map(({ label, startTime, endTime, price }) => ({
                label,
                startTime,
                endTime,
                price: Number(price),
            })),
        };
        console.log({ payload });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-card w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-primary px-6 py-5 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-primary-foreground">Add New Venue</h2>
                        <p className="text-primary-foreground/60 text-xs mt-0.5">
                            Step {step} of 3 — {STEP_LABELS[step - 1]}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Step indicator */}
                <div className="flex bg-primary/5 border-b border-border shrink-0">
                    {STEP_LABELS.map((label, i) => (
                        <div
                            key={label}
                            className={`flex-1 py-3 text-center text-xs font-semibold transition-colors ${
                                step === i + 1
                                    ? "text-primary border-b-2 border-primary bg-background"
                                    : "text-muted-foreground"
                            }`}
                        >
                            {label}
                        </div>
                    ))}
                </div>

                <div className="overflow-y-auto flex-1 px-6 py-6">
                    {step === 1 && <Step1BasicDetails form={form} errors={errors} set={set} />}
                    {step === 2 && (
                        <Step2AmenitiesInfo
                            form={form}
                            set={set}
                            setAmenities={setAmenities}
                            error={errors.amenities}
                        />
                    )}
                    {step === 3 && (
                        <Step3Sessions form={form} setSessions={setSessions} stepError={errors.sessions} />
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-between shrink-0">
                    {step === 1 ? (
                        <button
                            onClick={onClose}
                            className="text-muted-foreground text-sm font-medium hover:text-foreground transition-colors px-4 py-2"
                        >
                            Cancel
                        </button>
                    ) : (
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium hover:text-foreground transition-colors px-4 py-2"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                    )}

                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="bg-accent text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors flex items-center gap-1.5"
                        >
                            <CheckCircle2 className="w-4 h-4" /> Publish Venue
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AddVenueModal;
