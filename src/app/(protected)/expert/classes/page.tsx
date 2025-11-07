"use client";

import { Protect } from "@clerk/nextjs";
import * as React from "react";
import Link from "next/link";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { ClassCard } from "@/components/admin/classes";
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

export default function ExpertClassesPage() {
  // Get classes by current expert (all statuses)
  const classes = (useQuery(api.classes.getClassesByCurrentExpert, {}) ||
    []) as Class[];

  return (
    <Protect>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Classes</h1>
            <p className="text-muted-foreground mt-1">Manage your classes</p>
          </div>
          <Link href="/expert/classes/new">
            <ButtonPrimary variant="solid" size="md">
              <Plus className="size-4" />
              Add Class
            </ButtonPrimary>
          </Link>
        </div>

        {/* Classes Grid - Responsive 6:6 (2 columns) */}
        {classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((classItem: Class) => (
              <ClassCard
                key={classItem._id}
                classItem={classItem}
                basePath="/expert/classes"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
            <p className="text-muted-foreground text-lg mb-2">
              No classes found
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              Get started by creating class
            </p>
            <Link href="/expert/classes/new">
              <ButtonPrimary variant="outline" size="sm">
                <Plus className="size-4" />
                Add Class
              </ButtonPrimary>
            </Link>
          </div>
        )}
      </div>
    </Protect>
  );
}
