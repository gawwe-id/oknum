"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Consultant = {
  _id: Id<"consultants">;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  includes: string[];
  technologies: string[];
  illustration?: string;
  status: "active" | "inactive";
  order: number;
  createdAt: number;
  updatedAt: number;
};

type ConsultantRequestFormProps = {
  consultant: Consultant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export function ConsultantRequestForm({
  consultant,
  open,
  onOpenChange,
  onSuccess,
}: ConsultantRequestFormProps) {
  const createRequest = useMutation(api.consultants.createConsultantRequest);
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error(
        "Please provide a message describing your consultation needs"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await createRequest({
        consultantId: consultant._id,
        message: message.trim(),
        phone: phone.trim() || undefined,
      });
      setMessage("");
      setPhone("");
      toast.success("Consultation request submitted successfully!");
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit consultation request"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request Consultation: {consultant.title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Consultant Info */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <h3 className="font-semibold text-sm">{consultant.subtitle}</h3>
            <p className="text-sm text-muted-foreground">
              {consultant.description}
            </p>
          </div>

          {/* Phone Number */}
          <Field>
            <FieldLabel>Phone Number</FieldLabel>
            <FieldContent>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., +62 812-822-7597"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Optional: Provide your phone number for easier contact
              </p>
            </FieldContent>
          </Field>

          {/* Message */}
          <Field>
            <FieldLabel>
              Your Message <span className="text-destructive">*</span>
            </FieldLabel>
            <FieldContent>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your consultation needs, project details, or questions. The more details you provide, the better we can assist you..."
                rows={6}
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Provide details about what you need help with, your goals,
                timeline, and any specific requirements.
              </p>
            </FieldContent>
          </Field>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <ButtonPrimary
              type="submit"
              variant="solid"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </ButtonPrimary>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
