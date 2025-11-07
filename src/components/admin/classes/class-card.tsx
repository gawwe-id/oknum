"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Id } from "../../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { Image } from "lucide-react";

type Class = {
  _id: Id<"classes">;
  expertId: Id<"experts">;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  type: "offline" | "online" | "hybrid";
  maxStudents?: number;
  minStudents?: number;
  duration: number;
  thumbnail?: string;
  images?: string[];
  status: "draft" | "published" | "completed" | "cancelled";
  createdAt: number;
  updatedAt: number;
  expert?: {
    _id: Id<"experts">;
    name: string;
    email: string;
    profileImage?: string;
  } | null;
};

interface ClassCardProps {
  classItem: Class;
}

const statusColors = {
  draft: "bg-gray-500",
  published: "bg-emerald-600",
  completed: "bg-blue-600",
  cancelled: "bg-red-600",
};

const typeLabels = {
  offline: "Offline",
  online: "Online",
  hybrid: "Hybrid",
};

export function ClassCard({ classItem }: ClassCardProps) {
  const router = useRouter();
  const initials = classItem.expert?.name
    ? classItem.expert.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden pt-0"
      onClick={() => router.push(`/admin/classes/${classItem._id}`)}
    >
      <div className="w-full h-48 overflow-hidden bg-muted flex items-center justify-center">
        {classItem.thumbnail ? (
          <img
            src={classItem.thumbnail}
            alt={classItem.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Image className="size-12 mb-2 opacity-50" />
            <span className="text-sm opacity-50">No thumbnail</span>
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="line-clamp-2 mb-2">
              {classItem.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 mb-3">
              {classItem.description}
            </CardDescription>
          </div>
          <Badge
            className={`${
              statusColors[classItem.status]
            } text-white capitalize`}
          >
            {classItem.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Expert Info */}
          {classItem.expert && (
            <div className="flex items-center gap-2 text-sm">
              <Avatar className="size-6">
                <AvatarImage src={classItem.expert.profileImage} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground truncate">
                {classItem.expert.name}
              </span>
            </div>
          )}

          {/* Category & Type */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">{classItem.category}</Badge>
            <Badge variant="outline">{typeLabels[classItem.type]}</Badge>
          </div>

          {/* Price & Duration */}
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="font-semibold text-lg">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: classItem.currency || "IDR",
                }).format(classItem.price)}
              </span>
            </div>
            <div className="text-muted-foreground">
              {classItem.duration}{" "}
              {classItem.duration === 1 ? "session" : "sessions"}
            </div>
          </div>

          {/* Students Capacity */}
          {(classItem.minStudents || classItem.maxStudents) && (
            <div className="text-sm text-muted-foreground">
              Students: {classItem.minStudents || 0} -{" "}
              {classItem.maxStudents || "∞"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
