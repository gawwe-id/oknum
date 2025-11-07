"use client";

import { Protect } from "@clerk/nextjs";
import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { Loader2, CreditCard, Calendar, MapPin } from "lucide-react";
import { DialogPayment } from "@/components/dialog/dialog-payment";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  confirmed: "bg-emerald-600",
  cancelled: "bg-red-600",
  completed: "bg-blue-600",
};

const paymentStatusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  paid: "bg-emerald-600",
  failed: "bg-red-600",
  refunded: "bg-gray-600",
};

type BookingWithDetails = {
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

export default function EnrollmentsPage() {
  const bookings = useQuery(api.bookings.getBookingsByUser, {});
  const currentUser = useQuery(api.users.getCurrentUserQuery, {});

  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState<{
    bookingId: Id<"bookings">;
    classData: {
      title: string;
      price: number;
      currency: string;
    };
  } | null>(null);

  const handleOpenPayment = (booking: BookingWithDetails) => {
    if (!currentUser) {
      toast.error("User information not available. Please refresh the page.");
      return;
    }

    if (!booking.classItem) {
      toast.error("Class information not available.");
      return;
    }

    setSelectedBooking({
      bookingId: booking._id,
      classData: {
        title: booking.classItem.title,
        price: booking.totalAmount,
        currency: booking.currency || "IDR",
      },
    });
    setPaymentDialogOpen(true);
  };

  const handlePaymentSuccess = () => {
    // The query will automatically refresh
    setPaymentDialogOpen(false);
    setSelectedBooking(null);
    toast.success("Payment initiated successfully!");
  };

  if (bookings === undefined || currentUser === undefined) {
    return (
      <Protect>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </Protect>
    );
  }

  return (
    <Protect>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Enrollments</h1>
          <p className="text-muted-foreground">
            Manage your class enrollments and payments
          </p>
        </div>

        {bookings.length === 0 ? (
          <Card className="shadow-none">
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <p>You don't have any enrollments yet.</p>
                <p className="text-sm mt-2">
                  Browse classes to start enrolling!
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking: BookingWithDetails) => {
              if (!booking.classItem) return null;

              const isPendingPayment =
                booking.paymentStatus === "pending" &&
                booking.status === "pending";

              return (
                <Card key={booking._id} className="shadow-none">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="mb-2">
                          {booking.classItem.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            className={`${
                              statusColors[booking.status] || "bg-gray-500"
                            } text-white capitalize`}
                          >
                            {booking.status}
                          </Badge>
                          <Badge
                            className={`${
                              paymentStatusColors[booking.paymentStatus] ||
                              "bg-gray-500"
                            } text-white capitalize`}
                          >
                            {booking.paymentStatus}
                          </Badge>
                        </div>
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
                                  {new Date(
                                    schedule.startDate
                                  ).toLocaleDateString("id-ID")}{" "}
                                  {schedule.startTime} - {schedule.endTime} (
                                  {schedule.timezone})
                                </p>
                                {schedule.location && (
                                  <div className="flex items-start gap-1 mt-1">
                                    <MapPin className="size-3 mt-0.5 text-muted-foreground shrink-0" />
                                    <p className="text-xs text-muted-foreground">
                                      {schedule.location.type === "online"
                                        ? schedule.location.onlineLink ||
                                          "Online"
                                        : schedule.location.address ||
                                          "Offline"}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Booking Date */}
                    <div className="text-sm text-muted-foreground">
                      Booked on:{" "}
                      {new Date(booking.bookingDate).toLocaleDateString(
                        "id-ID",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </div>

                    {/* Notes */}
                    {booking.notes && (
                      <div className="text-sm">
                        <p className="text-muted-foreground mb-1">Notes:</p>
                        <p className="bg-muted/50 p-2 rounded">
                          {booking.notes}
                        </p>
                      </div>
                    )}

                    {/* Payment Button */}
                    {isPendingPayment && (
                      <div className="pt-2 border-t">
                        <ButtonPrimary
                          onClick={() => handleOpenPayment(booking)}
                          className="w-full sm:w-auto"
                        >
                          <CreditCard className="size-4 mr-2" />
                          Complete Payment
                        </ButtonPrimary>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Payment Dialog */}
        {selectedBooking && currentUser && (
          <DialogPayment
            open={paymentDialogOpen}
            onOpenChange={setPaymentDialogOpen}
            bookingId={selectedBooking.bookingId}
            classData={selectedBooking.classData}
            customerInfo={{
              name: currentUser.name,
              email: currentUser.email,
              phone: currentUser.phone,
            }}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </Protect>
  );
}
