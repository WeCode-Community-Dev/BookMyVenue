"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import MapPicker from "./map-picker";

export default function MapDialogBox({ onLocationSelect, initialLocation }: { onLocationSelect: (lat: number, lng: number) => void, initialLocation: { lat: number, lng: number } | null }) {
    const [open, setOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(initialLocation);

    useEffect(()=>{
        setSelectedLocation(initialLocation)
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className="h-10 shrink-0"
                >
                    Fetch Location
                </Button>
            </DialogTrigger>

            <DialogContent className="w-full sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Select Location</DialogTitle>
                    <DialogDescription>
                        Click on the map or drag the marker to choose the exact location.
                    </DialogDescription>
                </DialogHeader>

                <div className="min-h-[400px] overflow-hidden rounded-lg border">
                    {open && (
                        <MapPicker
                            onLocationSelect={(lat: number, lng: number) => {
                                setSelectedLocation({ lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) });
                            }}
                            selectedLocation={selectedLocation}
                        />
                    )}
                </div>

                {selectedLocation && (
                    <div className="rounded-md bg-muted p-3 text-sm">
                        <div>
                            <strong>Latitude:</strong>{" "}
                            {selectedLocation.lat.toFixed(6)}
                        </div>
                        <div>
                            <strong>Longitude:</strong>{" "}
                            {selectedLocation.lng.toFixed(6)}
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        disabled={!selectedLocation}
                        onClick={() => {
                            if (!selectedLocation) return;

                            onLocationSelect(selectedLocation.lat, selectedLocation.lng);

                            setOpen(false);
                        }}
                    >
                        Confirm Location
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}