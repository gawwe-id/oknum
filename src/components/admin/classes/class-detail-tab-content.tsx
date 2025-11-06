"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ClassDetailTabContentProps {
  classData: any;
}

export function ClassDetailTabContent({
  classData,
}: ClassDetailTabContentProps) {
  const initials = classData.expert?.name
    ? classData.expert.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "E";

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Title</p>
              <p className="font-medium">{classData.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <Badge variant="outline">{classData.category}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <Badge variant="outline" className="capitalize">
                {classData.type}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                variant="outline"
                className={cn(
                  "capitalize",
                  classData.status === "published" &&
                    "bg-emerald-600 text-white",
                  classData.status === "draft" && "bg-gray-500 text-white",
                  classData.status === "completed" &&
                    "bg-blue-600 text-white",
                  classData.status === "cancelled" && "bg-red-600 text-white"
                )}
              >
                {classData.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-semibold text-lg">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: classData.currency || "IDR",
                }).format(classData.price)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">
                {classData.duration}{" "}
                {classData.duration === 1 ? "session" : "sessions"}
              </p>
            </div>
            {(classData.minStudents || classData.maxStudents) && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Student Capacity
                </p>
                <p className="font-medium">
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

      {/* Images */}
      {classData.thumbnail && (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Thumbnail</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={classData.thumbnail}
              alt={classData.title}
              className="w-full max-w-md h-auto rounded-lg"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

