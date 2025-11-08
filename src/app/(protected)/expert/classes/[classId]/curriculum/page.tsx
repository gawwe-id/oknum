"use client";

import { Protect } from "@clerk/nextjs";
import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { useMutation } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ButtonPrimary } from "@/components/ui/button-primary";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ExpertCurriculumPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.classId as Id<"classes">;

  const classData = useQuery(api.classes.getClassById, { classId });
  const curriculum = useQuery(api.curriculum.getCurriculumsByClass, {
    classId,
  });
  const currentUser = useQuery(api.users.getCurrentUserQuery);
  const upsertCurriculum = useMutation(api.curriculum.upsertCurriculum);

  const [isLoading, setIsLoading] = React.useState(false);

  // Form state
  const [learningObjectives, setLearningObjectives] = React.useState<string[]>(
    []
  );
  const [modules, setModules] = React.useState<
    Array<{
      order: number;
      title: string;
      description: string;
      duration: number;
      topics: string[];
    }>
  >([]);
  const [prerequisites, setPrerequisites] = React.useState<string[]>([]);
  const [materials, setMaterials] = React.useState<string[]>([]);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Initialize form when data loads
  React.useEffect(() => {
    if (curriculum !== undefined) {
      if (curriculum) {
        setLearningObjectives(
          curriculum.learningObjectives.length > 0
            ? curriculum.learningObjectives
            : [""]
        );
        setModules(
          curriculum.modules.length > 0
            ? curriculum.modules.sort((a: any, b: any) => a.order - b.order)
            : [
                {
                  order: 1,
                  title: "",
                  description: "",
                  duration: 0,
                  topics: [""],
                },
              ]
        );
        setPrerequisites(
          curriculum.prerequisites && curriculum.prerequisites.length > 0
            ? curriculum.prerequisites
            : [""]
        );
        setMaterials(
          curriculum.materials && curriculum.materials.length > 0
            ? curriculum.materials
            : [""]
        );
      } else {
        // Reset for create mode
        setLearningObjectives([""]);
        setModules([
          {
            order: 1,
            title: "",
            description: "",
            duration: 0,
            topics: [""],
          },
        ]);
        setPrerequisites([""]);
        setMaterials([""]);
      }
      setErrors({});
    }
  }, [curriculum]);

  // Helper functions for managing arrays
  const addLearningObjective = () => {
    setLearningObjectives([...learningObjectives, ""]);
  };

  const removeLearningObjective = (index: number) => {
    if (learningObjectives.length > 1) {
      setLearningObjectives(learningObjectives.filter((_, i) => i !== index));
    }
  };

  const updateLearningObjective = (index: number, value: string) => {
    const updated = [...learningObjectives];
    updated[index] = value;
    setLearningObjectives(updated);
  };

  const addModule = () => {
    const maxOrder =
      modules.length > 0 ? Math.max(...modules.map((m) => m.order)) : 0;
    setModules([
      ...modules,
      {
        order: maxOrder + 1,
        title: "",
        description: "",
        duration: 0,
        topics: [""],
      },
    ]);
  };

  const removeModule = (index: number) => {
    if (modules.length > 1) {
      const updated = modules.filter((_, i) => i !== index);
      // Reorder modules
      updated.forEach((module, i) => {
        module.order = i + 1;
      });
      setModules(updated);
    }
  };

  const updateModule = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updated = [...modules];
    updated[index] = { ...updated[index], [field]: value };
    setModules(updated);
  };

  const addModuleTopic = (moduleIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].topics = [...updated[moduleIndex].topics, ""];
    setModules(updated);
  };

  const removeModuleTopic = (moduleIndex: number, topicIndex: number) => {
    const updated = [...modules];
    if (updated[moduleIndex].topics.length > 1) {
      updated[moduleIndex].topics = updated[moduleIndex].topics.filter(
        (_, i) => i !== topicIndex
      );
      setModules(updated);
    }
  };

  const updateModuleTopic = (
    moduleIndex: number,
    topicIndex: number,
    value: string
  ) => {
    const updated = [...modules];
    updated[moduleIndex].topics[topicIndex] = value;
    setModules(updated);
  };

  const addPrerequisite = () => {
    setPrerequisites([...prerequisites, ""]);
  };

  const removePrerequisite = (index: number) => {
    if (prerequisites.length > 1) {
      setPrerequisites(prerequisites.filter((_, i) => i !== index));
    }
  };

  const updatePrerequisite = (index: number, value: string) => {
    const updated = [...prerequisites];
    updated[index] = value;
    setPrerequisites(updated);
  };

  const addMaterial = () => {
    setMaterials([...materials, ""]);
  };

  const removeMaterial = (index: number) => {
    if (materials.length > 1) {
      setMaterials(materials.filter((_, i) => i !== index));
    }
  };

  const updateMaterial = (index: number, value: string) => {
    const updated = [...materials];
    updated[index] = value;
    setMaterials(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};

    // Validate learning objectives
    const validLearningObjectives = learningObjectives
      .map((obj) => obj.trim())
      .filter((obj) => obj.length > 0);
    if (validLearningObjectives.length === 0) {
      newErrors.learningObjectives =
        "At least one learning objective is required";
    }

    // Validate modules
    const validModules = modules.filter(
      (module) =>
        module.title.trim().length > 0 &&
        module.description.trim().length > 0 &&
        module.duration > 0
    );
    if (validModules.length === 0) {
      newErrors.modules = "At least one module is required";
    }

    // Validate each module
    validModules.forEach((module, index) => {
      if (module.title.trim().length === 0) {
        newErrors[`module_${index}_title`] = "Module title is required";
      }
      if (module.description.trim().length === 0) {
        newErrors[`module_${index}_description`] =
          "Module description is required";
      }
      if (module.duration <= 0) {
        newErrors[`module_${index}_duration`] =
          "Module duration must be greater than 0";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);

      // Prepare modules with valid topics
      const preparedModules = validModules.map((module) => ({
        order: module.order,
        title: module.title.trim(),
        description: module.description.trim(),
        duration: module.duration,
        topics: module.topics
          .map((topic) => topic.trim())
          .filter((topic) => topic.length > 0),
      }));

      await upsertCurriculum({
        classId,
        modules: preparedModules,
        learningObjectives: validLearningObjectives,
        prerequisites:
          prerequisites.filter((p) => p.trim().length > 0).length > 0
            ? prerequisites.map((p) => p.trim()).filter((p) => p.length > 0)
            : undefined,
        materials:
          materials.filter((m) => m.trim().length > 0).length > 0
            ? materials.map((m) => m.trim()).filter((m) => m.length > 0)
            : undefined,
      });

      toast.success(
        curriculum
          ? "Curriculum updated successfully"
          : "Curriculum created successfully"
      );
      router.push(`/expert/classes/${classId}?view=curriculum`);
    } catch (error: any) {
      toast.error(error.message || "Failed to save curriculum");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (
    classData === undefined ||
    curriculum === undefined ||
    currentUser === undefined
  ) {
    return (
      <Protect>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </Protect>
    );
  }

  // Not found state
  if (!classData || !currentUser) {
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
            <p className="text-muted-foreground text-lg">
              {!classData ? "Class not found" : "User not found"}
            </p>
          </div>
        </div>
      </Protect>
    );
  }

  // Verify that the class belongs to the current expert
  if (
    currentUser.role === "expert" &&
    currentUser.expertId &&
    classData.expertId !== currentUser.expertId
  ) {
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
            <p className="text-muted-foreground text-lg">
              You don't have permission to edit this class curriculum
            </p>
          </div>
        </div>
      </Protect>
    );
  }

  return (
    <Protect>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                router.push(`/expert/classes/${classId}?view=curriculum`)
              }
              className="gap-2"
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                {curriculum ? "Edit Curriculum" : "Add Curriculum"}
              </h1>
              <p className="text-muted-foreground mt-1">{classData.title}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Curriculum Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Learning Objectives */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FieldLabel>
                    Learning Objectives <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLearningObjective}
                    disabled={isLoading}
                  >
                    <Plus className="size-4" />
                    Add Objective
                  </Button>
                </div>
                {learningObjectives.map((objective, index) => (
                  <Field key={index}>
                    <FieldContent>
                      <div className="flex gap-2">
                        <Input
                          value={objective}
                          onChange={(e) =>
                            updateLearningObjective(index, e.target.value)
                          }
                          placeholder="Enter learning objective"
                          disabled={isLoading}
                          className="flex-1"
                        />
                        {learningObjectives.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeLearningObjective(index)}
                            disabled={isLoading}
                          >
                            <X className="size-4" />
                          </Button>
                        )}
                      </div>
                    </FieldContent>
                  </Field>
                ))}
                {errors.learningObjectives && (
                  <p className="text-sm text-red-600">
                    {errors.learningObjectives}
                  </p>
                )}
              </div>

              {/* Modules */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FieldLabel>
                    Modules <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addModule}
                    disabled={isLoading}
                  >
                    <Plus className="size-4" />
                    Add Module
                  </Button>
                </div>
                {modules.map((module, moduleIndex) => (
                  <div
                    key={moduleIndex}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Module {module.order}</h4>
                      {modules.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeModule(moduleIndex)}
                          disabled={isLoading}
                        >
                          <X className="size-4" />
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>
                          Title <span className="text-red-500">*</span>
                        </FieldLabel>
                        <FieldContent>
                          <Input
                            value={module.title}
                            onChange={(e) =>
                              updateModule(moduleIndex, "title", e.target.value)
                            }
                            placeholder="Module title"
                            disabled={isLoading}
                          />
                          {errors[`module_${moduleIndex}_title`] && (
                            <FieldError>
                              {errors[`module_${moduleIndex}_title`]}
                            </FieldError>
                          )}
                        </FieldContent>
                      </Field>

                      <Field>
                        <FieldLabel>
                          Duration (minutes){" "}
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <FieldContent>
                          <Input
                            type="number"
                            min="1"
                            value={module.duration || ""}
                            onChange={(e) =>
                              updateModule(
                                moduleIndex,
                                "duration",
                                parseInt(e.target.value) || 0
                              )
                            }
                            placeholder="Duration"
                            disabled={isLoading}
                          />
                          {errors[`module_${moduleIndex}_duration`] && (
                            <FieldError>
                              {errors[`module_${moduleIndex}_duration`]}
                            </FieldError>
                          )}
                        </FieldContent>
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel>
                        Description <span className="text-red-500">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <textarea
                          value={module.description}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) =>
                            updateModule(
                              moduleIndex,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Module description"
                          disabled={isLoading}
                          rows={3}
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        {errors[`module_${moduleIndex}_description`] && (
                          <FieldError>
                            {errors[`module_${moduleIndex}_description`]}
                          </FieldError>
                        )}
                      </FieldContent>
                    </Field>

                    {/* Module Topics */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FieldLabel>Topics</FieldLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addModuleTopic(moduleIndex)}
                          disabled={isLoading}
                        >
                          <Plus className="size-4" />
                          Add Topic
                        </Button>
                      </div>
                      {module.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="flex gap-2">
                          <Input
                            value={topic}
                            onChange={(e) =>
                              updateModuleTopic(
                                moduleIndex,
                                topicIndex,
                                e.target.value
                              )
                            }
                            placeholder="Enter topic"
                            disabled={isLoading}
                            className="flex-1"
                          />
                          {module.topics.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                removeModuleTopic(moduleIndex, topicIndex)
                              }
                              disabled={isLoading}
                            >
                              <X className="size-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {errors.modules && (
                  <p className="text-sm text-red-600">{errors.modules}</p>
                )}
              </div>

              {/* Prerequisites */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FieldLabel>Prerequisites</FieldLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPrerequisite}
                    disabled={isLoading}
                  >
                    <Plus className="size-4" />
                    Add Prerequisite
                  </Button>
                </div>
                {prerequisites.map((prerequisite, index) => (
                  <Field key={index}>
                    <FieldContent>
                      <div className="flex gap-2">
                        <Input
                          value={prerequisite}
                          onChange={(e) =>
                            updatePrerequisite(index, e.target.value)
                          }
                          placeholder="Enter prerequisite"
                          disabled={isLoading}
                          className="flex-1"
                        />
                        {prerequisites.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removePrerequisite(index)}
                            disabled={isLoading}
                          >
                            <X className="size-4" />
                          </Button>
                        )}
                      </div>
                    </FieldContent>
                  </Field>
                ))}
              </div>

              {/* Materials */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FieldLabel>Materials</FieldLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMaterial}
                    disabled={isLoading}
                  >
                    <Plus className="size-4" />
                    Add Material
                  </Button>
                </div>
                {materials.map((material, index) => (
                  <Field key={index}>
                    <FieldContent>
                      <div className="flex gap-2">
                        <Input
                          value={material}
                          onChange={(e) =>
                            updateMaterial(index, e.target.value)
                          }
                          placeholder="Enter material"
                          disabled={isLoading}
                          className="flex-1"
                        />
                        {materials.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeMaterial(index)}
                            disabled={isLoading}
                          >
                            <X className="size-4" />
                          </Button>
                        )}
                      </div>
                    </FieldContent>
                  </Field>
                ))}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    router.push(`/expert/classes/${classId}?view=curriculum`)
                  }
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <ButtonPrimary type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {curriculum ? "Updating..." : "Creating..."}
                    </>
                  ) : curriculum ? (
                    "Update Curriculum"
                  ) : (
                    "Create Curriculum"
                  )}
                </ButtonPrimary>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Protect>
  );
}
