"use client";

import React, { useState } from "react";
import { X, CheckCircle, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ContactOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerName: string;
}

export default function ContactOwnerModal({ isOpen, onClose, ownerName }: ContactOwnerModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    setIsLoading(true);
    // Simulate API request delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1000);
  };

  const handleReset = () => {
    setSubject("");
    setMessage("");
    setIsSent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Outer Click Backdrop */}
      <div className="absolute inset-0 cursor-default" onClick={isSent ? handleReset : onClose} />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md bg-white border border-slate-200/80 shadow-2xl rounded-3xl p-6 sm:p-8 animate-in scale-in-95 duration-200 z-10">
        
        {/* Close Button */}
        <button
          onClick={isSent ? handleReset : onClose}
          className="absolute right-4.5 top-4.5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition border-0 bg-transparent cursor-pointer"
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>

        {isSent ? (
          /* Success Screen */
          <div className="text-center py-6 space-y-4 select-none">
            <div className="mx-auto size-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <CheckCircle className="size-8 text-emerald-600 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900">Message Sent!</h3>
              <p className="text-sm font-semibold text-slate-500 max-w-xs mx-auto leading-relaxed">
                Your message has been successfully routed to **{ownerName}**. You will receive replies in your email dashboard shortly.
              </p>
            </div>
            <div className="pt-2">
              <Button
                onClick={handleReset}
                className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold h-10 rounded-xl cursor-pointer"
              >
                Close Window
              </Button>
            </div>
          </div>
        ) : (
          /* Message Form Screen */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5 select-none">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Mail className="size-5 text-rose-600" />
                <span>Contact {ownerName}</span>
              </h3>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                Send a direct inquiry about pricing, booking dates, custom decorations, or policies.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="subject" className="text-xs font-bold text-slate-500 uppercase tracking-wider block select-none">
                  Subject
                </label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="e.g. Wedding inquiry / Corporate pricing"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="text-xs font-bold text-slate-500 uppercase tracking-wider block select-none">
                  Message Details
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder={`Hi ${ownerName}, I'm interested in booking your venue...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="flex w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-150 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 min-h-[100px] max-h-[180px]"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 rounded-xl cursor-pointer shadow-xs border-none disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Email"}
              </Button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
