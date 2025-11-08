"use client";

import { Protect } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function AdminOverviewPage() {
  const dashboardData = useQuery(api.dashboard.getAdminDashboard);
  const router = useRouter();

  if (dashboardData === undefined) {
    return (
      <Protect>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </Protect>
    );
  }

  const {
    totalStudents,
    totalExperts,
    totalClasses,
    totalRevenue,
    totalBookings,
    totalPayments,
    activeClasses,
    pendingBookings,
    recentBookings,
    recentPayments,
  } = dashboardData;

  return (
    <Protect>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of the entire platform - users, classes, bookings, and
            revenue
          </p>
        </div>

        {/* Statistics Cards - Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                All Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Registered students
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">All Experts</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalExperts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active instructors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">All Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClasses}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeClasses} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                All Bookings
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {pendingBookings} pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Cards - Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {Object.keys(totalRevenue).length > 0 ? (
                  Object.entries(totalRevenue).map(([currency, amount]) => (
                    <div key={currency} className="text-lg font-bold">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: currency || "IDR",
                      }).format(amount as number)}
                    </div>
                  ))
                ) : (
                  <div className="text-2xl font-bold">Rp 0</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  From {totalPayments} successful payments
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Classes
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeClasses}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Published classes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Bookings
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting payment
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Payments */}
        {recentPayments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Payments
              </CardTitle>
              <CardDescription>
                Latest successful payments across all classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map((payment: any) => (
                  <div
                    key={payment._id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">
                          {payment.className || "Unknown Class"}
                        </h4>
                        <Badge className="bg-emerald-600 text-white">
                          Paid
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Student: </span>
                          {payment.studentName || "Unknown Student"}
                        </div>
                        <div>
                          <span className="font-medium">Amount: </span>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: payment.currency || "IDR",
                          }).format(payment.amount)}
                        </div>
                        <div>
                          <span className="font-medium">Method: </span>
                          {payment.paymentMethod}
                        </div>
                        {payment.paidAt && (
                          <div>
                            <span className="font-medium">Paid: </span>
                            {format(new Date(payment.paidAt), "PPP")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Bookings */}
        {recentBookings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>
                Latest class enrollments across all students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking: any) => (
                  <div
                    key={booking._id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => router.push("/admin/classes")}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">
                          {booking.className || "Unknown Class"}
                        </h4>
                        <Badge
                          className={`${
                            booking.status === "confirmed"
                              ? "bg-emerald-600"
                              : booking.status === "pending"
                              ? "bg-yellow-500"
                              : booking.status === "completed"
                              ? "bg-blue-600"
                              : "bg-red-600"
                          } text-white capitalize`}
                        >
                          {booking.status}
                        </Badge>
                        {booking.paymentStatus && (
                          <Badge
                            variant="outline"
                            className={`${
                              booking.paymentStatus === "paid"
                                ? "border-emerald-600 text-emerald-600"
                                : booking.paymentStatus === "pending"
                                ? "border-yellow-500 text-yellow-500"
                                : "border-red-600 text-red-600"
                            }`}
                          >
                            {booking.paymentStatus}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Student: </span>
                          {booking.studentName || "Unknown Student"}
                        </div>
                        <div>
                          <span className="font-medium">Amount: </span>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: booking.currency || "IDR",
                          }).format(booking.totalAmount)}
                        </div>
                        <div>
                          <span className="font-medium">Booked: </span>
                          {format(new Date(booking.bookingDate), "PPP")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {totalClasses === 0 && totalStudents === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No data yet</p>
                <p className="text-sm">
                  Start by creating classes and managing users
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Protect>
  );
}
