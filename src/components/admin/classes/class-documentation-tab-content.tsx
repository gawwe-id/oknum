"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Trash2,
  Upload,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Format bytes to human readable format
const formatBytes = (bytes?: number): string => {
  if (!bytes) return "Unknown";
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

// Get file name from URL
const getFileName = (url: string, title?: string): string => {
  if (title) return title;
  const urlParts = url.split("/");
  const fileName = urlParts[urlParts.length - 1];
  return fileName.split("?")[0] || "Untitled";
};

export function ClassDocumentationTabContent() {
  const params = useParams();
  const classId = params.classId as Id<"classes">;

  const documentation = useQuery(api.documentation.getDocumentationByClassId, {
    classId,
  });
  const createDocumentation = useMutation(
    api.documentation.createDocumentation
  );
  const deleteDocumentation = useMutation(
    api.documentation.deleteDocumentation
  );
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getFileUrl = useMutation(api.files.getFileUrl);

  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Loading state
  if (documentation === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Please upload an image or video file");
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 50MB");
      return;
    }

    setIsUploading(true);
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

      // Step 5: Create documentation record
      await createDocumentation({
        classId,
        type: isImage ? "photo" : "video",
        url: fileUrl,
        title: file.name,
        fileSize: file.size,
        mimeType: file.type,
      });

      toast.success("File uploaded successfully");

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload file"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (docId: Id<"documentation">) => {
    if (!confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      await deleteDocumentation({ documentationId: docId });
      toast.success("File deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete file"
      );
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Documentation</h2>
      </div>

      {/* Upload Box */}
      <div
        className="border-2 border-dashed border-primary/50 rounded-lg p-8 cursor-pointer hover:border-primary/70 transition-colors"
        onClick={handleUploadClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          {isUploading ? (
            <>
              <Loader2 className="size-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="size-12 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Images and Videos (max 50MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Documentation List */}
      {documentation.length === 0 ? (
        <div className="py-12 text-center border rounded-lg">
          <p className="text-muted-foreground">
            No documentation uploaded yet. Click the upload area above to get
            started.
          </p>
        </div>
      ) : (
        <div className="border rounded-lg divide-y">
          {documentation.map((doc) => (
            <div
              key={doc._id}
              className="group relative p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Thumbnail */}
                <div className="shrink-0 w-16 h-16 rounded-md overflow-hidden border border-input bg-muted flex items-center justify-center relative">
                  {doc.type === "photo" ? (
                    <>
                      <img
                        src={doc.url}
                        alt={doc.title || "Photo"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const icon = parent.querySelector(".fallback-icon");
                            if (icon) icon.classList.remove("hidden");
                          }
                        }}
                      />
                      <ImageIcon className="size-6 text-muted-foreground absolute hidden fallback-icon" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Video className="size-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* File Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {getFileName(doc.url, doc.title)}
                  </p>
                </div>

                {/* File Size */}
                <div className="shrink-0 text-sm text-muted-foreground w-20 text-right">
                  {formatBytes(doc.fileSize)}
                </div>

                {/* Type Badge */}
                <div className="shrink-0">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                      doc.type === "photo"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    }`}
                  >
                    {doc.type === "photo" ? (
                      <ImageIcon className="size-3" />
                    ) : (
                      <Video className="size-3" />
                    )}
                    {doc.type === "photo" ? "Photo" : "Video"}
                  </span>
                </div>

                {/* Delete Button with Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(doc._id);
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete file</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
