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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface DialogDeleteScheduleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduleId: Id<"schedules">;
  scheduleData: {
    sessionNumber: string;
    sessionTitle?: string;
    startDate: string;
  };
  onSuccess?: () => void;
}

export function DialogDeleteSchedule({
  open,
  onOpenChange,
  scheduleId,
  scheduleData,
  onSuccess,
}: DialogDeleteScheduleProps) {
  const deleteSchedule = useMutation(api.schedules.deleteSchedule);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteSchedule({ scheduleId });
      toast.success("Schedule deleted successfully");
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete schedule");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="size-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>Delete Schedule</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Are you sure you want to delete this schedule?
          </p>
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <p className="font-medium">
              Session {scheduleData.sessionNumber}
              {scheduleData.sessionTitle && (
                <span className="text-muted-foreground ml-2">
                  - {scheduleData.sessionTitle}
                </span>
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(scheduleData.startDate).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <p className="text-sm text-red-600 mt-4">
            Note: This schedule cannot be deleted if it has existing bookings.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Schedule"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
