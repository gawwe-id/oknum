'use client';

import * as React from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { ButtonPrimary } from '@/components/ui/button-primary';
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

type Category = 'technical' | 'billing' | 'general';

interface IssueFormProps {
  onSuccess?: () => void;
}

export function IssueForm({ onSuccess }: IssueFormProps) {
  const createIssue = useMutation(api.issues.createIssue);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getFileUrl = useMutation(api.files.getFileUrl);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    category: 'general' as Category
  });
  const [evidenceFiles, setEvidenceFiles] = React.useState<File[]>([]);
  const [evidencePreviews, setEvidencePreviews] = React.useState<string[]>([]);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, category: e.target.value as Category }));
  };

  const handleEvidenceSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const invalidFiles = files.filter(
      (file) => !file.type.startsWith('image/')
    );
    if (invalidFiles.length > 0) {
      toast.error('Please upload only image files');
      return;
    }

    // Validate file size (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      toast.error('Image size must be less than 5MB per file');
      return;
    }

    // Create previews
    const newPreviews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setEvidencePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setEvidenceFiles((prev) => [...prev, ...files]);
  };

  const removeEvidence = (index: number) => {
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
    setEvidencePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadEvidence = async (file: File): Promise<string> => {
    try {
      // Step 1: Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload file to Convex storage
      const uploadResult = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file
      });

      if (!uploadResult.ok) {
        const errorText = await uploadResult.text();
        throw new Error(`Failed to upload file: ${errorText}`);
      }

      // Step 3: Get storage ID from response
      const result = await uploadResult.json();
      const storageId = result.storageId || result;

      if (!storageId) {
        throw new Error('No storage ID returned from upload');
      }

      // Step 4: Get file URL from storage ID
      const fileUrl = await getFileUrl({ storageId });

      if (!fileUrl) {
        throw new Error('Failed to get file URL');
      }

      return fileUrl;
    } catch (error) {
      console.error('Error uploading evidence:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!formData.title.trim()) {
      setErrors({ title: 'Title is required' });
      return;
    }
    if (!formData.description.trim()) {
      setErrors({ description: 'Description is required' });
      return;
    }

    setIsSubmitting(true);
    setIsUploading(true);

    try {
      // Upload all evidence files
      const evidenceUrls: string[] = [];
      for (const file of evidenceFiles) {
        const url = await uploadEvidence(file);
        evidenceUrls.push(url);
      }

      // Create issue
      await createIssue({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        evidences: evidenceUrls
      });

      toast.success('Issue created successfully');

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'general'
      });
      setEvidenceFiles([]);
      setEvidencePreviews([]);

      onSuccess?.();
    } catch (error) {
      console.error('Error creating issue:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to create issue. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Field>
        <FieldLabel>Title *</FieldLabel>
        <FieldContent>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter issue title"
            aria-invalid={!!errors.title}
          />
          {errors.title && <FieldError>{errors.title}</FieldError>}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Category *</FieldLabel>
        <FieldContent>
          <select
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="general">General</option>
            <option value="technical">Technical</option>
            <option value="billing">Billing</option>
          </select>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Description *</FieldLabel>
        <FieldContent>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your issue in detail..."
            rows={6}
            aria-invalid={!!errors.description}
          />
          {errors.description && <FieldError>{errors.description}</FieldError>}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Evidence Images (Optional)</FieldLabel>
        <FieldContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <label
                htmlFor="evidence-upload"
                className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-md cursor-pointer hover:bg-accent transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span className="text-sm">Upload Images</span>
              </label>
              <input
                id="evidence-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleEvidenceSelect}
                className="hidden"
                disabled={isUploading || isSubmitting}
              />
            </div>

            {evidencePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {evidencePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-md overflow-hidden border">
                      <img
                        src={preview}
                        alt={`Evidence ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEvidence(index)}
                      className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={isUploading || isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FieldContent>
      </Field>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData({
              title: '',
              description: '',
              category: 'general'
            });
            setEvidenceFiles([]);
            setEvidencePreviews([]);
            setErrors({});
          }}
          disabled={isSubmitting || isUploading}
        >
          Reset
        </Button>
        <ButtonPrimary type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting || isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isUploading ? 'Uploading...' : 'Submitting...'}
            </>
          ) : (
            'Submit Issue'
          )}
        </ButtonPrimary>
      </div>
    </form>
  );
}
