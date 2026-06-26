"use client";

import * as React from "react";
import { Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { reviewPublishCopy } from "@/lib/data/list-venue";

export function ReviewPublishPanel() {
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [amenitiesConfirmed, setAmenitiesConfirmed] = React.useState(false);

  const canPublish = termsAccepted && amenitiesConfirmed;

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-surface-tint p-5 text-on-primary">
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold">{reviewPublishCopy.title}</h2>
        <p className="text-sm text-on-primary/90">{reviewPublishCopy.body}</p>
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex cursor-pointer items-start gap-3">
          <Checkbox
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked === true)}
            className="mt-0.5 border-on-primary/60 bg-transparent data-checked:border-on-primary data-checked:bg-on-primary data-checked:text-surface-tint"
          />
          <span className="text-sm leading-snug">
            I agree to the{" "}
            <a href="#" className="underline underline-offset-2">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-2">
              Privacy Policy
            </a>
            .
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3">
          <Checkbox
            checked={amenitiesConfirmed}
            onCheckedChange={(checked) =>
              setAmenitiesConfirmed(checked === true)
            }
            className="mt-0.5 border-on-primary/60 bg-transparent data-checked:border-on-primary data-checked:bg-on-primary data-checked:text-surface-tint"
          />
          <span className="text-sm leading-snug">
            {reviewPublishCopy.amenitiesLabel}
          </span>
        </label>
      </div>

      <Button
        type="button"
        disabled={!canPublish}
        onClick={() => {}}
        className="h-11 w-full bg-on-primary text-surface-tint hover:bg-on-primary/90 disabled:bg-on-primary/50 disabled:text-surface-tint/70"
      >
        <Rocket className="size-4" />
        Publish Listing
      </Button>
    </div>
  );
}
