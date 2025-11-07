"use client";

import * as React from "react";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { useRouter } from "next/navigation";
import { Protect } from "@clerk/nextjs";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ButtonPrimary } from "@/components/ui/button-primary";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function NewClassPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const createClass = useMutation(api.classes.adminCreateClass);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getFileUrl = useMutation(api.files.getFileUrl);
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

  const [thumbnailPreview, setThumbnailPreview] = React.useState<string>("");
  const [thumbnailFile, setThumbnailFile] = React.useState<File | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      // Store file for later upload
      setThumbnailFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setThumbnailPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailPreview("");
    setThumbnailFile(null);
    setFormData({ ...formData, thumbnail: "" });
  };

  const uploadThumbnail = async (file: File): Promise<string> => {
    try {
      // Step 1: Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload file to Convex storage
      const uploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResult.ok) {
        const errorText = await uploadResult.text();
        throw new Error(`Failed to upload file: ${errorText}`);
      }

      // Step 3: Get storage ID from response
      // Convex returns the storageId in the response
      const result = await uploadResult.json();
      const storageId = result.storageId || result;

      if (!storageId) {
        throw new Error("No storage ID returned from upload");
      }

      // Step 4: Get file URL from storage ID
      const fileUrl = await getFileUrl({ storageId });

      if (!fileUrl) {
        throw new Error("Failed to get file URL");
      }

      return fileUrl;
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      throw error;
    }
  };

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
      // Upload thumbnail if file is selected
      let thumbnailUrl: string | undefined = undefined;
      if (thumbnailFile) {
        setIsUploading(true);
        try {
          thumbnailUrl = await uploadThumbnail(thumbnailFile);
        } catch (uploadError) {
          console.error("Error uploading thumbnail:", uploadError);
          toast.error(
            uploadError instanceof Error
              ? uploadError.message
              : "Failed to upload thumbnail. Please try again."
          );
          setIsLoading(false);
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      // Create class with thumbnail URL
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
        thumbnail: thumbnailUrl || undefined,
        status: formData.status,
      });

      toast.success("Class created successfully");
      router.push("/admin/classes");
    } catch (error) {
      console.error("Error creating class:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create class"
      );
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  return (
    <Protect>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/classes")}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Add New Class</h1>
            <p className="text-muted-foreground mt-1">
              Create a new class and assign it to an expert.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thumbnail / Banner */}
          <Field>
            <FieldLabel>Thumbnail / Banner</FieldLabel>
            <FieldContent>
              {thumbnailPreview ? (
                <div className="space-y-2">
                  <div className="relative w-full">
                    <div className="relative aspect-video w-full overflow-hidden rounded-md border border-input">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveThumbnail}
                        className="absolute right-2 top-2 rounded-full bg-destructive/80 p-1.5 text-white shadow-sm transition-colors hover:bg-destructive"
                        disabled={isLoading || isUploading}
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  </div>
                  <label
                    htmlFor="thumbnail-upload-replace"
                    className={`flex items-center justify-center w-full py-2 text-sm border border-input rounded-md cursor-pointer bg-background hover:bg-accent/50 transition-colors ${
                      isLoading || isUploading
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                  >
                    <Upload className="size-4 mr-2" />
                    Replace Image
                    <input
                      id="thumbnail-upload-replace"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      disabled={isLoading || isUploading}
                    />
                  </label>
                </div>
              ) : (
                <label
                  htmlFor="thumbnail-upload"
                  className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-input rounded-lg cursor-pointer bg-background hover:bg-accent/50 transition-colors ${
                    isLoading || isUploading
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="size-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to 5MB
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 1920x1080px (16:9 ratio)
                    </p>
                  </div>
                  <input
                    id="thumbnail-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    disabled={isLoading || isUploading}
                  />
                </label>
              )}
            </FieldContent>
          </Field>

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
          <div className="grid grid-cols-12 gap-4">
            <Field className="col-span-8">
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

            <Field className="col-span-4">
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

          {/* Min/Max Students */}
          <div className="grid grid-cols-3 gap-4">
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

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <ButtonPrimary type="submit" disabled={isLoading || isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Uploading thumbnail...
                </>
              ) : isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Class"
              )}
            </ButtonPrimary>
          </div>
        </form>
      </div>
    </Protect>
  );
}
