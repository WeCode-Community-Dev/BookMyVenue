import {
  IndianRupee,
  CreditCard,
  Wallet,
  BadgeCheck,
  RotateCcw,
  CalendarClock,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

const PaymentInfoCard = ({ payment }) => {
  if (!payment) return null;

  const statusClass = {
    success: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
    refunded: "bg-purple-100 text-purple-700",
    partial: "bg-orange-100 text-orange-700",
    paid: "bg-green-100 text-green-700",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">

        {/* Amount */}
        <div className="flex items-start gap-3">
          <IndianRupee className="w-5 h-5 text-primary mt-1" />

          <div>
            <p className="text-sm text-muted-foreground">
              Amount Paid
            </p>

            <p className="font-semibold text-lg">
              ₹{payment.amount?.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Payment Type */}
        <div className="flex items-start gap-3">
          <Wallet className="w-5 h-5 text-primary mt-1" />

          <div>
            <p className="text-sm text-muted-foreground">
              Payment Type
            </p>

            <p className="font-medium capitalize">
              {payment.paymentType}
            </p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-primary mt-1" />

          <div>
            <p className="text-sm text-muted-foreground">
              Payment Method
            </p>

            <p className="font-medium capitalize">
              {payment.paymentMethod}
            </p>
          </div>
        </div>

        {/* Payment Status */}
        <div className="flex items-start gap-3">
          <BadgeCheck className="w-5 h-5 text-primary mt-1" />

          <div>
            <p className="text-sm text-muted-foreground">
              Payment Status
            </p>

            <Badge
              className={
                statusClass[payment.paymentStatus]
              }
            >
              {payment.paymentStatus}
            </Badge>
          </div>
        </div>

        {/* Refund Amount */}
        <div className="flex items-start gap-3">
          <RotateCcw className="w-5 h-5 text-primary mt-1" />

          <div>
            <p className="text-sm text-muted-foreground">
              Refund Amount
            </p>

            <p className="font-medium">
              {payment.refundAmount
                ? `₹${payment.refundAmount.toLocaleString()}`
                : "-"}
            </p>
          </div>
        </div>

        {/* Refund Reason */}
        <div className="flex items-start gap-3">
          <RotateCcw className="w-5 h-5 text-primary mt-1" />

          <div>
            <p className="text-sm text-muted-foreground">
              Refund Reason
            </p>

            <p className="font-medium">
              {payment.refundReason || "-"}
            </p>
          </div>
        </div>

        {/* Refunded At */}
        <div className="flex items-start gap-3">
          <CalendarClock className="w-5 h-5 text-primary mt-1" />

          <div>
            <p className="text-sm text-muted-foreground">
              Refunded At
            </p>

            <p className="font-medium">
              {payment.refundedAt
                ? new Date(
                    payment.refundedAt
                  ).toLocaleString()
                : "-"}
            </p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default PaymentInfoCard;