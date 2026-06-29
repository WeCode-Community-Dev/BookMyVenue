import React, { Suspense } from "react";
import Register from "@/src/customer/auth/register/page";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center font-sans text-sm text-neutral-muted">
        Loading...
      </div>
    }>
      <Register />
    </Suspense>
  );
}
