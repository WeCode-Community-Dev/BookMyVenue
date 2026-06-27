import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { CalendarIcon, CheckCircle2Icon, CreditCardIcon, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/store";
import { useCreateOrder, useCreateReservation, useVerifyPayment } from "@/hooks/use-reservation";
import type { PaymentOrder } from "@/api/reservation-api";
import type { Venue } from "@/types/venue.types";
import { AUTH_ROUTES } from "@/routes/common/route-path";

const toTimeInput = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const formatDate = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const errorMessage = (error: unknown, fallback: string) =>
  isAxiosError(error) ? (error.response?.data?.message ?? fallback) : fallback;

const ReserveDialog = ({ venue }: { venue: Venue }) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"slot" | "pay" | "success">("slot");
  const [order, setOrder] = useState<PaymentOrder | null>(null);

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [start, setStart] = useState(toTimeInput(venue.openingTime));
  const [end, setEnd] = useState(toTimeInput(venue.closingTime));

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const cardComplete = cardNumber.trim() && expiry.trim() && cvc.trim();

  const createReservation = useCreateReservation();
  const createOrder = useCreateOrder();
  const verifyPayment = useVerifyPayment();

  const reset = () => {
    setStep("slot");
    setOrder(null);
    setDate(undefined);
    setCardNumber("");
    setExpiry("");
    setCvc("");
  };

  const handleReserve = () => {
    if (!date) return toast.error("Please pick a date");
    if (start >= end) return toast.error("Start time must be before end time");

    const dateStr = formatDate(date);
    const startTime = new Date(`${dateStr}T${start}`).toISOString();
    const endTime = new Date(`${dateStr}T${end}`).toISOString();

    createReservation.mutate(
      { venueId: venue._id, startTime, endTime },
      {
        onSuccess: (reservation) => {
          createOrder.mutate(reservation._id, {
            onSuccess: (createdOrder) => {
              setOrder(createdOrder);
              setStep("pay");
            },
            onError: (error) => toast.error(errorMessage(error, "Could not start payment.")),
          });
        },
        onError: (error) => toast.error(errorMessage(error, "This slot is not available.")),
      },
    );
  };

  const handleVerify = (success: boolean) => {
    if (!order) return;
    verifyPayment.mutate(
      { orderId: order.orderId, success },
      {
        onSuccess: () => setStep("success"),
        onError: (error) => {
          toast.error(errorMessage(error, "Payment failed. Your slot was released."));
          setOpen(false);
          reset();
        },
      },
    );
  };

  if (!user) {
    return (
      <Button size="lg" className="w-full" onClick={() => navigate(AUTH_ROUTES.SIGN_IN)}>
        Reserve
      </Button>
    );
  }

  const isReserving = createReservation.isPending || createOrder.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) reset();
      }}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          Reserve
        </Button>
      </DialogTrigger>
      <DialogContent>
        {step === "slot" ? (
          <>
            <DialogHeader>
              <DialogTitle>Reserve {venue.name}</DialogTitle>
              <DialogDescription>Pick your date and time slot.</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <Field className="gap-1.5">
                <FieldLabel>Date</FieldLabel>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                      )}>
                      <CalendarIcon className="mr-2 size-4" />
                      {date ? formatDate(date) : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(value) => {
                        setDate(value);
                        setDatePickerOpen(false);
                      }}
                      disabled={{ before: startOfToday() }}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="start">Start</FieldLabel>
                  <Input
                    id="start"
                    type="time"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                  />
                </Field>
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="end">End</FieldLabel>
                  <Input
                    id="end"
                    type="time"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />
                </Field>
              </div>
              <p className="text-xs text-muted-foreground">
                Venue hours: {toTimeInput(venue.openingTime)} – {toTimeInput(venue.closingTime)}
              </p>
            </div>

            <DialogFooter>
              <Button onClick={handleReserve} disabled={isReserving}>
                {isReserving ? "Checking..." : "Continue to payment"}
              </Button>
            </DialogFooter>
          </>
        ) : step === "pay" ? (
          <>
            <DialogHeader>
              <DialogTitle>Complete payment</DialogTitle>
              <DialogDescription>
                Your slot is held for 10 minutes. This is a demo payment — no real charge.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg border p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{venue.name}</span>
                <span>{date ? formatDate(date) : ""}</span>
              </div>
              <div className="mt-1 flex justify-between text-muted-foreground">
                <span>
                  {start} – {end}
                </span>
                <span className="text-base font-semibold text-foreground">₹{order?.amount}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Field className="gap-1.5">
                <FieldLabel htmlFor="card">Card number</FieldLabel>
                <div className="relative">
                  <CreditCardIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="card"
                    inputMode="numeric"
                    placeholder="4242 4242 4242 4242"
                    className="pl-9"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="expiry">Expiry</FieldLabel>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                </Field>
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="cvc">CVC</FieldLabel>
                  <Input
                    id="cvc"
                    inputMode="numeric"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                  />
                </Field>
              </div>
            </div>

            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button
                onClick={() => handleVerify(true)}
                disabled={verifyPayment.isPending || !cardComplete}
                className="w-full">
                <LockIcon className="size-4" />
                {verifyPayment.isPending ? "Processing..." : `Pay ₹${order?.amount}`}
              </Button>
              <button
                type="button"
                onClick={() => handleVerify(false)}
                disabled={verifyPayment.isPending}
                className="text-center text-xs text-muted-foreground underline-offset-4 hover:underline">
                Simulate a failed payment
              </button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2Icon className="size-12 text-green-600" />
            <DialogHeader className="items-center">
              <DialogTitle>Booking confirmed!</DialogTitle>
              <DialogDescription>
                {venue.name} · {date ? formatDate(date) : ""} · {start}–{end}
              </DialogDescription>
            </DialogHeader>
            <Button
              className="mt-2 w-full"
              onClick={() => {
                setOpen(false);
                reset();
              }}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReserveDialog;
