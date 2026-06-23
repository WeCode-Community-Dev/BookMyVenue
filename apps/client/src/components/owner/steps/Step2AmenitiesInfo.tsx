import { useState } from "react";
import { CheckCircle2, Plus } from "lucide-react";

const AMENITIES_LIST = [
    "AC",
    "Parking",
    "Catering",
    "Stage",
    "Sound System",
    "Projector",
    "Bridal Room",
    "Generator",
    "Wi-Fi",
    "Valet Parking",
];

interface Step2Props {
    form: {
        description: string;
        amenities: string[];
    };
    set: (k: string, v: string) => void;
    setAmenities: (amenities: string[]) => void;
    error?: string;
}

export function Step2AmenitiesInfo({ form, set, setAmenities, error }: Step2Props) {
    const toggleAmenity = (a: string) =>
        setAmenities(
            form.amenities.includes(a) ? form.amenities.filter((x) => x !== a) : [...form.amenities, a],
        );
    const [customInput, setCustomInput] = useState("");
    const [customError, setCustomError] = useState("");

    const customAmenities = form.amenities.filter((a) => !AMENITIES_LIST.includes(a));
    const allAmenities = [...AMENITIES_LIST, ...customAmenities];

    const addCustomAmenity = () => {
        const trimmed = customInput.trim();
        if (!trimmed) {
            setCustomError("Enter an amenity name");
            return;
        }
        if (trimmed.length > 15) {
            setCustomError("Max 15 characters");
            return;
        }
        if (allAmenities.some((a) => a.toLowerCase() === trimmed.toLowerCase())) {
            setCustomError("Already exists");
            return;
        }
        setCustomError("");
        toggleAmenity(trimmed);
        setCustomInput("");
    };

    return (
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Venue Description
                </label>
                <textarea
                    rows={4}
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="Describe your venue — ambiance, unique features, nearby landmarks..."
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Amenities</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                    {allAmenities.map((a) => {
                        const checked = form.amenities.includes(a);
                        return (
                            <button
                                key={a}
                                type="button"
                                onClick={() => toggleAmenity(a)}
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium text-left transition-all ${
                                    checked
                                        ? "border-primary bg-primary/8 text-primary"
                                        : "border-border bg-input-background text-foreground hover:border-primary/40"
                                }`}
                            >
                                <div
                                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${checked ? "bg-primary border-primary" : "border-muted-foreground/40"}`}
                                >
                                    {checked && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                                </div>
                                {a}
                            </button>
                        );
                    })}
                </div>

                <div className="flex gap-2 mt-3">
                    <div className="flex-1 relative">
                        <input
                            className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-12"
                            placeholder="Custom amenity (max 15 chars)"
                            value={customInput}
                            maxLength={15}
                            onChange={(e) => {
                                setCustomInput(e.target.value);
                                setCustomError("");
                            }}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomAmenity())}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            {customInput.length}/15
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={addCustomAmenity}
                        className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                {customError && <p className="text-red-500 text-xs mt-1">{customError}</p>}
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
        </div>
    );
}
