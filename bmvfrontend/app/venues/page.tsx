import React, { Suspense } from "react";
import VenueListing from "@/src/customer/pages/VenueListing";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center font-sans text-sm text-neutral-muted">
        Loading...
      </div>
    }>
      <VenueListing />
    </Suspense>
  );
}
