"use client";

import { Protect } from "@clerk/nextjs";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../../../../convex/_generated/api";
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
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function OverviewPage() {
  const dashboardData = useQuery(api.dashboard.getStudentDashboard);
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
    totalClasses,
    incomingClasses,
    completedClasses,
    pendingBookings,
    totalSpent,
    upcomingSchedules,
    recentBookings,
  } = dashboardData;

  return (
    <Protect>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your classes, enrollments, and upcoming schedules
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                Enrolled classes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Incoming Classes
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{incomingClasses}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Upcoming sessions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedClasses}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Finished classes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
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

        {/* Total Spent Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {Object.keys(totalSpent).length > 0 ? (
                Object.entries(totalSpent).map(([currency, amount]) => (
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
                Total amount paid
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Schedules */}
        {upcomingSchedules.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Upcoming Schedules
              </CardTitle>
              <CardDescription>Your upcoming class sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSchedules.slice(0, 5).map((schedule, index) => (
                  <div
                    key={`${schedule.classId}-${schedule.scheduleId}-${index}`}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/classes/${schedule.classId}`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{schedule.className}</h4>
                        <Badge variant="secondary">
                          Session {schedule.sessionNumber}
                        </Badge>
                      </div>
                      {schedule.sessionTitle && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {schedule.sessionTitle}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Date: </span>
                          {format(new Date(schedule.startDate), "PPP")}
                        </div>
                        <div>
                          <span className="font-medium">Time: </span>
                          {schedule.startTime} - {schedule.endTime}
                        </div>
                        {schedule.location.type === "online" &&
                          schedule.location.onlineLink && (
                            <div>
                              <span className="font-medium">Type: </span>
                              <Badge variant="outline" className="ml-1">
                                Online
                              </Badge>
                            </div>
                          )}
                        {schedule.location.type === "offline" &&
                          schedule.location.address && (
                            <div>
                              <span className="font-medium">Location: </span>
                              {schedule.location.address}
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
              <CardDescription>Your latest class enrollments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => router.push("/enrollments")}
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
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Amount: </span>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: booking.currency || "IDR",
                          }).format(booking.totalAmount)}
                        </div>
                        <div>
                          <span className="font-medium">Sessions: </span>
                          {booking.schedules?.length || 0}
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
        {totalClasses === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No enrollments yet</p>
                <p className="text-sm">
                  Browse classes to start your learning journey!
                </p>
                <button
                  onClick={() => router.push("/classes")}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Browse Classes
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Protect>
  );
}
