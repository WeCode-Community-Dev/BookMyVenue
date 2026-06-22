import { BarChart3, MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { fmt, type Venue } from "@/app/owner/types";

interface VenuesTabProps {
    venues: Venue[];
    onShowModal: () => void;
}

export default function VenuesTab({ venues, onShowModal }: VenuesTabProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-muted-foreground">{venues.length} venues listed</p>
                <button
                    onClick={onShowModal}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-semibold text-sm hover:bg-accent transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Venue
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {venues.map((v) => (
                    <div
                        key={v.id}
                        className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group"
                    >
                        <div className="relative h-44 bg-muted overflow-hidden">
                            <Image
                                src={v.image}
                                alt={v.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-400"
                            />
                            <span
                                className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${
                                    v.status === "Active" ? "bg-emerald-500 text-white" : "bg-gray-400 text-white"
                                }`}
                            >
                                {v.status}
                            </span>
                            {v.rating > 0 && (
                                <span className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {v.rating}
                                </span>
                            )}
                        </div>

                        <div className="p-5">
                            <h3
                                className="font-bold text-foreground text-base mb-1"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {v.name}
                            </h3>
                            <div className="flex items-center gap-1 text-muted-foreground text-xs mb-4">
                                <MapPin className="w-3 h-3" /> {v.location} · {v.category}
                            </div>

                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {[
                                    { label: "Capacity", val: `${v.capacity}` },
                                    { label: "Price", val: fmt(v.price) },
                                    { label: "Bookings", val: String(v.bookings) },
                                ].map(({ label, val }) => (
                                    <div key={label} className="bg-muted rounded-lg p-2 text-center">
                                        <p className="text-xs font-bold text-foreground">{val}</p>
                                        <p className="text-xs text-muted-foreground">{label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2 pt-3 border-t border-border">
                                <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-foreground bg-muted hover:bg-secondary rounded-lg py-2 transition-colors">
                                    <Pencil className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg py-2 transition-colors">
                                    <BarChart3 className="w-3.5 h-3.5" /> Analytics
                                </button>
                                <button className="flex items-center justify-center p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add venue card */}
                <button
                    onClick={onShowModal}
                    className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all group min-h-70"
                >
                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Plus className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-foreground text-sm">Add New Venue</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            List another venue and start getting bookings
                        </p>
                    </div>
                </button>
            </div>
        </div>
    );
}
