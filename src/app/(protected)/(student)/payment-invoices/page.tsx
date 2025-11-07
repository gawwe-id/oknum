"use client";

import { Protect } from "@clerk/nextjs";
import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { DialogPayment } from "@/components/dialog/dialog-payment";
import { toast } from "sonner";
import {
  type BookingWithDetails,
  CardPaymentInvoice,
} from "@/components/admin/payment-invoices/card-payment-invoice";

export default function PaymentInvoicesPage() {
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
          <h1 className="text-3xl font-bold mb-2">Payment Invoices</h1>
          <p className="text-muted-foreground">Manage your payment invoices</p>
        </div>

        {bookings.length === 0 ? (
          <Card className="shadow-none">
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <p>You don't have any payment invoices yet.</p>
                <p className="text-sm mt-2">Browse classes to start paying!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking: BookingWithDetails) => (
              <CardPaymentInvoice
                key={booking._id}
                booking={booking}
                onOpenPayment={handleOpenPayment}
              />
            ))}
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
