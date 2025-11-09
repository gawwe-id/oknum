'use client';

import * as React from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { ButtonPrimary } from '@/components/ui/button-primary';
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError
} from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface IssueReplyFormProps {
  issueId: Id<'issues'>;
  onSuccess?: () => void;
}

export function IssueReplyForm({ issueId, onSuccess }: IssueReplyFormProps) {
  const createIssueReply = useMutation(api.issues.createIssueReply);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getFileUrl = useMutation(api.files.getFileUrl);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [attachmentFiles, setAttachmentFiles] = React.useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = React.useState<string[]>(
    []
  );
  const [error, setError] = React.useState('');

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (error) setError('');
  };

  const handleAttachmentSelect = async (
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
          setAttachmentPreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setAttachmentFiles((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachmentFiles((prev) => prev.filter((_, i) => i !== index));
    setAttachmentPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadAttachment = async (file: File): Promise<string> => {
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
      console.error('Error uploading attachment:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setError('Message is required');
      return;
    }

    setIsSubmitting(true);
    setIsUploading(true);

    try {
      // Upload all attachment files
      const attachmentUrls: string[] = [];
      for (const file of attachmentFiles) {
        const url = await uploadAttachment(file);
        attachmentUrls.push(url);
      }

      // Create reply
      await createIssueReply({
        issueId,
        message: message.trim(),
        attachments: attachmentUrls.length > 0 ? attachmentUrls : undefined
      });

      toast.success('Reply sent successfully');

      // Reset form
      setMessage('');
      setAttachmentFiles([]);
      setAttachmentPreviews([]);
      setError('');

      onSuccess?.();
    } catch (error) {
      console.error('Error creating reply:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to send reply. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field>
        <FieldLabel>Message *</FieldLabel>
        <FieldContent>
          <Textarea
            value={message}
            onChange={handleMessageChange}
            placeholder="Type your reply..."
            rows={4}
            aria-invalid={!!error}
          />
          {error && <FieldError>{error}</FieldError>}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Attachments (Optional)</FieldLabel>
        <FieldContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <label
                htmlFor="attachment-upload"
                className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-md cursor-pointer hover:bg-accent transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span className="text-sm">Upload Images</span>
              </label>
              <input
                id="attachment-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleAttachmentSelect}
                className="hidden"
                disabled={isUploading || isSubmitting}
              />
            </div>

            {attachmentPreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {attachmentPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-md overflow-hidden border">
                      <img
                        src={preview}
                        alt={`Attachment ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
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
            setMessage('');
            setAttachmentFiles([]);
            setAttachmentPreviews([]);
            setError('');
          }}
          disabled={isSubmitting || isUploading}
        >
          Reset
        </Button>
        <ButtonPrimary type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting || isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isUploading ? 'Uploading...' : 'Sending...'}
            </>
          ) : (
            'Send Reply'
          )}
        </ButtonPrimary>
      </div>
    </form>
  );
}
