"use client";

import { Protect } from "@clerk/nextjs";
import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ExpertDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.expertId as Id<"users">;
  const expert = useQuery(api.experts.getExpertByUserId, { userId });
  const user = useQuery(api.users.getUserProfile, { userId });
  const updateExpert = useMutation(api.experts.updateExpert);
  const createExpert = useMutation(api.experts.adminCreateExpert);

  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    expertId: "" as Id<"experts">,
    bio: "",
    profileImage: "",
    specialization: [] as string[],
    experience: "",
    rating: "",
    totalStudents: "",
    status: "active" as "active" | "inactive",
  });

  const [specializationInput, setSpecializationInput] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Load expert data when available
  React.useEffect(() => {
    if (expert) {
      setFormData({
        expertId: expert?._id as Id<"experts">,
        bio: expert.bio || "",
        profileImage: expert.profileImage || "",
        specialization: expert.specialization || [],
        experience: expert.experience || "",
        rating: expert.rating?.toString() || "",
        totalStudents: expert.totalStudents?.toString() || "",
        status: expert.status || "active",
      });
    }
  }, [expert]);

  const handleAddSpecialization = () => {
    if (specializationInput.trim()) {
      setFormData({
        ...formData,
        specialization: [
          ...formData.specialization,
          specializationInput.trim(),
        ],
      });
      setSpecializationInput("");
    }
  };

  const handleRemoveSpecialization = (index: number) => {
    setFormData({
      ...formData,
      specialization: formData.specialization.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.bio.trim()) newErrors.bio = "Bio is required";
    if (formData.specialization.length === 0)
      newErrors.specialization = "At least one specialization is required";
    if (!formData.experience.trim())
      newErrors.experience = "Experience is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // If expert doesn't exist, create new one
      if (!expert) {
        if (!user) {
          throw new Error("User not found");
        }

        await createExpert({
          userId,
          name: user.name,
          email: user.email,
          bio: formData.bio.trim(),
          profileImage: formData.profileImage.trim() || undefined,
          specialization: formData.specialization,
          experience: formData.experience.trim(),
        });

        toast.success("Expert created successfully");
        // Refresh page to load the new expert data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        // Update existing expert
        await updateExpert({
          expertId: formData.expertId,
          bio: formData.bio.trim(),
          profileImage: formData.profileImage.trim() || undefined,
          specialization: formData.specialization,
          experience: formData.experience.trim(),
          rating: formData.rating ? parseFloat(formData.rating) : undefined,
          totalStudents: formData.totalStudents
            ? parseInt(formData.totalStudents)
            : undefined,
          status: formData.status,
        });

        toast.success("Expert updated successfully");
      }
    } catch (error) {
      console.error("Error saving expert:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save expert"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (expert === undefined) {
    return (
      <Protect>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </Protect>
    );
  }

  return (
    <Protect>
      <div className="space-y-6">
        {/* Header */}

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <Avatar>
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>
              {user?.name?.split(" ")[0]?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">{user?.name}</h1>
              <p className="text-muted-foreground mt-1">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {expert ? "Expert Information" : "Create Expert Profile"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bio */}
              <Field>
                <FieldLabel>Bio *</FieldLabel>
                <FieldContent>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Expert biography"
                    rows={4}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading}
                  />
                  <FieldError>{errors.bio}</FieldError>
                </FieldContent>
              </Field>

              {/* Specialization */}
              <Field>
                <FieldLabel>Specialization *</FieldLabel>
                <FieldContent>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={specializationInput}
                        onChange={(e) => setSpecializationInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSpecialization();
                          }
                        }}
                        placeholder="Add specialization"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddSpecialization}
                        disabled={isLoading || !specializationInput.trim()}
                      >
                        Add
                      </Button>
                    </div>
                    {formData.specialization.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.specialization.map((spec, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                          >
                            {spec}
                            <button
                              type="button"
                              onClick={() => handleRemoveSpecialization(index)}
                              className="hover:text-destructive"
                              disabled={isLoading}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <FieldError>{errors.specialization}</FieldError>
                  </div>
                </FieldContent>
              </Field>

              {/* Experience */}
              <Field>
                <FieldLabel>Experience *</FieldLabel>
                <FieldContent>
                  <textarea
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    placeholder="Expert experience"
                    rows={3}
                    className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading}
                  />
                  <FieldError>{errors.experience}</FieldError>
                </FieldContent>
              </Field>

              {/* Rating, Total Students, and Status */}
              <div className="grid grid-cols-1">
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <FieldContent>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as "active" | "inactive",
                        })
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isLoading}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </FieldContent>
                </Field>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <ButtonPrimary type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {expert ? "Updating..." : "Creating..."}
                    </>
                  ) : expert ? (
                    "Update Expert"
                  ) : (
                    "Create Expert"
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
