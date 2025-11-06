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
import { ButtonPrimary } from "@/components/ui/button-primary";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface DialogScheduleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "update";
  classId: Id<"classes">;
  classData: {
    title: string;
    type: "offline" | "online" | "hybrid";
    maxStudents?: number;
    schedules?: Array<{ sessionNumber: string }>;
  };
  scheduleId?: Id<"schedules">;
  scheduleData?: {
    sessionNumber: string;
    sessionTitle?: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    timezone: string;
    location: {
      type: "offline" | "online" | "hybrid";
      address?: string;
      city?: string;
      province?: string;
      coordinates?: { lat: number; lng: number };
      onlineLink?: string;
      platform?: string;
    };
    capacity: number;
    status?: "upcoming" | "ongoing" | "completed" | "cancelled";
  };
  onSuccess?: () => void;
}

// Helper function to generate session number: 3 random digits + 3 first chars of class title
function generateSessionNumber(
  classTitle: string,
  existingSchedules?: Array<{ sessionNumber: string }>
): string {
  // Get first 3 characters of class title (uppercase, remove spaces)
  const titlePrefix = classTitle
    .replace(/\s+/g, "")
    .substring(0, 3)
    .toUpperCase()
    .padEnd(3, "X"); // Pad with X if less than 3 chars

  // Generate 3 random digits
  const randomDigits = Math.floor(100 + Math.random() * 900).toString(); // 100-999

  const sessionNumber = `${randomDigits}${titlePrefix}`;

  // Check if session number already exists, regenerate if it does
  if (existingSchedules?.some((s) => s.sessionNumber === sessionNumber)) {
    // Recursively try again (very unlikely to collide twice)
    return generateSessionNumber(classTitle, existingSchedules);
  }

  return sessionNumber;
}

