"use client";

import { Building2, Pencil } from "lucide-react";

// interface BusinessInformationCardProps {
//   businessName: string;
//   gstNumber: string;
//   address: string;
//   payoutMethod: string;
//   bankAccount: string;
//   upiId: string;
// }

export default function BusinessInformationCard() {
const rows = [
  {
    label: "Business Name",
    value: "Vishnu Hospitality Pvt Ltd",
  },
  {
    label: "GST Number",
    value: "32ABCDE1234F1Z5",
  },
  {
    label: "Business Address",
    value: "Kochi, Kerala, India",
  },
  {
    label: "Payout Method",
    value: "Bank Transfer",
  },
  {
    label: "Bank Account",
    value: "**** **** **** 1234",
  },
  {
    label: "UPI ID",
    value: "vishnu@upi",
  },
];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50">
            <Building2 className="h-5 w-5 text-teal-600" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Business Information
            </h3>

            <p className="text-sm text-slate-500">
              Your business and payout details
            </p>
          </div>
        </div>

        <button className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700">
          Edit
          <Pencil className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4 ml-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[140px_1fr] gap-3 border-b border-slate-100 pb-3 last:border-b-0"
          >
            <span className="text-sm font-medium text-slate-700">
              {row.label}
            </span>

            <span className="break-words text-sm text-slate-700">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}