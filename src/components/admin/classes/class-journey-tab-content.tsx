"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ButtonPrimary } from "@/components/ui/button-primary";
import {
  Plus,
  Loader2,
  Edit2,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface JourneyStep {
  order: number;
  title: string;
  description: string;
}

export function ClassJourneyTabContent() {
  const params = useParams();
  const classId = params.classId as Id<"classes">;

  const journey = useQuery(api.journey.getJourneyByClassId, { classId });
  const upsertJourney = useMutation(api.journey.upsertJourney);

  const [steps, setSteps] = React.useState<JourneyStep[]>([]);
  const [isCreating, setIsCreating] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [newStep, setNewStep] = React.useState({ title: "", description: "" });
  const [editingStep, setEditingStep] = React.useState<JourneyStep | null>(
    null
  );

  // Sync steps with journey data
  React.useEffect(() => {
    if (journey?.steps) {
      // Sort by order
      const sortedSteps = [...journey.steps].sort((a, b) => a.order - b.order);
      setSteps(sortedSteps);
    } else {
      setSteps([]);
    }
  }, [journey]);

  // Loading state
  if (journey === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleSave = async (stepsToSave: JourneyStep[]) => {
    try {
      await upsertJourney({
        classId,
        steps: stepsToSave,
      });
      toast.success("Journey saved successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save journey"
      );
    }
  };

  const handleCreate = async () => {
    if (!newStep.title.trim() || !newStep.description.trim()) {
      toast.error("Please fill in both title and description");
      return;
    }

    const newSteps = [
      ...steps,
      {
        order: steps.length,
        title: newStep.title.trim(),
        description: newStep.description.trim(),
      },
    ];

    setSteps(newSteps);
    await handleSave(newSteps);
    setNewStep({ title: "", description: "" });
    setIsCreating(false);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingStep({ ...steps[index] });
  };

  const handleUpdate = async () => {
    if (
      !editingStep ||
      !editingStep.title.trim() ||
      !editingStep.description.trim() ||
      editingIndex === null
    ) {
      toast.error("Please fill in both title and description");
      return;
    }

    const newSteps = [...steps];
    newSteps[editingIndex] = {
      ...editingStep,
      title: editingStep.title.trim(),
      description: editingStep.description.trim(),
    };

    setSteps(newSteps);
    await handleSave(newSteps);
    setEditingIndex(null);
    setEditingStep(null);
  };

  const handleDelete = async (index: number) => {
    if (!confirm("Are you sure you want to delete this step?")) {
      return;
    }

    const newSteps = steps.filter((_, i) => i !== index);
    // Reorder remaining steps
    const reorderedSteps = newSteps.map((step, i) => ({
      ...step,
      order: i,
    }));

    setSteps(reorderedSteps);
    await handleSave(reorderedSteps);
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const newSteps = [...steps];
    [newSteps[index - 1], newSteps[index]] = [
      newSteps[index],
      newSteps[index - 1],
    ];
    // Reorder
    const reorderedSteps = newSteps.map((step, i) => ({
      ...step,
      order: i,
    }));

    setSteps(reorderedSteps);
    await handleSave(reorderedSteps);
  };

  const handleMoveDown = async (index: number) => {
    if (index === steps.length - 1) return;

    const newSteps = [...steps];
    [newSteps[index], newSteps[index + 1]] = [
      newSteps[index + 1],
      newSteps[index],
    ];
    // Reorder
    const reorderedSteps = newSteps.map((step, i) => ({
      ...step,
      order: i,
    }));

    setSteps(reorderedSteps);
    await handleSave(reorderedSteps);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Journey</h2>
        {!isCreating && (
          <ButtonPrimary
            onClick={() => {
              setIsCreating(true);
            }}
          >
            <Plus className="size-4" />
            Add Step
          </ButtonPrimary>
        )}
      </div>

      {/* Create Form */}
      {isCreating && (
        <div className="border-2 border-dashed border-primary/50 rounded-lg p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground shrink-0 w-8">
                {steps.length + 1}
              </span>
              <Input
                placeholder="Step title..."
                value={newStep.title}
                onChange={(e) =>
                  setNewStep({ ...newStep, title: e.target.value })
                }
                className="flex-1"
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter" && e.shiftKey === false) {
                    e.preventDefault();
                    if (newStep.title.trim() && newStep.description.trim()) {
                      handleCreate();
                    }
                  } else if (e.key === "Escape") {
                    setIsCreating(false);
                    setNewStep({ title: "", description: "" });
                  }
                }}
                autoFocus
              />
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-muted-foreground shrink-0 w-8"></span>
              <Textarea
                placeholder="Step description..."
                value={newStep.description}
                onChange={(e) =>
                  setNewStep({ ...newStep, description: e.target.value })
                }
                className="flex-1 min-h-[80px]"
                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    e.preventDefault();
                    if (newStep.title.trim() && newStep.description.trim()) {
                      handleCreate();
                    }
                  } else if (e.key === "Escape") {
                    setIsCreating(false);
                    setNewStep({ title: "", description: "" });
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCreate}
                disabled={!newStep.title.trim() || !newStep.description.trim()}
              >
                <Check className="size-4" />
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsCreating(false);
                  setNewStep({ title: "", description: "" });
                }}
              >
                <X className="size-4" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Journey Steps List */}
      {steps.length === 0 && !isCreating ? (
        <div className="py-12 text-center border rounded-lg">
          <p className="text-muted-foreground">
            No journey steps added yet. Click "Add Step" to get started.
          </p>
        </div>
      ) : (
        <div className="border rounded-lg divide-y">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative p-4 hover:bg-accent/50 transition-colors"
            >
              {editingIndex === index ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground shrink-0 w-8">
                      {index + 1}
                    </span>
                    <Input
                      value={editingStep?.title || step.title}
                      onChange={(e) =>
                        setEditingStep(
                          editingStep
                            ? { ...editingStep, title: e.target.value }
                            : null
                        )
                      }
                      className="flex-1"
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter" && e.shiftKey === false) {
                          e.preventDefault();
                          if (
                            editingStep?.title.trim() &&
                            editingStep?.description.trim()
                          ) {
                            handleUpdate();
                          }
                        } else if (e.key === "Escape") {
                          setEditingIndex(null);
                          setEditingStep(null);
                        }
                      }}
                      autoFocus
                    />
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-muted-foreground shrink-0 w-8"></span>
                    <Textarea
                      value={editingStep?.description || step.description}
                      onChange={(e) =>
                        setEditingStep(
                          editingStep
                            ? { ...editingStep, description: e.target.value }
                            : null
                        )
                      }
                      className="flex-1 min-h-[80px]"
                      onKeyDown={(
                        e: React.KeyboardEvent<HTMLTextAreaElement>
                      ) => {
                        if (e.key === "Enter" && e.ctrlKey) {
                          e.preventDefault();
                          if (
                            editingStep?.title.trim() &&
                            editingStep?.description.trim()
                          ) {
                            handleUpdate();
                          }
                        } else if (e.key === "Escape") {
                          setEditingIndex(null);
                          setEditingStep(null);
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleUpdate}
                      disabled={
                        !editingStep?.title.trim() ||
                        !editingStep?.description.trim()
                      }
                    >
                      <Check className="size-4" />
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingIndex(null);
                        setEditingStep(null);
                      }}
                    >
                      <X className="size-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                      >
                        <ChevronUp className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === steps.length - 1}
                      >
                        <ChevronDown className="size-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-base">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleStartEdit(index)}
                    >
                      <Edit2 className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