export function DialogSchedule({
  open,
  onOpenChange,
  mode,
  classId,
  classData,
  scheduleId,
  scheduleData,
  onSuccess,
}: DialogScheduleProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const createSchedule = useMutation(api.schedules.createSchedule);
  const updateSchedule = useMutation(api.schedules.updateSchedule);

  // Date range state
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: scheduleData?.startDate
      ? new Date(scheduleData.startDate)
      : undefined,
    to: scheduleData?.endDate ? new Date(scheduleData.endDate) : undefined,
  });

  // Get location type and capacity from class data
  const locationType = classData.type;
  const capacity = classData.maxStudents || 30; // Default to 30 if not set

  // Generate session number for create mode
  const sessionNumber =
    mode === "create"
      ? generateSessionNumber(classData.title, classData.schedules)
      : scheduleData?.sessionNumber || "";

  // Form state
  const [formData, setFormData] = React.useState({
    sessionTitle: scheduleData?.sessionTitle || "",
    startTime: scheduleData?.startTime || "",
    endTime: scheduleData?.endTime || "",
    timezone: scheduleData?.timezone || "Asia/Jakarta",
    address: scheduleData?.location.address || "",
    city: scheduleData?.location.city || "",
    province: scheduleData?.location.province || "",
    onlineLink: scheduleData?.location.onlineLink || "",
    platform: scheduleData?.location.platform || "",
    status:
      scheduleData?.status ||
      ("upcoming" as "upcoming" | "ongoing" | "completed" | "cancelled"),
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Reset form when dialog opens/closes or scheduleData changes
  React.useEffect(() => {
    if (open) {
      if (scheduleData) {
        setDateRange({
          from: new Date(scheduleData.startDate),
          to: new Date(scheduleData.endDate),
        });
        setFormData({
          sessionTitle: scheduleData.sessionTitle || "",
          startTime: scheduleData.startTime,
          endTime: scheduleData.endTime,
          timezone: scheduleData.timezone,
          address: scheduleData.location.address || "",
          city: scheduleData.location.city || "",
          province: scheduleData.location.province || "",
          onlineLink: scheduleData.location.onlineLink || "",
          platform: scheduleData.location.platform || "",
          status: scheduleData.status || "upcoming",
        });
      } else {
        // Reset for create mode
        setDateRange({ from: undefined, to: undefined });
        setFormData({
          sessionTitle: "",
          startTime: "",
          endTime: "",
          timezone: "Asia/Jakarta",
          address: "",
          city: "",
          province: "",
          onlineLink: "",
          platform: "",
          status: "upcoming",
        });
      }
      setErrors({});
    }
  }, [open, scheduleData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!dateRange.from) {
      newErrors.startDate = "Start date is required";
    }
    if (!dateRange.to) {
      newErrors.endDate = "End date is required";
    }
    if (dateRange.from && dateRange.to && dateRange.from > dateRange.to) {
      newErrors.endDate = "End date must be after start date";
    }
    if (!formData.startTime.trim()) {
      newErrors.startTime = "Start time is required";
    }
    if (!formData.endTime.trim()) {
      newErrors.endTime = "End time is required";
    }
    if (locationType === "offline" || locationType === "hybrid") {
      if (!formData.address?.trim()) {
        newErrors.address = "Address is required for offline/hybrid sessions";
      }
    }
    if (locationType === "online" || locationType === "hybrid") {
      if (!formData.onlineLink?.trim()) {
        newErrors.onlineLink =
          "Online link is required for online/hybrid sessions";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const location = {
        type: locationType,
        address: formData.address.trim() || undefined,
        city: formData.city.trim() || undefined,
        province: formData.province.trim() || undefined,
        onlineLink: formData.onlineLink.trim() || undefined,
        platform: formData.platform.trim() || undefined,
      };

      if (mode === "create") {
        await createSchedule({
          classId,
          sessionNumber,
          sessionTitle: formData.sessionTitle.trim() || undefined,
          startDate: dateRange.from!.toISOString().split("T")[0],
          endDate: dateRange.to!.toISOString().split("T")[0],
          startTime: formData.startTime.trim(),
          endTime: formData.endTime.trim(),
          timezone: formData.timezone,
          location,
          capacity,
        });
        toast.success("Schedule created successfully");
      } else {
        if (!scheduleId) {
          throw new Error("Schedule ID is required for update");
        }
        await updateSchedule({
          scheduleId,
          sessionTitle: formData.sessionTitle.trim() || undefined,
          startDate: dateRange.from!.toISOString().split("T")[0],
          endDate: dateRange.to!.toISOString().split("T")[0],
          startTime: formData.startTime.trim(),
          endTime: formData.endTime.trim(),
          timezone: formData.timezone,
          location,
          capacity,
          status: formData.status,
        });
        toast.success("Schedule updated successfully");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save schedule"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Schedule" : "Update Schedule"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new schedule session for this class."
              : "Update the schedule details."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Session Info (Read-only) */}
          {/* <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-md">
            <div>
              <p className="text-sm text-muted-foreground">Session Number</p>
              <p className="font-semibold">{sessionNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location Type</p>
              <p className="font-semibold capitalize">{locationType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Capacity</p>
              <p className="font-semibold">{capacity} students</p>
            </div>
          </div> */}

          {/* Session Title */}
          <Field>
            <FieldLabel>Session Title</FieldLabel>
            <FieldContent>
              <Input
                value={formData.sessionTitle}
                onChange={(e) =>
                  setFormData({ ...formData, sessionTitle: e.target.value })
                }
                placeholder="Optional session title"
                disabled={isLoading}
              />
            </FieldContent>
          </Field>

          {/* Date Range */}
          <Field>
            <FieldLabel>Date Range *</FieldLabel>
            <FieldContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </div>
                <div className="w-full overflow-x-auto">
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range: DateRange | undefined) =>
                      setDateRange({
                        from: range?.from,
                        to: range?.to,
                      })
                    }
                    numberOfMonths={2}
                    className="rounded-md border w-fit mx-auto"
                  />
                </div>
              </div>
              <FieldError>{errors.startDate || errors.endDate}</FieldError>
            </FieldContent>
          </Field>

          {/* Time & Timezone */}
          <div className="grid grid-cols-3 gap-4">
            <Field>
              <FieldLabel>Start Time *</FieldLabel>
              <FieldContent>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  disabled={isLoading}
                />
                <FieldError>{errors.startTime}</FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>End Time *</FieldLabel>
              <FieldContent>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  disabled={isLoading}
                />
                <FieldError>{errors.endTime}</FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Timezone *</FieldLabel>
              <FieldContent>
                <Input
                  value={formData.timezone}
                  onChange={(e) =>
                    setFormData({ ...formData, timezone: e.target.value })
                  }
                  placeholder="Asia/Jakarta"
                  disabled={isLoading}
                />
              </FieldContent>
            </Field>
          </div>

          {/* Status (only for update) */}
          {mode === "update" && (
            <Field>
              <FieldLabel>Status</FieldLabel>
              <FieldContent>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as
                        | "upcoming"
                        | "ongoing"
                        | "completed"
                        | "cancelled",
                    })
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </FieldContent>
            </Field>
          )}

          {/* Location Details - Offline/Hybrid */}
          {(locationType === "offline" || locationType === "hybrid") && (
            <>
              <Field>
                <FieldLabel>
                  Address{" "}
                  {(locationType === "offline" || locationType === "hybrid") &&
                    "*"}
                </FieldLabel>
                <FieldContent>
                  <Input
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Street address"
                    disabled={isLoading}
                  />
                  <FieldError>{errors.address}</FieldError>
                </FieldContent>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>City</FieldLabel>
                  <FieldContent>
                    <Input
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="City"
                      disabled={isLoading}
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Province</FieldLabel>
                  <FieldContent>
                    <Input
                      value={formData.province}
                      onChange={(e) =>
                        setFormData({ ...formData, province: e.target.value })
                      }
                      placeholder="Province"
                      disabled={isLoading}
                    />
                  </FieldContent>
                </Field>
              </div>
            </>
          )}

          {/* Location Details - Online/Hybrid */}
          {(locationType === "online" || locationType === "hybrid") && (
            <>
              <Field>
                <FieldLabel>
                  Online Link{" "}
                  {(locationType === "online" || locationType === "hybrid") &&
                    "*"}
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="url"
                    value={formData.onlineLink}
                    onChange={(e) =>
                      setFormData({ ...formData, onlineLink: e.target.value })
                    }
                    placeholder="https://meet.google.com/..."
                    disabled={isLoading}
                  />
                  <FieldError>{errors.onlineLink}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Platform</FieldLabel>
                <FieldContent>
                  <Input
                    value={formData.platform}
                    onChange={(e) =>
                      setFormData({ ...formData, platform: e.target.value })
                    }
                    placeholder="Google Meet, Zoom, etc."
                    disabled={isLoading}
                  />
                </FieldContent>
              </Field>
            </>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <ButtonPrimary type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {mode === "create" ? "Creating..." : "Updating..."}
                </>
              ) : mode === "create" ? (
                "Create Schedule"
              ) : (
                "Update Schedule"
              )}
            </ButtonPrimary>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
