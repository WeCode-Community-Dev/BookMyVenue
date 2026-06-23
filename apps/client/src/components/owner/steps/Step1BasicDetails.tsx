import { DISTRICTS, VENUE_CATEGORIES } from "@bookmyvenue/types";
import { ChevronDown } from "lucide-react";
import { ImageUpload } from "../ImageUpload";

function formatEnum(value: string) {
    return value
        .split("_")
        .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
        .join(" ");
}

interface Step1Props {
    form: {
        name: string;
        district: string;
        category: string;
        capacity: string;
        location: string;
        images: string[];
    };
    errors: Record<string, string>;
    set: (k: string, v: string) => void;
    setImages: (images: string[]) => void;
}

export function Step1BasicDetails({ form, errors, set, setImages }: Step1Props) {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Venue Name
                </label>
                <input
                    className={`w-full px-4 py-2.5 bg-input-background border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.name ? "border-red-400" : "border-border"}`}
                    placeholder="e.g. The Royal Pavilion"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                        District
                    </label>
                    <div className="relative">
                        <select
                            className={`w-full px-4 py-2.5 bg-input-background border rounded-xl text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-ring ${errors.district ? "border-red-400" : "border-border"}`}
                            value={form.district}
                            onChange={(e) => set("district", e.target.value)}
                        >
                            <option value="">Select district</option>
                            {DISTRICTS.map((d) => (
                                <option key={d} value={d}>{formatEnum(d)}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                    {errors.district && (
                        <p className="text-red-500 text-xs mt-1">{errors.district}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                        Category
                    </label>
                    <div className="relative">
                        <select
                            className={`w-full px-4 py-2.5 bg-input-background border rounded-xl text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-ring ${errors.category ? "border-red-400" : "border-border"}`}
                            value={form.category}
                            onChange={(e) => set("category", e.target.value)}
                        >
                            <option value="">Select category</option>
                            {VENUE_CATEGORIES.map((c) => (
                                <option key={c} value={c}>{formatEnum(c)}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                    {errors.category && (
                        <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                        Capacity (guests)
                    </label>
                    <input
                        type="number"
                        className={`w-full px-4 py-2.5 bg-input-background border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.capacity ? "border-red-400" : "border-border"}`}
                        placeholder="e.g. 500"
                        value={form.capacity}
                        onChange={(e) => set("capacity", e.target.value)}
                    />
                    {errors.capacity && (
                        <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Full Address
                </label>
                <input
                    className={`w-full px-4 py-2.5 bg-input-background border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.location ? "border-red-400" : "border-border"}`}
                    placeholder="Street, city, PIN code"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>

            <ImageUpload images={form.images} setImages={setImages} />
        </div>
    );
}
