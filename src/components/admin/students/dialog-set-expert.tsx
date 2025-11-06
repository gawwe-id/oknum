"use client";

import * as React from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DialogSetExpertProps {
  student: {
    _id: string;
    userId: string;
    name: string;
    email: string;
  };
  trigger: React.ReactNode;
}

export function DialogSetExpert({ student, trigger }: DialogSetExpertProps) {
  const [open, setOpen] = React.useState(false);
  const [isUpdatingClerk, setIsUpdatingClerk] = React.useState(false);
  const updateRole = useMutation(api.users.updateUserRoleToExpert);

  const handleSetExpert = async () => {
    try {
      setIsUpdatingClerk(true);

      // Update role in Convex
      await updateRole({ userId: student._id as Id<"users"> });

      // Update Clerk metadata
      try {
        const response = await fetch("/api/users/update-role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clerkUserId: student.userId,
            role: "expert",
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to update Clerk metadata");
        }
      } catch (clerkError) {
        console.error("Error updating Clerk metadata:", clerkError);
        // Role sudah diupdate di Convex, jadi kita tetap tutup dialog
        // User bisa refresh page untuk melihat perubahan
        toast.warning(
          "Role updated in database, but Clerk metadata update failed"
        );
      }

      setOpen(false);
      toast.success(`${student.name} has been set as an expert`);

      // Refresh page to update the table (Convex queries will auto-refresh, but this ensures UI is updated)
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error setting user to expert:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update user role"
      );
      setIsUpdatingClerk(false);
    }
  };

  return (
    <>
      <div onClick={() => setOpen(true)} className="inline-block">
        {trigger}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set to Expert</DialogTitle>
            <DialogDescription>
              Are you sure you want to set <strong>{student.name}</strong> (
              {student.email}) as an expert? This action will change their role
              from student to expert.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isUpdatingClerk}
            >
              Cancel
            </Button>
            <ButtonPrimary
              variant="solid"
              onClick={handleSetExpert}
              disabled={isUpdatingClerk}
            >
              {isUpdatingClerk ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Set to Expert"
              )}
            </ButtonPrimary>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
