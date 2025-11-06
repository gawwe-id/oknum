"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ClassCurriculumTabContentProps {
  classData: any;
}

export function ClassCurriculumTabContent({
  classData,
}: ClassCurriculumTabContentProps) {
  if (!classData.curriculum) {
    return (
      <Card className="shadow-none">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            No curriculum information available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Learning Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          {classData.curriculum.learningObjectives &&
          classData.curriculum.learningObjectives.length > 0 ? (
            <ul className="list-disc list-inside space-y-2">
              {classData.curriculum.learningObjectives.map(
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
          {classData.curriculum.modules &&
          classData.curriculum.modules.length > 0 ? (
            <div className="space-y-6">
              {classData.curriculum.modules
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
                          {module.topics.map((topic: string, topicIndex: number) => (
                            <li key={topicIndex}>{topic}</li>
                          ))}
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

      {classData.curriculum.prerequisites &&
        classData.curriculum.prerequisites.length > 0 && (
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Prerequisites</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {classData.curriculum.prerequisites.map(
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

      {classData.curriculum.materials &&
        classData.curriculum.materials.length > 0 && (
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {classData.curriculum.materials.map(
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
  );
}

