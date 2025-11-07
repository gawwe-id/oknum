"use client";

import * as React from "react";
import { useMutation } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "../../../../convex/_generated/api";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ClassDetailTabContentProps {
  classData: any;
}

export function ClassDetailTabContent({
  classData,
}: ClassDetailTabContentProps) {
  const updateClass = useMutation(api.classes.updateClass);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getFileUrl = useMutation(api.files.getFileUrl);

  const [isUploading, setIsUploading] = React.useState(false);
  const [thumbnailPreview, setThumbnailPreview] = React.useState<string>("");
  const [thumbnailFile, setThumbnailFile] = React.useState<File | null>(null);

  const initials = classData.expert?.name
    ? classData.expert.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "E";

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

  const handleUpdateThumbnail = async () => {
    if (!thumbnailFile) return;

    setIsUploading(true);
    try {
      const thumbnailUrl = await uploadThumbnail(thumbnailFile);

      await updateClass({
        classId: classData._id,
        thumbnail: thumbnailUrl,
      });

      toast.success("Thumbnail updated successfully");
      setThumbnailFile(null);
      setThumbnailPreview("");
      // Refresh will happen automatically via query
    } catch (error) {
      console.error("Error updating thumbnail:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update thumbnail. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveThumbnail = async () => {
    try {
      await updateClass({
        classId: classData._id,
        thumbnail: undefined,
      });

      toast.success("Thumbnail removed successfully");
      setThumbnailFile(null);
      setThumbnailPreview("");
    } catch (error) {
      console.error("Error removing thumbnail:", error);
      toast.error("Failed to remove thumbnail. Please try again.");
    }
  };

  const handleCancelUpdate = () => {
    setThumbnailFile(null);
    setThumbnailPreview("");
  };

  return (
    <div className="space-y-6">
      {/* Thumbnail Card */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Thumbnail / Banner</CardTitle>
        </CardHeader>
        <CardContent>
          {thumbnailPreview ? (
            <div className="space-y-4">
              <div className="relative w-full">
                <div className="relative aspect-video w-full overflow-hidden rounded-md border border-input">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleUpdateThumbnail}
                  disabled={isUploading}
                  size="sm"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="size-4 mr-2" />
                      Update Thumbnail
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelUpdate}
                  disabled={isUploading}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : classData.thumbnail ? (
            <div className="space-y-4">
              <div className="relative w-full">
                <div className="relative aspect-video w-full overflow-hidden rounded-md border border-input">
                  <img
                    src={classData.thumbnail}
                    alt={classData.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="thumbnail-upload"
                  className={`flex items-center justify-center px-4 py-2 text-sm border border-input rounded-md cursor-pointer bg-background hover:bg-accent/50 transition-colors ${
                    isUploading ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  <Upload className="size-4 mr-2" />
                  Replace Thumbnail
                  <input
                    id="thumbnail-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    disabled={isUploading}
                  />
                </label>
                <Button
                  variant="outline"
                  onClick={handleRemoveThumbnail}
                  disabled={isUploading}
                  size="sm"
                >
                  <X className="size-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label
                htmlFor="thumbnail-upload-empty"
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-input rounded-lg cursor-pointer bg-background hover:bg-accent/50 transition-colors ${
                  isUploading ? "cursor-not-allowed opacity-50" : ""
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
                  id="thumbnail-upload-empty"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  disabled={isUploading}
                />
              </label>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Title</p>
              <p className="font-medium">{classData.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <Badge variant="outline">{classData.category}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <Badge variant="outline" className="capitalize">
                {classData.type}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                variant="outline"
                className={cn(
                  "capitalize",
                  classData.status === "published" &&
                    "bg-emerald-600 text-white",
                  classData.status === "draft" && "bg-gray-500 text-white",
                  classData.status === "completed" && "bg-blue-600 text-white",
                  classData.status === "cancelled" && "bg-red-600 text-white"
                )}
              >
                {classData.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-semibold text-lg">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: classData.currency || "IDR",
                }).format(classData.price)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">
                {classData.duration}{" "}
                {classData.duration === 1 ? "session" : "sessions"}
              </p>
            </div>
            {(classData.minStudents || classData.maxStudents) && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Student Capacity
                </p>
                <p className="font-medium">
                  {classData.minStudents || 0} - {classData.maxStudents || "∞"}{" "}
                  students
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {classData.description}
          </p>
        </CardContent>
      </Card>

      {/* Expert Information */}
      {classData.expert && (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Expert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="size-12">
                <AvatarImage src={classData.expert.profileImage} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{classData.expert.name}</p>
                <p className="text-sm text-muted-foreground">
                  {classData.expert.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
