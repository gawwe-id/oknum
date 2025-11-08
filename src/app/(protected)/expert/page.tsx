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
  BookOpen,
  DollarSign,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function ExpertOverviewPage() {
  const dashboardData = useQuery(api.dashboard.getExpertDashboard);
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
    totalClasses,
    totalRevenue,
    activeClasses,
    totalBookings,
    upcomingSchedules,
    recentEnrollments,
    recentRevenue,
  } = dashboardData;

  return (
    <Protect>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Expert Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your classes, students, and revenue
          </p>
        </div>

        {/* Statistics Cards - Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Enrolled in your classes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Classes
              </CardTitle>
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
                Total Bookings
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total enrollments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Schedules
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingSchedules}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Upcoming sessions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Cards - Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div key={currency} className="text-2xl font-bold">
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
                  From successful payments
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
        </div>

        {/* Recent Revenue */}
        {recentRevenue.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Revenue
              </CardTitle>
              <CardDescription>
                Latest successful payments from your classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRevenue.map((revenue: any) => (
                  <div
                    key={revenue.paymentId || revenue.bookingId}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">
                          {revenue.className || "Unknown Class"}
                        </h4>
                        <Badge className="bg-emerald-600 text-white">
                          Paid
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Student: </span>
                          {revenue.studentName || "Unknown Student"}
                        </div>
                        <div>
                          <span className="font-medium">Amount: </span>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: revenue.currency || "IDR",
                          }).format(revenue.amount)}
                        </div>
                        {revenue.paidAt && (
                          <div>
                            <span className="font-medium">Paid: </span>
                            {format(new Date(revenue.paidAt), "PPP")}
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

        {/* Recent Enrollments */}
        {recentEnrollments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Enrollments</CardTitle>
              <CardDescription>
                Latest student enrollments in your classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEnrollments.map((enrollment: any) => (
                  <div
                    key={enrollment._id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => router.push("/expert/classes")}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">
                          {enrollment.className || "Unknown Class"}
                        </h4>
                        <Badge
                          className={`${
                            enrollment.status === "confirmed"
                              ? "bg-emerald-600"
                              : enrollment.status === "pending"
                              ? "bg-yellow-500"
                              : enrollment.status === "completed"
                              ? "bg-blue-600"
                              : "bg-red-600"
                          } text-white capitalize`}
                        >
                          {enrollment.status}
                        </Badge>
                        {enrollment.paymentStatus && (
                          <Badge
                            variant="outline"
                            className={`${
                              enrollment.paymentStatus === "paid"
                                ? "border-emerald-600 text-emerald-600"
                                : enrollment.paymentStatus === "pending"
                                ? "border-yellow-500 text-yellow-500"
                                : "border-red-600 text-red-600"
                            }`}
                          >
                            {enrollment.paymentStatus}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Student: </span>
                          {enrollment.studentName || "Unknown Student"}
                        </div>
                        <div>
                          <span className="font-medium">Amount: </span>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: enrollment.currency || "IDR",
                          }).format(enrollment.totalAmount)}
                        </div>
                        <div>
                          <span className="font-medium">Enrolled: </span>
                          {format(new Date(enrollment.bookingDate), "PPP")}
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
        {totalClasses === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No classes yet</p>
                <p className="text-sm">
                  Start by creating your first class to begin teaching
                </p>
                <button
                  onClick={() => router.push("/expert/classes/new")}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Create Your First Class
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Protect>
  );
}
