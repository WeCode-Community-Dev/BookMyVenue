import {
  CreditCard,
  BadgeCheck,
  Calendar,
  Wallet,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

const PaymentSummaryCard = ({ payment }) => {
  const statusClass = {
    success: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
    refunded: "bg-purple-100 text-purple-700",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Payment Summary
        </CardTitle>
      </CardHeader>

      <CardContent>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {/* Payment ID */}
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-primary mt-1" />

            <div>
              <p className="text-sm text-muted-foreground">
                Payment ID
              </p>

              <p className="font-medium">
                {payment.id?.slice(-8)}
              </p>
            </div>
          </div>

          {/* Status */}
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
            <Wallet className="w-5 h-5 text-primary mt-1" />

            <div>
              <p className="text-sm text-muted-foreground">
                Payment Method
              </p>

              <p className="font-medium capitalize">
                {payment.paymentMethod}
              </p>
            </div>
          </div>

          {/* Created */}
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary mt-1" />

            <div>
              <p className="text-sm text-muted-foreground">
                Created At
              </p>

              <p className="font-medium">
                {new Date(
                  payment.createdAt
                ).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Updated */}
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary mt-1" />

            <div>
              <p className="text-sm text-muted-foreground">
                Updated At
              </p>

              <p className="font-medium">
                {new Date(
                  payment.updatedAt
                ).toLocaleString()}
              </p>
            </div>
          </div>

        </div>

      </CardContent>
    </Card>
  );
};

export default PaymentSummaryCard;