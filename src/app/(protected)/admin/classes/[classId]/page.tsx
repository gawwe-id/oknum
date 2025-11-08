"use client";

import { Protect } from "@clerk/nextjs";
import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useQueryState, parseAsString } from "nuqs";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { ClassDetailHeader, ClassDetailTabs } from "@/components/admin/classes";

type ViewType =
  | "detail"
  | "curriculum"
  | "schedules"
  | "benefits"
  | "journey"
  | "documentation";

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.classId as Id<"classes">;

  const [viewParam, setViewParam] = useQueryState(
    "view",
    parseAsString.withDefault("detail")
  );

  // Validate and normalize view value
  const view: ViewType =
    viewParam === "curriculum" ||
    viewParam === "schedules" ||
    viewParam === "benefits" ||
    viewParam === "journey" ||
    viewParam === "documentation"
      ? (viewParam as ViewType)
      : "detail";

  const setView = (value: ViewType) => {
    setViewParam(value);
  };

  const classData = useQuery(api.classes.getClassById, { classId });

  // Loading state
  if (classData === undefined) {
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

  return (
    <Protect>
      <div className="space-y-6">
        <ClassDetailHeader
          title={classData.title}
          description={classData.description}
        />
        <ClassDetailTabs
          view={view}
          onViewChange={setView}
          classData={classData}
        />
      </div>
    </Protect>
  );
}
