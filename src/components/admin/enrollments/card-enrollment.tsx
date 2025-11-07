"use client";

import * as React from "react";
import type { Id } from "../../../../convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { useRouter } from "next/navigation";
import { Image, CreditCard } from "lucide-react";

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
    thumbnail?: string;
    description?: string;
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

interface CardEnrollmentProps {
  booking: BookingWithDetails;
}

export function CardEnrollment({ booking }: CardEnrollmentProps) {
  const router = useRouter();

  if (!booking.classItem) return null;

  const isPending = booking.status === "pending";
  const sessionCount = booking.schedules?.length || 0;

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden pt-0">
      {/* Thumbnail */}
      <div className="w-full h-48 overflow-hidden bg-muted flex items-center justify-center">
        {booking.classItem.thumbnail ? (
          <img
            src={booking.classItem.thumbnail}
            alt={booking.classItem.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Image className="size-12 mb-2 opacity-50" />
            <span className="text-sm opacity-50">No thumbnail</span>
          </div>
        )}
      </div>

      <CardHeader className="mb-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="line-clamp-2">
              {booking.classItem.title}
            </CardTitle>
            {booking.classItem.description && (
              <CardDescription className="line-clamp-2 mb-3">
                {booking.classItem.description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <Badge
            className={`${
              statusColors[booking.status] || "bg-gray-500"
            } text-white capitalize`}
          >
            {booking.status}
          </Badge>
          {/* Total Amount & Sessions */}
          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              {sessionCount} {sessionCount === 1 ? "session" : "sessions"}
            </div>
          </div>

          {/* Booking Date */}
          <div className="text-sm text-muted-foreground">
            Booked on:{" "}
            {new Date(booking.bookingDate).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {/* Payment Button for Pending Status */}
          {isPending && (
            <div className="pt-2 border-t">
              <ButtonPrimary
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/payment-invoices");
                }}
                className="w-full"
              >
                <CreditCard className="size-4 mr-2" />
                View Payment Invoice
              </ButtonPrimary>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
