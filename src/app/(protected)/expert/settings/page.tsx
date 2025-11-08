"use client";

import { Protect } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useQueryState, parseAsString } from "nuqs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Loader2, Upload, User, Trash2, AlertTriangle } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

type TabType = "profile" | "account";

function SettingsContent() {
  const currentUser = useQuery(api.users.getCurrentUserQuery);
  const expertData = useQuery(
    api.experts.getExpertByUserId,
    currentUser?._id ? { userId: currentUser._id } : "skip"
  );

  const [tab, setTab] = useQueryState(
    "tab",
    parseAsString.withDefault("profile")
  );

  // Validate and normalize tab value
  const activeTab: TabType = tab === "account" ? "account" : "profile";

  const updateUser = useMutation(api.users.updateUser);
  const updateExpert = useMutation(api.experts.updateExpert);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getFileUrl = useMutation(api.files.getFileUrl);

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser?.name || "",
      phone: currentUser?.phone || "",
      email: currentUser?.email || "",
    },
  });

  // Reset form when user data loads
  useEffect(() => {
    if (currentUser) {
      reset({
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        email: currentUser.email || "",
      });
    }
  }, [currentUser, reset]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (file: File): Promise<string> => {
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
      console.error("Error uploading avatar:", error);
      throw error;
    }
  };

  const handleUpdateAvatar = async () => {
    if (!avatarFile) return;

    setIsUploadingAvatar(true);
    try {
      const avatarUrl = await uploadAvatar(avatarFile);

      await updateUser({
        avatar: avatarUrl,
      });

      toast.success("Avatar updated successfully");
      setAvatarFile(null);
      setAvatarPreview("");
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update avatar. Please try again."
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCancelAvatarUpdate = () => {
    setAvatarFile(null);
    setAvatarPreview("");
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      // Update user data
      await updateUser({
        name: data.name,
        phone: data.phone || undefined,
      });

      // Update expert data if exists
      if (expertData && expertData._id) {
        await updateExpert({
          expertId: expertData._id,
          name: data.name,
          email: data.email,
        });
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = () => {
    // For now, redirect to Clerk's account management
    // In the future, you can implement a custom delete flow
    toast.info(
      "Account deletion should be handled through Clerk account management"
    );
    // You can also implement a custom delete mutation if needed
  };

  if (currentUser === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const displayAvatar = avatarPreview || currentUser?.avatar;
  const initials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setTab(value as TabType)}
      >
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
              value="account"
              className={cn(
                "rounded-none border-0 border-b-2 border-transparent px-4 py-3 -mb-[2px] data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground"
              )}
            >
              <AlertTriangle className="size-4 mr-2" />
              Account
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and avatar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Upload Section */}
              <div className="space-y-4">
                <Label>Avatar</Label>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="size-24 border-2 border-dashed border-input">
                      {displayAvatar ? (
                        <AvatarImage
                          src={displayAvatar}
                          alt={currentUser?.name}
                        />
                      ) : null}
                      <AvatarFallback className="text-lg">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 space-y-2">
                    {avatarPreview ? (
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={handleUpdateAvatar}
                          disabled={isUploadingAvatar}
                          size="sm"
                        >
                          {isUploadingAvatar ? (
                            <>
                              <Loader2 className="size-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="size-4 mr-2" />
                              Update Avatar
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancelAvatarUpdate}
                          disabled={isUploadingAvatar}
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="avatar-upload"
                        className={`inline-flex items-center justify-center px-4 py-2 text-sm border border-input rounded-md cursor-pointer bg-background hover:bg-accent/50 transition-colors ${
                          isUploadingAvatar
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                      >
                        <Upload className="size-4 mr-2" />
                        Upload Avatar
                        <input
                          id="avatar-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          disabled={isUploadingAvatar}
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Enter your email"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact support if you need to
                    update it.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Delete Account</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    className="gap-2"
                  >
                    <Trash2 className="size-4" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function ExpertSettingsPage() {
  return (
    <Protect>
      <Suspense
        fallback={
          <div className="container max-w-4xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          </div>
        }
      >
        <SettingsContent />
      </Suspense>
    </Protect>
  );
}
