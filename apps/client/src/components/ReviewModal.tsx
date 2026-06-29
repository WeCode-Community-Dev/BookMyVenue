"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ReviewModal({ open, onOpenChange }: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");

    const handleSubmit = async () => {
        if (rating === 0) return;

        console.log({ rating, comment });

        setRating(0);
        setComment("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Rate your experience</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div>
                        <p className="text-sm font-medium mb-3">How was your experience?</p>

                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    onClick={() => setRating(star)}
                                    className="transition-transform hover:scale-110 cursor-pointer"
                                >
                                    <Star
                                        className={cn(
                                            "h-8 w-8",
                                            (hover || rating) >= star
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-gray-300",
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Comment (optional)</label>

                        <Textarea
                            rows={5}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell others about your experience..."
                            maxLength={500}
                            className="border border-primary"
                        />

                        <div className="mt-1 text-right text-xs text-muted-foreground">
                            {comment.length}/500
                        </div>
                    </div>

                    <Button className="w-full" disabled={rating === 0} onClick={handleSubmit}>
                        {"Submit Review"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
