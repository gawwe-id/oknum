"use client";

import * as React from "react";
import { useParams, usePathname } from "next/navigation";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";

export function ClassCurriculumTabContent() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const classId = params.classId as Id<"classes">;

  const classData = useQuery(api.classes.getClassById, { classId });
  const curriculum = useQuery(api.curriculum.getCurriculumsByClass, {
    classId,
  });
  const currentUser = useQuery(api.users.getCurrentUserQuery);

  const handleAddCurriculum = () => {
    // Determine base path from current pathname or user role
    const isExpertRoute = pathname?.includes("/expert/");
    const isAdminRoute = pathname?.includes("/admin/");

    // Use pathname first, fallback to user role
    let basePath = "/admin";
    if (isExpertRoute) {
      basePath = "/expert";
    } else if (isAdminRoute) {
      basePath = "/admin";
    } else if (currentUser?.role === "expert") {
      basePath = "/expert";
    } else if (currentUser?.role === "admin") {
      basePath = "/admin";
    }

    router.push(`${basePath}/classes/${classId}/curriculum`);
  };

  // Loading state
  if (classData === undefined || curriculum === undefined) {
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

  if (!curriculum) {
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Curriculum</h2>
          <ButtonPrimary onClick={handleAddCurriculum}>
            <Plus className="size-4" />
            Add Curriculum
          </ButtonPrimary>
        </div>
        <Card className="shadow-none">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No curriculum information available
            </p>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Curriculum</h2>
        <ButtonPrimary onClick={handleAddCurriculum}>
          <Plus className="size-4" />
          {curriculum ? "Edit Curriculum" : "Add Curriculum"}
        </ButtonPrimary>
      </div>
      <div className="space-y-6">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Learning Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            {curriculum.learningObjectives &&
            curriculum.learningObjectives.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {curriculum.learningObjectives.map(
                  (objective: string, index: number) => (
                    <li key={index} className="text-muted-foreground">
                      {objective}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                No learning objectives defined
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Modules</CardTitle>
          </CardHeader>
          <CardContent>
            {curriculum.modules && curriculum.modules.length > 0 ? (
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
                        <Badge variant="outline">{module.duration} min</Badge>
                      </div>
                      {module.topics && module.topics.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Topics:</p>
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
            ) : (
              <p className="text-muted-foreground">No modules defined</p>
            )}
          </CardContent>
        </Card>

        {curriculum.prerequisites && curriculum.prerequisites.length > 0 && (
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

        {curriculum.materials && curriculum.materials.length > 0 && (
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {curriculum.materials.map((material: string, index: number) => (
                  <li key={index} className="text-muted-foreground">
                    {material}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
