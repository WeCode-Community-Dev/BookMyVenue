import React from "react";
import { CheckCircle2, AlertTriangle, Clock, Ban, HelpCircle } from "lucide-react";
import VenueSection from "./VenueSection";

interface VenueRulesProps {
  rules: string[];
}

export default function VenueRules({ rules }: VenueRulesProps) {
  const getRuleIcon = (rule: string) => {
    const lowercase = rule.toLowerCase();
    
    // Ban rules
    if (lowercase.includes("not permitted") || lowercase.includes("no alcohol") || lowercase.includes("no smoking") || lowercase.includes("forbidden")) {
      return <Ban className="size-4.5 text-red-500 shrink-0 mt-0.5" />;
    }
    // Time/Clock rules
    if (lowercase.includes("music") || lowercase.includes("until") || lowercase.includes("pm") || lowercase.includes("am") || lowercase.includes("time")) {
      return <Clock className="size-4.5 text-amber-500 shrink-0 mt-0.5" />;
    }
    // Decoration/prior approvals
    if (lowercase.includes("prior") || lowercase.includes("permissions") || lowercase.includes("booking") || lowercase.includes("deposit")) {
      return <AlertTriangle className="size-4.5 text-blue-500 shrink-0 mt-0.5" />;
    }
    // Allowed rules
    if (lowercase.includes("allowed") || lowercase.includes("permitted") || lowercase.includes("yes")) {
      return <CheckCircle2 className="size-4.5 text-emerald-500 shrink-0 mt-0.5" />;
    }

    return <HelpCircle className="size-4.5 text-slate-400 shrink-0 mt-0.5" />;
  };

  return (
    <VenueSection title="Venue Rules & Policies" id="rules">
      <div className="bg-slate-50/50 border border-slate-200/50 rounded-2xl p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rules.map((rule, idx) => (
          <div key={idx} className="flex items-start gap-3 py-1 select-none">
            {getRuleIcon(rule)}
            <span className="text-sm font-semibold text-slate-700 leading-tight">
              {rule}
            </span>
          </div>
        ))}
      </div>
    </VenueSection>
  );
}
