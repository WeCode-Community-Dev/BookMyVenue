"use client";

import React from "react";
import { Wallet, Landmark, ArrowUpRight, DollarSign } from "lucide-react";

const recentPayouts = [
  { id: 1, date: "May 15, 2026", status: "Sent", amount: "$8,200", method: "Bank Transfer (*1034)" },
  { id: 2, date: "May 01, 2026", status: "Sent", amount: "$12,400", method: "Bank Transfer (*1034)" },
  { id: 3, date: "Apr 15, 2026", status: "Sent", amount: "$7,500", method: "Bank Transfer (*1034)" },
];

export default function PayoutsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-border-subtle pb-5">
        <div>
          <h1 className="text-4xl font-bold text-on-surface">Payouts</h1>
          <p className="mt-1.5 text-body-md text-text-muted">Manage your wallet, invoices, and bank transfer setup.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card flex flex-col justify-between h-48 lg:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-label-sm text-text-muted">Available Balance</span>
            <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">Auto-payout Active</span>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-on-surface">$14,400</h2>
            <p className="text-label-sm text-text-muted mt-1.5">Next scheduled transfer: June 01, 2026</p>
          </div>
          <button className="w-max rounded-full bg-[#582200] px-5 py-2 text-label-sm font-bold text-white shadow-sm hover:bg-[#3c2d26] transition-all">
            Transfer Now
          </button>
        </div>

        <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card flex flex-col justify-between h-48">
          <div>
            <span className="text-label-sm text-text-muted">Payout Method</span>
            <div className="flex items-center gap-3.5 mt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low text-primary-container">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-label-md font-bold text-on-surface">Chase Bank Account</h4>
                <p className="text-label-sm text-text-muted mt-0.5">Checking ****1034</p>
              </div>
            </div>
          </div>
          <button className="w-full rounded-full border border-border-subtle py-2 text-label-sm font-bold text-on-surface hover:bg-stone-50 transition-colors">
            Manage Bank Setup
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card space-y-5">
        <h3 className="text-2xl font-bold text-on-surface">Recent Transfers</h3>
        <div className="divide-y divide-border-subtle/50">
          {recentPayouts.map((payout) => (
            <div key={payout.id} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <ArrowUpRight className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-label-md font-bold text-on-surface">{payout.method}</h4>
                  <p className="text-label-sm text-text-muted mt-0.5">{payout.date}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-label-md font-bold text-on-surface">{payout.amount}</span>
                <span className="block text-[11px] font-bold text-emerald-700 mt-0.5">{payout.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
