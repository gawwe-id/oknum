"use client";

import * as React from "react";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ButtonPrimary } from "@/components/ui/button-primary";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DialogAddClassProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DialogAddClass({ open, onOpenChange }: DialogAddClassProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const createClass = useMutation(api.classes.adminCreateClass);
  const experts = useQuery(api.experts.getActiveExperts) || [];

  // Form state
  const [formData, setFormData] = React.useState({
    expertId: "" as Id<"experts"> | "",
    title: "",
    description: "",
    category: "",
    price: "",
    currency: "IDR",
    type: "online" as "offline" | "online" | "hybrid",
    maxStudents: "",
    minStudents: "",
    duration: "",
    status: "draft" as "draft" | "published" | "completed" | "cancelled",
    thumbnail: "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.expertId) newErrors.expertId = "Expert is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      newErrors.duration = "Valid duration is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      await createClass({
        expertId: formData.expertId as Id<"experts">,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        price: parseFloat(formData.price),
        currency: formData.currency.trim(),
        type: formData.type,
        maxStudents: formData.maxStudents
          ? parseInt(formData.maxStudents)
          : undefined,
        minStudents: formData.minStudents
          ? parseInt(formData.minStudents)
          : undefined,
        duration: parseInt(formData.duration),
        thumbnail: formData.thumbnail.trim() || undefined,
        status: formData.status,
      });

      toast.success("Class created successfully");

      // Reset form
      setFormData({
        expertId: "" as Id<"experts"> | "",
        title: "",
        description: "",
        category: "",
        price: "",
        currency: "IDR",
        type: "online",
        maxStudents: "",
        minStudents: "",
        duration: "",
        status: "draft",
        thumbnail: "",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error creating class:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create class"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>
            Create a new class and assign it to an expert.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Expert Selection - Full width */}
          <Field>
            <FieldLabel>Expert *</FieldLabel>
            <FieldContent>
              <select
                value={formData.expertId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expertId: e.target.value as Id<"experts">,
                  })
                }
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              >
                <option value="">Select an expert...</option>
                {experts.map((expert) => (
                  <option key={expert._id} value={expert._id}>
                    {expert.name} ({expert.email})
                  </option>
                ))}
              </select>
              <FieldError>{errors.expertId}</FieldError>
            </FieldContent>
          </Field>

          {/* Title and Status */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Title *</FieldLabel>
              <FieldContent>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter class title"
                  disabled={isLoading}
                />
                <FieldError>{errors.title}</FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <FieldContent>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as
                        | "draft"
                        | "published"
                        | "completed"
                        | "cancelled",
                    })
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </FieldContent>
            </Field>
          </div>

          {/* Description */}
          <Field>
            <FieldLabel>Description *</FieldLabel>
            <FieldContent>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter class description"
                rows={4}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              />
              <FieldError>{errors.description}</FieldError>
            </FieldContent>
          </Field>

          {/* Category and Type */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Category *</FieldLabel>
              <FieldContent>
                <Input
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g. Programming"
                  disabled={isLoading}
                />
                <FieldError>{errors.category}</FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Type</FieldLabel>
              <FieldContent>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as "offline" | "online" | "hybrid",
                    })
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </FieldContent>
            </Field>
          </div>

          {/* Price and Currency */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Price *</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="0.00"
                  disabled={isLoading}
                />
                <FieldError>{errors.price}</FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Currency</FieldLabel>
              <FieldContent>
                <Input
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  placeholder="IDR"
                  disabled={isLoading}
                />
              </FieldContent>
            </Field>
          </div>

          {/* Duration and Thumbnail */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Duration (sessions) *</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="10"
                  disabled={isLoading}
                />
                <FieldError>{errors.duration}</FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Thumbnail URL</FieldLabel>
              <FieldContent>
                <Input
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnail: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  disabled={isLoading}
                />
              </FieldContent>
            </Field>
          </div>

          {/* Min/Max Students */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Min Students</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  min="0"
                  value={formData.minStudents}
                  onChange={(e) =>
                    setFormData({ ...formData, minStudents: e.target.value })
                  }
                  placeholder="Optional"
                  disabled={isLoading}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Max Students</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  min="1"
                  value={formData.maxStudents}
                  onChange={(e) =>
                    setFormData({ ...formData, maxStudents: e.target.value })
                  }
                  placeholder="Optional"
                  disabled={isLoading}
                />
              </FieldContent>
            </Field>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <ButtonPrimary type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Class"
              )}
            </ButtonPrimary>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
