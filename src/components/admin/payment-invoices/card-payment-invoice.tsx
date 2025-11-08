import * as React from "react";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { Calendar, MapPin, Download, CreditCard } from "lucide-react";

const paymentStatusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  paid: "bg-emerald-600",
  failed: "bg-red-600",
  refunded: "bg-gray-600",
};

export type BookingWithDetails = {
  _id: Id<"bookings">;
  userId: Id<"users">;
  classId: Id<"classes">;
  scheduleIds: Id<"schedules">[];
  sessionNumbers: string[];
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentId?: Id<"payments">;
  totalAmount: number;
  currency: string;
  bookingDate: number;
  notes?: string;
  createdAt: number;
  classItem: {
    _id: Id<"classes">;
    title: string;
    price: number;
    currency: string;
  } | null;
  schedules: Array<{
    _id: Id<"schedules">;
    sessionNumber: string;
    sessionTitle?: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    timezone: string;
    location: {
      type: "offline" | "online" | "hybrid";
      address?: string;
      onlineLink?: string;
    };
  }>;
};

interface CardPaymentInvoiceProps {
  booking: BookingWithDetails;
  onOpenPayment: (booking: BookingWithDetails) => void;
}

export function CardPaymentInvoice({
  booking,
  onOpenPayment,
}: CardPaymentInvoiceProps) {
  if (!booking.classItem) return null;

  const isPendingPayment =
    booking.paymentStatus === "pending" && booking.status === "pending";

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="mb-2">{booking.classItem.title}</CardTitle>
            <Badge
              className={`${
                paymentStatusColors[booking.paymentStatus] || "bg-gray-500"
              } text-white capitalize`}
            >
              {booking.paymentStatus}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-semibold text-lg">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: booking.currency || "IDR",
              }).format(booking.totalAmount)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Schedules */}
        {booking.schedules && booking.schedules.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Sessions:</p>
            <div className="space-y-2">
              {booking.schedules.map((schedule) => (
                <div
                  key={schedule._id}
                  className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <Calendar className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      Session {schedule.sessionNumber}
                      {schedule.sessionTitle && (
                        <span className="text-muted-foreground ml-2">
                          - {schedule.sessionTitle}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(schedule.startDate).toLocaleDateString("id-ID")}{" "}
                      {schedule.startTime} - {schedule.endTime} (
                      {schedule.timezone})
                    </p>
                    {schedule.location && (
                      <div className="flex items-start gap-1 mt-1">
                        <MapPin className="size-3 mt-0.5 text-muted-foreground shrink-0" />
                        <p className="text-xs text-muted-foreground">
                          {schedule.location.type === "online"
                            ? schedule.location.onlineLink || "Online"
                            : schedule.location.address || "Offline"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <div className="text-sm">
            <p className="text-muted-foreground mb-1">Notes:</p>
            <p className="bg-muted/50 p-2 rounded">{booking.notes}</p>
          </div>
        )}

        {/* Payment Button */}
        {isPendingPayment && (
          <div className="pt-2 border-t">
            <ButtonPrimary
              onClick={() => onOpenPayment(booking)}
              className="w-full sm:w-auto"
            >
              <CreditCard className="size-4 mr-2" />
              Complete Payment
            </ButtonPrimary>
          </div>
        )}

        <div className="flex items-center justify-between">
          {/* Booking Date */}
          <div className="text-sm text-muted-foreground">
            Booked on:{" "}
            {new Date(booking.bookingDate).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <ButtonPrimary
            size={"xs"}
            variant={"link"}
            className="text-emerald-600 hover:text-emerald-700"
          >
            <Download />
            Download Invoice
          </ButtonPrimary>
        </div>
      </CardContent>
    </Card>
  );
}
