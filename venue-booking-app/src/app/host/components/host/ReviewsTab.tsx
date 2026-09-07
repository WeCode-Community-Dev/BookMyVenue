"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowUpRight } from "lucide-react";

export default function ReviewsTab() {
  // Reviews replying state
  const [reviewReplyIndex, setReviewReplyIndex] = useState<number | null>(null);
  const [reviewReplyText, setReviewReplyText] = useState("");
  const [reviewsReplies, setReviewsReplies] = useState<Record<number, string>>({
    0: "Thanks Sarah! We look forward to hosting your Acme team again next quarter!"
  });

  const handleReviewReply = (index: number) => {
    if (!reviewReplyText) return;
    setReviewsReplies({ ...reviewsReplies, [index]: reviewReplyText });
    setReviewReplyIndex(null);
    setReviewReplyText("");
    toast.success("Response posted successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-foreground">Reviews Feedback</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          See what guests are saying about your spaces and publish replies.
        </p>
      </div>

      {/* Review Feed list */}
      <div className="space-y-6">
        {[
          { id: 0, author: "Sarah Jenkins", space: "Summit Boardroom", date: "June 10, 2026", rating: 5, comment: "This space was absolutely perfect for our quarterly executive board meeting. The Wi-Fi was fast, the tech setup was seamless, and the host went out of their way to provide premium coffee. Highly recommended!" },
          { id: 1, author: "Marcus Brody", space: "Lumina Production Studio", date: "May 24, 2026", rating: 5, comment: "Amazing natural lighting and beautiful setup. We used this studio for our startup launch shoot and the shots turned out incredible. Host was responsive and helpful during setup." }
        ].map((rev) => (
          <div key={rev.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-foreground">{rev.author}</h4>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                  Reviewed: <strong className="text-foreground">{rev.space}</strong> &bull; {rev.date}
                </span>
              </div>
              <div className="text-amber-400 text-xs font-bold">
                {"★".repeat(rev.rating)}
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              "{rev.comment}"
            </p>

            {/* Owner reply details */}
            {reviewsReplies[rev.id] ? (
              <div className="bg-secondary/60 p-4 rounded-xl text-xs space-y-1">
                <span className="font-extrabold text-foreground text-[10px] uppercase tracking-wide text-primary block">
                  Your response:
                </span>
                <p className="text-muted-foreground leading-normal italic">
                  "{reviewsReplies[rev.id]}"
                </p>
              </div>
            ) : (
              <div className="pt-2">
                {reviewReplyIndex === rev.id ? (
                  <div className="space-y-2.5">
                    <textarea
                      value={reviewReplyText}
                      onChange={(e) => setReviewReplyText(e.target.value)}
                      placeholder="Write your professional response message..."
                      rows={2}
                      className="w-full text-xs rounded-xl border border-border bg-background p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <div className="flex space-x-2 justify-end">
                      <Button onClick={() => setReviewReplyIndex(null)} variant="outline" size="sm" className="rounded-xl text-xxs px-3">
                        Cancel
                      </Button>
                      <Button onClick={() => handleReviewReply(rev.id)} size="sm" className="rounded-xl text-xxs bg-primary text-primary-foreground font-semibold px-4">
                        Post Response
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setReviewReplyIndex(rev.id)}
                    className="text-xs font-semibold text-primary hover:underline flex items-center"
                  >
                    Reply to this review
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
