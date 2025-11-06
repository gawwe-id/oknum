"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { Plus, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DialogSchedule } from "./dialog-schedule";
import { DialogDeleteSchedule } from "./dialog-delete-schedule";
import { Id } from "../../../../convex/_generated/dataModel";

export function ClassSchedulesTabContent() {
  const params = useParams();
  const classId = params.classId as Id<"classes">;

  const classData = useQuery(api.classes.getClassById, { classId });
  const schedules = useQuery(api.schedules.getSchedulesByClass, { classId });

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editingSchedule, setEditingSchedule] = React.useState<{
    id: Id<"schedules">;
    data: any;
  } | null>(null);
  const [deletingSchedule, setDeletingSchedule] = React.useState<{
    id: Id<"schedules">;
    data: any;
  } | null>(null);

  const handleAddSchedule = () => {
    setEditingSchedule(null);
    setDialogOpen(true);
  };

  const handleEditSchedule = (schedule: any) => {
    setEditingSchedule({
      id: schedule._id,
      data: schedule,
    });
    setDialogOpen(true);
  };

  const handleDeleteSchedule = (schedule: any) => {
    setDeletingSchedule({
      id: schedule._id,
      data: schedule,
    });
    setDeleteDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    // Data will be automatically refreshed by Convex queries
    setDialogOpen(false);
    setEditingSchedule(null);
  };

  const handleDeleteSuccess = () => {
    // Data will be automatically refreshed by Convex queries
    setDeleteDialogOpen(false);
    setDeletingSchedule(null);
  };

  // Loading state
  if (classData === undefined || schedules === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Not found state
  if (!classData) {
    return (
      <Card className="shadow-none">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Class not found</p>
        </CardContent>
      </Card>
    );
  }

  if (!schedules || schedules.length === 0) {
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Schedules</h2>
          <ButtonPrimary onClick={handleAddSchedule}>
            <Plus className="size-4" />
            Add Schedule
          </ButtonPrimary>
        </div>
        <Card className="shadow-none">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No schedules available</p>
          </CardContent>
        </Card>
        <DialogSchedule
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          mode="create"
          classId={classId}
          classData={{
            title: classData.title,
            type: classData.type,
            maxStudents: classData.maxStudents,
            schedules: schedules || [],
          }}
          onSuccess={handleDialogSuccess}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Schedules</h2>
        <ButtonPrimary onClick={handleAddSchedule}>
          <Plus className="size-4" />
          Add Schedule
        </ButtonPrimary>
      </div>
      <div className="space-y-4">
        {schedules.map((schedule: any, index: number) => (
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
                  <CardDescription className="mt-1">
                    {new Date(schedule.startDate).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
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
                      schedule.status === "cancelled" && "bg-red-600 text-white"
                    )}
                  >
                    {schedule.status}
                  </Badge>
                  <ButtonPrimary
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditSchedule(schedule)}
                  >
                    Edit
                  </ButtonPrimary>
                  <ButtonPrimary
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSchedule(schedule)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                  </ButtonPrimary>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">
                    {new Date(schedule.startDate).toLocaleDateString("id-ID")} -{" "}
                    {new Date(schedule.endDate).toLocaleDateString("id-ID")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {schedule.startTime} - {schedule.endTime} (
                    {schedule.timezone})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="font-medium">
                    {schedule.bookedSeats} / {schedule.capacity} seats
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location Type</p>
                  <Badge variant="outline" className="capitalize">
                    {schedule.location.type}
                  </Badge>
                </div>
                {schedule.location.address && (
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
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
                    <p className="text-sm text-muted-foreground">Online Link</p>
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
                    <p className="text-sm text-muted-foreground">Platform</p>
                    <p className="font-medium">{schedule.location.platform}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <DialogSchedule
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={editingSchedule ? "update" : "create"}
        classId={classId}
        classData={{
          title: classData.title,
          type: classData.type,
          maxStudents: classData.maxStudents,
          schedules: schedules || [],
        }}
        scheduleId={editingSchedule?.id}
        scheduleData={editingSchedule?.data}
        onSuccess={handleDialogSuccess}
      />
      {deletingSchedule && (
        <DialogDeleteSchedule
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          scheduleId={deletingSchedule.id}
          scheduleData={{
            sessionNumber: deletingSchedule.data.sessionNumber,
            sessionTitle: deletingSchedule.data.sessionTitle,
            startDate: deletingSchedule.data.startDate,
          }}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  );
}
