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
import { Loader2, ArrowLeft, Upload, User, Settings, X } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function ExpertDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.expertId as Id<"users">;
  const expert = useQuery(api.experts.getExpertByUserId, { userId });
  const user = useQuery(api.users.getUserProfile, { userId });
  const updateExpert = useMutation(api.experts.updateExpert);
  const createExpert = useMutation(api.experts.adminCreateExpert);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getFileUrl = useMutation(api.files.getFileUrl);

  const [activeTab, setActiveTab] = React.useState<"profile" | "settings">("profile");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isUploadingProfileImage, setIsUploadingProfileImage] = React.useState(false);
  const [profileImagePreview, setProfileImagePreview] = React.useState<string>("");
  const [profileImageFile, setProfileImageFile] = React.useState<File | null>(null);
  const [formData, setFormData] = React.useState({
    expertId: "" as Id<"experts">,
    name: "",
    email: "",
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

  // Reset to profile tab if expert doesn't exist and user tries to access settings
  React.useEffect(() => {
    if (!expert && activeTab === "settings") {
      setActiveTab("profile");
    }
  }, [expert, activeTab]);

  // Load expert data when available
  React.useEffect(() => {
    if (expert) {
      setFormData({
        expertId: expert?._id as Id<"experts">,
        name: expert.name || "",
        email: expert.email || "",
        bio: expert.bio || "",
        profileImage: expert.profileImage || "",
        specialization: expert.specialization || [],
        experience: expert.experience || "",
        rating: expert.rating?.toString() || "",
        totalStudents: expert.totalStudents?.toString() || "",
        status: expert.status || "active",
      });
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [expert, user]);

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

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setProfileImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfileImage = async (file: File): Promise<string> => {
    try {
      // Generate upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error("Failed to upload file");
      }

      const { storageId } = await result.json();

      // Get file URL
      const fileUrl = await getFileUrl({ storageId });

      if (!fileUrl) {
        throw new Error("Failed to get file URL");
      }

      return fileUrl as string;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      throw error;
    }
  };

  const handleUpdateProfileImage = async () => {
    if (!profileImageFile || !expert) return;

    setIsUploadingProfileImage(true);
    try {
      const profileImageUrl = await uploadProfileImage(profileImageFile);

      await updateExpert({
        expertId: expert._id,
        profileImage: profileImageUrl,
      });

      setFormData((prev) => ({
        ...prev,
        profileImage: profileImageUrl,
      }));

      toast.success("Profile image updated successfully");
      setProfileImageFile(null);
      setProfileImagePreview("");
    } catch (error) {
      console.error("Error updating profile image:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile image. Please try again."
      );
    } finally {
      setIsUploadingProfileImage(false);
    }
  };

  const handleCancelProfileImageUpdate = () => {
    setProfileImageFile(null);
    setProfileImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
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
          name: formData.name.trim() || user.name,
          email: formData.email.trim() || user.email,
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
          name: formData.name.trim(),
          email: formData.email.trim(),
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

  // Use profileImage from experts table, or preview if uploading
  const displayProfileImage =
    profileImagePreview || expert?.profileImage || user?.avatar || null;
  const initials = formData.name
    ? formData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.name
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "E";

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
            <AvatarImage src={displayProfileImage || undefined} alt={formData.name || user?.name} />
            <AvatarFallback>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">{formData.name || user?.name}</h1>
              <p className="text-muted-foreground mt-1">{formData.email || user?.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "profile" | "settings")}>
          <div className="w-full border-b">
            <TabsList className="w-fit justify-start h-auto p-0 bg-transparent border-0 rounded-none gap-0">
              <TabsTrigger
                value="profile"
                className={cn(
                  "rounded-none border-0 border-b-2 border-transparent px-4 py-3 -mb-[2px] data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground"
                )}
              >
                <User className="size-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className={cn(
                  "rounded-none border-0 border-b-2 border-transparent px-4 py-3 -mb-[2px] data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground",
                  !expert && "opacity-50 cursor-not-allowed"
                )}
                disabled={!expert}
              >
                <Settings className="size-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {expert ? "Expert Profile" : "Create Expert Profile"}
                </CardTitle>
                <CardDescription>
                  Update expert profile information and avatar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Image Upload Section */}
                <div className="space-y-4">
                  <Label>Profile Image</Label>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-32 overflow-hidden rounded-lg border-2 border-dashed border-input bg-muted flex items-center justify-center">
                        {displayProfileImage ? (
                          <img
                            src={displayProfileImage}
                            alt={formData.name || user?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-semibold text-muted-foreground">
                            {initials}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {profileImagePreview ? (
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={handleUpdateProfileImage}
                            disabled={isUploadingProfileImage || !expert}
                            size="sm"
                          >
                            {isUploadingProfileImage ? (
                              <>
                                <Loader2 className="size-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="size-4 mr-2" />
                                Update Profile Image
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleCancelProfileImageUpdate}
                            disabled={isUploadingProfileImage}
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <label
                          htmlFor="profile-image-upload"
                          className={`inline-flex items-center justify-center px-4 py-2 text-sm border border-input rounded-md cursor-pointer bg-background hover:bg-accent/50 transition-colors ${
                            isUploadingProfileImage || !expert
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          }`}
                        >
                          <Upload className="size-4 mr-2" />
                          Upload Profile Image
                          <input
                            id="profile-image-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            disabled={isUploadingProfileImage || !expert}
                          />
                        </label>
                      )}
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG or GIF. Max size 5MB
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <Field>
                    <FieldLabel>Name *</FieldLabel>
                    <FieldContent>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Expert name"
                        disabled={isLoading}
                      />
                      <FieldError>{errors.name}</FieldError>
                    </FieldContent>
                  </Field>

                  {/* Email */}
                  <Field>
                    <FieldLabel>Email *</FieldLabel>
                    <FieldContent>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="Expert email"
                        disabled={isLoading}
                      />
                      <FieldError>{errors.email}</FieldError>
                    </FieldContent>
                  </Field>

                  {/* Bio */}
                  <Field>
                    <FieldLabel>Bio *</FieldLabel>
                    <FieldContent>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        placeholder="Expert biography"
                        rows={4}
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
                              <Badge
                                key={index}
                                variant="secondary"
                                className="gap-1"
                              >
                                {spec}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSpecialization(index)}
                                  className="ml-1 hover:text-destructive"
                                  disabled={isLoading}
                                >
                                  <X className="size-3" />
                                </button>
                              </Badge>
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
                      <Textarea
                        value={formData.experience}
                        onChange={(e) =>
                          setFormData({ ...formData, experience: e.target.value })
                        }
                        placeholder="Expert experience"
                        rows={4}
                        disabled={isLoading}
                      />
                      <FieldError>{errors.experience}</FieldError>
                    </FieldContent>
                  </Field>

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
                        "Update Profile"
                      ) : (
                        "Create Expert"
                      )}
                    </ButtonPrimary>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Expert Settings</CardTitle>
                <CardDescription>
                  Manage expert status and additional information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Status */}
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
                        disabled={isLoading || !expert}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </FieldContent>
                  </Field>

                  {/* Rating */}
                  <Field>
                    <FieldLabel>Rating</FieldLabel>
                    <FieldContent>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={formData.rating}
                        onChange={(e) =>
                          setFormData({ ...formData, rating: e.target.value })
                        }
                        placeholder="Expert rating (0-5)"
                        disabled={isLoading || !expert}
                      />
                    </FieldContent>
                  </Field>

                  {/* Total Students */}
                  <Field>
                    <FieldLabel>Total Students</FieldLabel>
                    <FieldContent>
                      <Input
                        type="number"
                        min="0"
                        value={formData.totalStudents}
                        onChange={(e) =>
                          setFormData({ ...formData, totalStudents: e.target.value })
                        }
                        placeholder="Total students"
                        disabled={isLoading || !expert}
                      />
                    </FieldContent>
                  </Field>

                  {/* Form Actions */}
                  {expert && (
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
                            Updating...
                          </>
                        ) : (
                          "Update Settings"
                        )}
                      </ButtonPrimary>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Protect>
  );
}
