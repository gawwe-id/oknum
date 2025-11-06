"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ClassSchedulesTabContentProps {
  classData: any;
}

export function ClassSchedulesTabContent({
  classData,
}: ClassSchedulesTabContentProps) {
  if (!classData.schedules || classData.schedules.length === 0) {
    return (
      <Card className="shadow-none">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No schedules available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {classData.schedules.map((schedule: any, index: number) => (
        <Card key={index} className="shadow-none">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
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
              <Badge
                variant="outline"
                className={cn(
                  "capitalize",
                  schedule.status === "upcoming" && "bg-blue-600 text-white",
                  schedule.status === "ongoing" && "bg-emerald-600 text-white",
                  schedule.status === "completed" &&
                    "bg-gray-500 text-white",
                  schedule.status === "cancelled" && "bg-red-600 text-white"
                )}
              >
                {schedule.status}
              </Badge>
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
                  {schedule.startTime} - {schedule.endTime} ({schedule.timezone})
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
  );
}

