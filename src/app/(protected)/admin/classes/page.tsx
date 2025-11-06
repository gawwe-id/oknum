"use client";

import { Protect } from "@clerk/nextjs";
import * as React from "react";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { DialogAddClass, ClassCard } from "@/components/admin/classes";
import { Plus } from "lucide-react";

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
  curriculum?: any;
  schedules?: any[];
};

export default function AdminClassesPage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  // Get all classes for admin (no status filter - gets published by default, but we want all)
  // Note: getClasses returns published by default, so for admin we might want to query without status filter
  const classes = (useQuery(api.classes.getClasses, {}) || []) as Class[];

  return (
    <Protect>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Classes</h1>
            <p className="text-muted-foreground mt-1">Manage all classes</p>
          </div>
          <ButtonPrimary
            variant="solid"
            size="md"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="size-4" />
            Add Class
          </ButtonPrimary>
        </div>

        {/* Classes Grid - Responsive 6:6 (2 columns) */}
        {classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((classItem: Class) => (
              <ClassCard key={classItem._id} classItem={classItem} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
            <p className="text-muted-foreground text-lg mb-2">
              No classes found
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              Get started by creating your first class
            </p>
            <ButtonPrimary
              variant="outline"
              size="sm"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="size-4" />
              Add Your First Class
            </ButtonPrimary>
          </div>
        )}

        {/* Dialog */}
        <DialogAddClass open={dialogOpen} onOpenChange={setDialogOpen} />
      </div>
    </Protect>
  );
}
