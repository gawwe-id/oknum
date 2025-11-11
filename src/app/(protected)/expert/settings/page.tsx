'use client';

import { Protect } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { useQueryState, parseAsString } from 'nuqs';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Loader2, Upload, User, Trash2, AlertTriangle, X } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  specialization: z
    .array(z.string())
    .min(1, 'At least one specialization is required'),
  experience: z.string().min(10, 'Experience must be at least 10 characters')
});

type ProfileFormData = z.infer<typeof profileSchema>;

type TabType = 'profile' | 'account';

function SettingsContent() {
  const currentUser = useQuery(api.users.getCurrentUserQuery);
  const expertData = useQuery(
    api.experts.getExpertByUserId,
    currentUser?._id ? { userId: currentUser._id } : 'skip'
  );

  const [tab, setTab] = useQueryState(
    'tab',
    parseAsString.withDefault('profile')
  );

  // Validate and normalize tab value
  const activeTab: TabType = tab === 'account' ? 'account' : 'profile';

  const updateExpert = useMutation(api.experts.updateExpert);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getFileUrl = useMutation(api.files.getFileUrl);

  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specializationInput, setSpecializationInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: expertData?.name || '',
      email: expertData?.email || '',
      bio: expertData?.bio || '',
      specialization: expertData?.specialization || [],
      experience: expertData?.experience || ''
    }
  });

  const specialization = watch('specialization');

  // Reset form when expert data loads
  useEffect(() => {
    if (expertData) {
      reset({
        name: expertData.name || '',
        email: expertData.email || '',
        bio: expertData.bio || '',
        specialization: expertData.specialization || [],
        experience: expertData.experience || ''
      });
    }
  }, [expertData, reset]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
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
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file
      });

      if (!result.ok) {
        throw new Error('Failed to upload file');
      }

      const { storageId } = await result.json();

      // Get file URL
      const fileUrl = await getFileUrl({ storageId });

      if (!fileUrl) {
        throw new Error('Failed to get file URL');
      }

      return fileUrl as string;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  };

  const handleUpdateProfileImage = async () => {
    if (!profileImageFile || !expertData) return;

    setIsUploadingProfileImage(true);
    try {
      const profileImageUrl = await uploadProfileImage(profileImageFile);

      await updateExpert({
        expertId: expertData._id,
        profileImage: profileImageUrl
      });

      toast.success('Profile image updated successfully');
      setProfileImageFile(null);
      setProfileImagePreview('');
    } catch (error) {
      console.error('Error updating profile image:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update profile image. Please try again.'
      );
    } finally {
      setIsUploadingProfileImage(false);
    }
  };

  const handleCancelProfileImageUpdate = () => {
    setProfileImageFile(null);
    setProfileImagePreview('');
  };

  const handleAddSpecialization = () => {
    if (specializationInput.trim()) {
      const currentSpecialization = watch('specialization') || [];
      setValue(
        'specialization',
        [...currentSpecialization, specializationInput.trim()],
        {
          shouldValidate: true
        }
      );
      setSpecializationInput('');
    }
  };

  const handleRemoveSpecialization = (index: number) => {
    const currentSpecialization = watch('specialization') || [];
    setValue(
      'specialization',
      currentSpecialization.filter((_, i) => i !== index),
      {
        shouldValidate: true
      }
    );
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!expertData || !expertData._id) {
      toast.error('Expert profile not found');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateExpert({
        expertId: expertData._id,
        name: data.name,
        email: data.email,
        bio: data.bio,
        specialization: data.specialization,
        experience: data.experience
      });

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update profile. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = () => {
    // For now, redirect to Clerk's account management
    // In the future, you can implement a custom delete flow
    toast.info(
      'Account deletion should be handled through Clerk account management'
    );
    // You can also implement a custom delete mutation if needed
  };

  if (currentUser === undefined || expertData === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!expertData) {
    return (
      <div className="container max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Expert profile not found. Please contact support.
          </p>
        </div>
      </div>
    );
  }

  // Use profileImage from experts table, or preview if uploading
  const displayProfileImage =
    profileImagePreview || expertData?.profileImage || null;
  const initials = expertData?.name
    ? expertData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'E';

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
                'rounded-none border-0 border-b-2 border-transparent px-4 py-3 -mb-[2px] data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground'
              )}
            >
              <User className="size-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className={cn(
                'rounded-none border-0 border-b-2 border-transparent px-4 py-3 -mb-[2px] data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground'
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
              {/* Profile Image Upload Section */}
              <div className="space-y-4">
                <Label>Profile Image</Label>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-32 overflow-hidden rounded-lg border-2 border-dashed border-input bg-muted flex items-center justify-center">
                      {displayProfileImage ? (
                        <img
                          src={displayProfileImage}
                          alt={expertData?.name}
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
                          disabled={isUploadingProfileImage}
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
                          isUploadingProfileImage
                            ? 'cursor-not-allowed opacity-50'
                            : ''
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
                          disabled={isUploadingProfileImage}
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
                    {...register('name')}
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
                    {...register('email')}
                    placeholder="Enter your email"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact support if you need to
                    update it.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">
                    Bio <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="bio"
                    {...register('bio')}
                    placeholder="Tell us about yourself and your expertise..."
                    rows={4}
                  />
                  {errors.bio && (
                    <p className="text-sm text-destructive">
                      {errors.bio.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">
                    Specialization <span className="text-destructive">*</span>
                  </Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        id="specialization"
                        value={specializationInput}
                        onChange={(e) => setSpecializationInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSpecialization();
                          }
                        }}
                        placeholder="Add specialization"
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddSpecialization}
                        disabled={isSubmitting || !specializationInput.trim()}
                      >
                        Add
                      </Button>
                    </div>
                    {specialization && specialization.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {specialization.map((item, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="gap-1"
                          >
                            {item}
                            <button
                              type="button"
                              onClick={() => handleRemoveSpecialization(index)}
                              className="ml-1 hover:text-destructive"
                              disabled={isSubmitting}
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.specialization && (
                    <p className="text-sm text-destructive">
                      {errors.specialization.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">
                    Experience <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="experience"
                    {...register('experience')}
                    placeholder="Describe your professional experience..."
                    rows={4}
                  />
                  {errors.experience && (
                    <p className="text-sm text-destructive">
                      {errors.experience.message}
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
                      'Save Changes'
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
