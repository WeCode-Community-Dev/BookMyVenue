import Link from "next/link";
import { CheckCircle2, CalendarDays, Home, ReceiptText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function BookingSuccessPage() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/30 px-4 py-10">
            <Card className="w-full max-w-xl border-0 shadow-xl">
                <CardContent className="flex flex-col items-center space-y-6 p-10 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-12 w-12 text-green-600" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Booking Confirmed!</h1>

                        <p className="text-muted-foreground flex flex-col">
                            Your venue has been booked successfully.
                            <span>A confirmation has been sent to your email.</span>
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:flex-row">
                        <Button asChild className="flex-1">
                            <Link href="/bookings">
                                <ReceiptText className="mr-2 h-4 w-4" />
                                View Booking
                            </Link>
                        </Button>

                        <Button variant="outline" asChild className="flex-1">
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        Need to make changes? You can manage from your bookings page.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
