"use client";

import { Protect } from "@clerk/nextjs";
import * as React from "react";
import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useQueryState, parseAsString } from "nuqs";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { ClassDetailTabs } from "@/components/admin/classes";

type ViewType =
  | "detail"
  | "curriculum"
  | "schedules"
  | "benefits"
  | "journey"
  | "documentation";

function ClassDetailHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/expert/classes")}
        className="gap-2"
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>
      <div className="flex-1">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}

function ClassDetailContent() {
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
  const currentUser = useQuery(api.users.getCurrentUserQuery);

  // Loading state
  if (classData === undefined || currentUser === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Not found state
  if (!classData || !currentUser) {
    return (
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
          <p className="text-muted-foreground text-lg">
            {!classData ? "Class not found" : "User not found"}
          </p>
        </div>
      </div>
    );
  }

  // Verify that the class belongs to the current expert
  if (
    currentUser.role === "expert" &&
    currentUser.expertId &&
    classData.expertId !== currentUser.expertId
  ) {
    return (
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
          <p className="text-muted-foreground text-lg">
            You don't have permission to view this class
          </p>
        </div>
      </div>
    );
  }

  return (
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
  );
}

export default function ExpertClassDetailPage() {
  return (
    <Protect>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <ClassDetailContent />
      </Suspense>
    </Protect>
  );
}
