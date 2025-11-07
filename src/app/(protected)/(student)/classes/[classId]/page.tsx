"use client";

import { Protect } from "@clerk/nextjs";
import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { Loader2, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DialogPayment } from "@/components/dialog/dialog-payment";

export default function StudentClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.classId as Id<"classes">;

  const classData = useQuery(api.classes.getClassById, { classId });
  const schedules = useQuery(api.schedules.getSchedulesByClass, { classId });
  const curriculum = useQuery(api.curriculum.getCurriculumsByClass, {
    classId,
  });
  const userBookings = useQuery(api.bookings.getBookingsByUser, {});
  const currentUser = useQuery(api.users.getCurrentUserQuery, {});
  const createBooking = useMutation(api.bookings.createBooking);

  const [isEnrolling, setIsEnrolling] = React.useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
  const [bookingId, setBookingId] = React.useState<Id<"bookings"> | null>(null);

  // Check if user has already enrolled in this class
  const hasEnrolled = React.useMemo(() => {
    if (!userBookings || !classId) return false;
    return userBookings.some(
      (booking) =>
        booking.classId === classId &&
        (booking.status === "pending" ||
          booking.status === "confirmed" ||
          booking.status === "completed")
    );
  }, [userBookings, classId]);

  // Get available schedules (upcoming only)
  const availableSchedules = React.useMemo(() => {
    if (!schedules) return [];
    return schedules.filter(
      (schedule) =>
        schedule.status === "upcoming" &&
        schedule.bookedSeats < schedule.capacity
    );
  }, [schedules]);

  const handleEnroll = async () => {
    if (!classData || availableSchedules.length === 0) {
      toast.error("No available schedules for enrollment");
      return;
    }

    if (hasEnrolled) {
      toast.info("You have already enrolled in this class");
      return;
    }

    if (!currentUser) {
      toast.error("User information not available. Please refresh the page.");
      return;
    }

    setIsEnrolling(true);
    try {
      // Step 1: Create booking first
      const scheduleIds = availableSchedules.map((s) => s._id);
      const newBookingId = await createBooking({
        classId: classData._id,
        scheduleIds,
      });

      // Step 2: Open payment dialog
      setBookingId(newBookingId);
      setPaymentDialogOpen(true);
    } catch (error) {
      console.error("Error enrolling:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to enroll. Please try again."
      );
    } finally {
      setIsEnrolling(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Refresh bookings to update UI
    // The query will automatically refresh
    toast.success("Payment initiated successfully!");
  };

  // Loading state
  if (classData === undefined || schedules === undefined) {
    return (
      <Protect>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </Protect>
    );
  }

  // Not found state
  if (!classData) {
    return (
      <Protect>
        <div className="space-y-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground text-lg">Class not found</p>
          </div>
        </div>
      </Protect>
    );
  }

  const initials = classData.expert?.name
    ? classData.expert.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "E";

  return (
    <Protect>
      <div className="space-y-6">
        {/* Header with Back and Enroll Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/classes")}
              className="gap-2"
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{classData.title}</h1>
              <p className="text-muted-foreground mt-1">
                {classData.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-2">
            {hasEnrolled ? (
              <Badge className="bg-emerald-600 text-white">
                Already Enrolled
              </Badge>
            ) : (
              <ButtonPrimary
                onClick={handleEnroll}
                disabled={
                  isEnrolling ||
                  classData.status !== "published" ||
                  availableSchedules.length === 0
                }
                size="lg"
              >
                {isEnrolling ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  "Enroll Now"
                )}
              </ButtonPrimary>
            )}
          </div>
        </div>

        {/* Thumbnail */}
        {classData.thumbnail && (
          <div className="relative w-full aspect-video overflow-hidden rounded-lg border">
            <img
              src={classData.thumbnail}
              alt={classData.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Class Detail Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Class Details</h2>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <Badge variant="outline" className="mt-1">
                    {classData.category}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {classData.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-semibold text-lg mt-1">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: classData.currency || "IDR",
                    }).format(classData.price)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium mt-1">
                    {classData.duration}{" "}
                    {classData.duration === 1 ? "session" : "sessions"}
                  </p>
                </div>
                {(classData.minStudents || classData.maxStudents) && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Student Capacity
                    </p>
                    <p className="font-medium mt-1">
                      {classData.minStudents || 0} -{" "}
                      {classData.maxStudents || "∞"} students
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {classData.description}
              </p>
            </CardContent>
          </Card>

          {/* Expert Information */}
          {classData.expert && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Expert</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="size-12">
                    <AvatarImage src={classData.expert.profileImage} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{classData.expert.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {classData.expert.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Schedules Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Schedules</h2>

          {!schedules || schedules.length === 0 ? (
            <Card className="shadow-none">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No schedules available</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {schedules
                .sort((a: any, b: any) =>
                  a.sessionNumber.localeCompare(b.sessionNumber)
                )
                .map((schedule: any, index: number) => (
                  <Card key={index} className="shadow-none">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle>
                            Session {schedule.sessionNumber}
                            {schedule.sessionTitle && (
                              <span className="text-base font-normal text-muted-foreground ml-2">
                                - {schedule.sessionTitle}
                              </span>
                            )}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(schedule.startDate).toLocaleDateString(
                              "id-ID",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize",
                            schedule.status === "upcoming" &&
                              "bg-blue-600 text-white",
                            schedule.status === "ongoing" &&
                              "bg-emerald-600 text-white",
                            schedule.status === "completed" &&
                              "bg-gray-500 text-white",
                            schedule.status === "cancelled" &&
                              "bg-red-600 text-white"
                          )}
                        >
                          {schedule.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Date & Time
                          </p>
                          <p className="font-medium">
                            {new Date(schedule.startDate).toLocaleDateString(
                              "id-ID"
                            )}{" "}
                            -{" "}
                            {new Date(schedule.endDate).toLocaleDateString(
                              "id-ID"
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {schedule.startTime} - {schedule.endTime} (
                            {schedule.timezone})
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Capacity
                          </p>
                          <p className="font-medium">
                            {schedule.bookedSeats} / {schedule.capacity} seats
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Location Type
                          </p>
                          <Badge variant="outline" className="capitalize mt-1">
                            {schedule.location.type}
                          </Badge>
                        </div>
                        {schedule.location.address && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Address
                            </p>
                            <p className="font-medium">
                              {schedule.location.address}
                              {schedule.location.city && (
                                <span>, {schedule.location.city}</span>
                              )}
                              {schedule.location.province && (
                                <span>, {schedule.location.province}</span>
                              )}
                            </p>
                          </div>
                        )}
                        {schedule.location.onlineLink && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Online Link
                            </p>
                            <a
                              href={schedule.location.onlineLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-primary hover:underline"
                            >
                              {schedule.location.onlineLink}
                            </a>
                          </div>
                        )}
                        {schedule.location.platform && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Platform
                            </p>
                            <p className="font-medium">
                              {schedule.location.platform}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>

        {/* Curriculum Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Curriculum</h2>

          {!curriculum ? (
            <Card className="shadow-none">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No curriculum information available
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Learning Objectives */}
              {curriculum.learningObjectives &&
                curriculum.learningObjectives.length > 0 && (
                  <Card className="shadow-none">
                    <CardHeader>
                      <CardTitle>Learning Objectives</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2">
                        {curriculum.learningObjectives.map(
                          (objective: string, index: number) => (
                            <li key={index} className="text-muted-foreground">
                              {objective}
                            </li>
                          )
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                )}

              {/* Modules */}
              {curriculum.modules && curriculum.modules.length > 0 && (
                <Card className="shadow-none">
                  <CardHeader>
                    <CardTitle>Modules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {curriculum.modules
                        .sort((a: any, b: any) => a.order - b.order)
                        .map((module: any, index: number) => (
                          <div
                            key={index}
                            className="border rounded-lg p-4 space-y-3"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  Module {module.order}: {module.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {module.description}
                                </p>
                              </div>
                              <Badge variant="outline">
                                {module.duration} min
                              </Badge>
                            </div>
                            {module.topics && module.topics.length > 0 && (
                              <div>
                                <p className="text-sm font-medium mb-2">
                                  Topics:
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                  {module.topics.map(
                                    (topic: string, topicIndex: number) => (
                                      <li key={topicIndex}>{topic}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Prerequisites */}
              {curriculum.prerequisites &&
                curriculum.prerequisites.length > 0 && (
                  <Card className="shadow-none">
                    <CardHeader>
                      <CardTitle>Prerequisites</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2">
                        {curriculum.prerequisites.map(
                          (prerequisite: string, index: number) => (
                            <li key={index} className="text-muted-foreground">
                              {prerequisite}
                            </li>
                          )
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                )}

              {/* Materials */}
              {curriculum.materials && curriculum.materials.length > 0 && (
                <Card className="shadow-none">
                  <CardHeader>
                    <CardTitle>Materials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2">
                      {curriculum.materials.map(
                        (material: string, index: number) => (
                          <li key={index} className="text-muted-foreground">
                            {material}
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Payment Dialog */}
        {bookingId && classData && currentUser && (
          <DialogPayment
            open={paymentDialogOpen}
            onOpenChange={setPaymentDialogOpen}
            bookingId={bookingId}
            classData={{
              title: classData.title,
              price: classData.price,
              currency: classData.currency || "IDR",
            }}
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
