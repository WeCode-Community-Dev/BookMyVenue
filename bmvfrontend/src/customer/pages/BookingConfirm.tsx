"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getSession } from "@/src/lib/authStore";
import { apiFetch } from "@/src/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  Building,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Loader2,
  ShieldAlert
} from "lucide-react";

export default function BookingConfirm() {
  const router = useRouter();
  
  // Pending Booking details
  const [pending, setPending] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  // Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  
  // Confirmation state
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // Checkout Modal State
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderMetadata, setOrderMetadata] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes in seconds
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'qr'>('upi');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // Countdown Timer Effect
  useEffect(() => {
    if (!showCheckout || !orderMetadata?.lockedUntil) return;

    const timer = setInterval(() => {
      const lockTime = new Date(orderMetadata.lockedUntil).getTime();
      const now = new Date().getTime();
      const remainingSeconds = Math.max(0, Math.floor((lockTime - now) / 1000));
      
      setTimeLeft(remainingSeconds);

      if (remainingSeconds <= 0) {
        clearInterval(timer);
        setCheckoutError("Reservation lock has expired. Please try booking again.");
        setTimeout(() => {
          handleCancelCheckout();
        }, 4000);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [showCheckout, orderMetadata]);

  useEffect(() => {
    const activeSession = getSession();
    setSession(activeSession);
    
    const saved = localStorage.getItem("bmv_pending_booking");
    if (saved) {
      const parsed = JSON.parse(saved);
      setPending(parsed);
      
      // Auto fill if session is active
      if (activeSession) {
        setContactName(activeSession.name);
        setContactEmail(activeSession.email);
        setContactPhone(activeSession.phone || "");
      }
    } else {
      // If no pending booking, redirect to venues
      router.push("/venues");
    }
  }, [router]);

  const handleCancelCheckout = async () => {
    if (orderMetadata?.orderId) {
      try {
        await apiFetch<any>("/booking/cancel-payment", {
          method: "POST",
          body: { orderId: orderMetadata.orderId },
        });
      } catch (err) {
        console.error("Failed to release lock on server:", err);
      }
    }
    setShowCheckout(false);
    setOrderMetadata(null);
    setCheckoutError("");
  };

  const handleMockPayment = async () => {
    if (!orderMetadata?.orderId) return;

    setIsProcessingPayment(true);
    setCheckoutError("");

    try {
      // 1. Simulate payment completion on the server
      const payResponse = await apiFetch<any>("/booking/mock-pay", {
        method: "POST",
        body: {
          orderId: orderMetadata.orderId,
          status: "SUCCESS"
        }
      });

      if (!payResponse.signature) {
        throw new Error(payResponse.message || "Payment simulation failed");
      }

      // 2. Call verification endpoint with credentials
      const verifyResponse = await apiFetch<any>("/booking/verify-payment", {
        method: "POST",
        body: {
          orderId: payResponse.orderId,
          paymentId: payResponse.paymentId,
          signature: payResponse.signature
        }
      });

      if (!verifyResponse.success) {
        throw new Error(verifyResponse.message || "Payment verification failed");
      }

      // 3. Complete booking confirmation successfully
      localStorage.removeItem("bmv_pending_booking");
      setBookingId(orderMetadata.bookingReference || orderMetadata.bookingId);
      setIsSuccess(true);
      setShowCheckout(false);
    } catch (err: any) {
      setCheckoutError(err.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pending) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      const response = await apiFetch<any>("/booking", {
        method: "POST",
        body: {
          venueId: pending.venueId,
          bookingDate: pending.date,
          specialRequest: `Coordinator: ${contactName}, Phone: ${contactPhone}, Email: ${contactEmail}`,
        },
      });

      // Show Razorpay mock checkout modal with order details
      setOrderMetadata({
        bookingId: response.bookingId,
        bookingReference: response.bookingReference,
        orderId: response.orderId,
        amount: response.amount,
        lockedUntil: response.lockedUntil
      });
      
      const lockTime = new Date(response.lockedUntil).getTime();
      const now = new Date().getTime();
      setTimeLeft(Math.max(0, Math.floor((lockTime - now) / 1000)));
      setCheckoutError("");
      setShowCheckout(true);
    } catch (err: any) {
      setApiError(err.message || "Failed to initiate booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!pending) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center py-20">
          <p className="text-neutral-muted">Loading booking details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF8]">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {isSuccess ? (
          // GORGEOUS SUCCESS STATE
          <div className="bg-white border border-neutral-light rounded-2xl p-8 md:p-12 shadow-xl text-center flex flex-col items-center animate-scale-in max-w-2xl mx-auto">
            <div className="h-20 w-20 rounded-full bg-teal-light text-teal-primary flex items-center justify-center mb-6 shadow-inner animate-bounce">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            
            <h2 className="font-serif font-bold text-3xl text-neutral-dark mb-2">Booking Confirmed!</h2>
            <p className="text-sm text-neutral-muted mb-6">
              Your venue reservation request has been processed and locked in.
            </p>

            <div className="bg-[#FAFAF8] border border-neutral-light rounded-xl p-5 w-full text-left space-y-3 mb-8">
              <div className="flex justify-between items-center text-xs border-b border-neutral-light pb-2">
                <span className="text-neutral-muted font-semibold">Booking ID</span>
                <span className="font-mono font-bold text-teal-primary">{bookingId}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-muted font-semibold">Venue</span>
                <span className="font-bold text-neutral-dark">{pending.venueName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-muted font-semibold">Date & Slot</span>
                <span className="font-bold text-neutral-dark">{pending.date} ({pending.slot})</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-muted font-semibold">Expected Guests</span>
                <span className="font-bold text-neutral-dark">{pending.guests} Guests</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-neutral-light">
                <span className="text-neutral-muted font-semibold">Amount Paid</span>
                <span className="font-bold text-teal-primary text-sm">₹{pending.totalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <Link href="/">
                <Button className="w-full sm:w-auto bg-teal-primary text-white hover:bg-teal-hover px-8 py-3 rounded-xl h-auto text-sm font-bold">
                  Go to Home
                </Button>
              </Link>
              <Link href="/venues">
                <Button variant="outline" className="w-full sm:w-auto border-input text-neutral-dark hover:bg-neutral-light px-8 py-3 rounded-xl h-auto text-sm font-bold">
                  Browse More Venues
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          // CONFIRMATION FORM & SUMMARY
          <div className="space-y-6">
            <h2 className="font-serif text-3xl font-bold text-neutral-dark mb-2">Review & Confirm Booking</h2>
            <p className="text-sm text-neutral-muted mb-8">
              Please double check your details and fill in the coordinator contact form.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
              {/* Form panel */}
              <form onSubmit={handleConfirmBooking} className="md:col-span-3 bg-white border border-neutral-light rounded-2xl p-6 shadow-sm space-y-5">
                
                {apiError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3.5 text-xs flex gap-2 items-start animate-fade-in">
                    <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <span>{apiError}</span>
                  </div>
                )}

                <h3 className="text-lg font-serif font-bold text-neutral-dark pb-2 border-b border-neutral-light">Event Coordinator Details</h3>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-muted uppercase">Full Name</label>
                  <Input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Enter coordinator name"
                    className="h-10 border-input rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-muted uppercase">Email Address</label>
                    <Input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="h-10 border-input rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-muted uppercase">Mobile Number</label>
                    <Input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="h-10 border-input rounded-xl"
                    />
                  </div>
                </div>

                <div className="bg-[#fcfaf5] border border-amber-cta/20 p-4 rounded-xl flex gap-3 text-xs text-[#b87842] leading-relaxed">
                  <ShieldCheck className="h-5 w-5 text-amber-cta shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Secure Transaction Guarantee</span>
                    Your booking is covered by BookMyVenue's Venue Guarantee. If the partner fails to deliver the space in agreed conditions, you receive a 100% refund.
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-cta text-white hover:bg-amber-hover py-4 h-auto text-base font-bold shadow-md shadow-amber-cta/20 rounded-xl flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Securing Booking...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Confirm & Secure Booking
                    </>
                  )}
                </Button>
              </form>

              {/* Summary panel */}
              <div className="md:col-span-2 space-y-6">
                <Card className="border border-neutral-light shadow-sm bg-white rounded-2xl overflow-hidden">
                  <div className="relative h-36 w-full bg-neutral-light">
                    <Image
                      src={pending.venueImage}
                      alt={pending.venueName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-5 space-y-4">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-neutral-dark line-clamp-1">{pending.venueName}</h4>
                      <p className="text-xs text-neutral-muted flex items-center gap-1 mt-1">
                        <Building className="h-3.5 w-3.5 text-teal-primary" /> Venue Reservation
                      </p>
                    </div>

                    <hr className="border-neutral-light" />

                    <div className="space-y-2.5 text-xs text-neutral-dark font-medium">
                      <div className="flex items-center gap-2 text-neutral-muted">
                        <Calendar className="h-4 w-4 text-teal-primary shrink-0" />
                        <span>Date: <strong>{pending.date}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-muted">
                        <Clock className="h-4 w-4 text-teal-primary shrink-0" />
                        <span>Slot: <strong>{pending.slot}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-muted">
                        <Users className="h-4 w-4 text-teal-primary shrink-0" />
                        <span>Guests: <strong>{pending.guests} Guests</strong></span>
                      </div>
                    </div>

                    <hr className="border-neutral-light" />

                    <div className="space-y-2 text-xs text-neutral-muted">
                      <div className="flex justify-between">
                        <span>Base rate</span>
                        <span className="font-semibold text-neutral-dark">₹{pending.totalPrice ? Math.round(pending.totalPrice / 1.205).toLocaleString("en-IN") : "0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Taxes</span>
                        <span className="font-semibold text-neutral-dark">Included</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-neutral-dark pt-2 border-t border-neutral-light">
                        <span>Total Price</span>
                        <span className="text-teal-primary text-base">₹{pending.totalPrice.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* MOCK RAZORPAY CHECKOUT MODAL */}
        {showCheckout && orderMetadata && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in border border-neutral-light">
              
              {/* Header with Razorpay Logo and Timer */}
              <div className="bg-[#0f172a] text-white px-6 py-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] tracking-wider uppercase font-bold text-neutral-muted block leading-none mb-1">Payment Portal</span>
                  <h3 className="font-sans font-extrabold text-lg flex items-center gap-1.5">
                    <span className="text-teal-primary font-bold">BookMyVenue</span> Pay
                  </h3>
                </div>
                <div className="bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/10">
                  <Clock className="h-4 w-4 text-amber-cta" />
                  <span className="font-mono font-bold text-sm tracking-wide">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Order Details & Summary */}
              <div className="px-6 py-4 bg-[#f8fafc] border-b border-neutral-light flex justify-between items-center text-xs">
                <div>
                  <span className="text-neutral-muted block">Order ID</span>
                  <span className="font-mono font-bold text-neutral-dark">{orderMetadata.orderId}</span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-muted block">Amount Due</span>
                  <span className="text-sm font-extrabold text-teal-primary">₹{Number(orderMetadata.amount).toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Payment Options */}
              <div className="p-6 space-y-4">
                {checkoutError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3.5 text-xs flex gap-2 items-start">
                    <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                <label className="text-[10px] uppercase font-bold text-neutral-muted block">Select Payment Method</label>
                
                <div className="grid grid-cols-1 gap-3">
                  {/* UPI Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex items-center gap-4 p-4 border rounded-xl text-left cursor-pointer transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-teal-primary bg-teal-light/20 ring-1 ring-teal-primary'
                        : 'border-neutral-light hover:border-neutral-muted bg-white'
                    }`}
                  >
                    <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'upi' ? 'border-teal-primary' : 'border-neutral-muted'
                    }`}>
                      {paymentMethod === 'upi' && <div className="h-2.5 w-2.5 rounded-full bg-teal-primary" />}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-neutral-dark block">UPI / Instant Pay</span>
                      <span className="text-xs text-neutral-muted">Google Pay, PhonePe, Paytm</span>
                    </div>
                  </button>

                  {/* Card Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center gap-4 p-4 border rounded-xl text-left cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-teal-primary bg-teal-light/20 ring-1 ring-teal-primary'
                        : 'border-neutral-light hover:border-neutral-muted bg-white'
                    }`}
                  >
                    <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'card' ? 'border-teal-primary' : 'border-neutral-muted'
                    }`}>
                      {paymentMethod === 'card' && <div className="h-2.5 w-2.5 rounded-full bg-teal-primary" />}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-neutral-dark block">Credit or Debit Card</span>
                      <span className="text-xs text-neutral-muted">Visa, Mastercard, RuPay, Amex</span>
                    </div>
                  </button>

                  {/* QR Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qr')}
                    className={`flex items-center gap-4 p-4 border rounded-xl text-left cursor-pointer transition-all ${
                      paymentMethod === 'qr'
                        ? 'border-teal-primary bg-teal-light/20 ring-1 ring-teal-primary'
                        : 'border-neutral-light hover:border-neutral-muted bg-white'
                    }`}
                  >
                    <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'qr' ? 'border-teal-primary' : 'border-neutral-muted'
                    }`}>
                      {paymentMethod === 'qr' && <div className="h-2.5 w-2.5 rounded-full bg-teal-primary" />}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-neutral-dark block">Scan QR Code</span>
                      <span className="text-xs text-neutral-muted">Scan with any UPI app to pay</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-[#f8fafc] border-t border-neutral-light flex gap-3">
                <Button
                  type="button"
                  onClick={handleCancelCheckout}
                  disabled={isProcessingPayment}
                  variant="outline"
                  className="flex-1 border-input text-neutral-dark hover:bg-neutral-light rounded-xl h-11 font-bold text-sm cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleMockPayment}
                  disabled={isProcessingPayment || timeLeft <= 0}
                  className="flex-1 bg-teal-primary text-white hover:bg-teal-hover rounded-xl h-11 font-bold text-sm shadow-md shadow-teal-primary/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Pay Now
                    </>
                  )}
                </Button>
              </div>
              
              <div className="pb-3 text-center text-[10px] text-neutral-muted">
                🛡 Secured by BookMyVenue Sandbox Protocol
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
