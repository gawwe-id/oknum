"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { Plus, Loader2, Edit2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Benefit {
  _id: Id<"benefits">;
  classId: Id<"classes">;
  emoji: string;
  text: string;
  order?: number;
  createdAt: number;
  updatedAt: number;
}

export function ClassBenefitsTabContent() {
  const params = useParams();
  const classId = params.classId as Id<"classes">;

  const benefits = useQuery(api.benefits.getBenefitsByClassId, { classId });
  const createBenefit = useMutation(api.benefits.createBenefit);
  const updateBenefit = useMutation(api.benefits.updateBenefit);
  const deleteBenefit = useMutation(api.benefits.deleteBenefit);

  const [isCreating, setIsCreating] = React.useState(false);
  const [editingId, setEditingId] = React.useState<Id<"benefits"> | null>(null);
  const [newBenefit, setNewBenefit] = React.useState({ emoji: "", text: "" });
  const [editingBenefit, setEditingBenefit] = React.useState<Benefit | null>(
    null
  );
  const [emojiPickerOpen, setEmojiPickerOpen] = React.useState(false);
  const [emojiPickerFor, setEmojiPickerFor] = React.useState<
    "create" | "edit" | null
  >(null);

  // Loading state
  if (benefits === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleCreate = async () => {
    if (!newBenefit.emoji || !newBenefit.text.trim()) {
      toast.error("Please fill in both emoji and text");
      return;
    }

    try {
      await createBenefit({
        classId,
        emoji: newBenefit.emoji,
        text: newBenefit.text.trim(),
        order: benefits.length,
      });
      toast.success("Benefit created successfully");
      setNewBenefit({ emoji: "", text: "" });
      setIsCreating(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create benefit"
      );
    }
  };

  const handleStartEdit = (benefit: Benefit) => {
    setEditingId(benefit._id);
    setEditingBenefit({ ...benefit });
    setEmojiPickerFor("edit");
  };

  const handleUpdate = async () => {
    if (
      !editingBenefit ||
      !editingBenefit.emoji ||
      !editingBenefit.text.trim()
    ) {
      toast.error("Please fill in both emoji and text");
      return;
    }

    try {
      await updateBenefit({
        benefitId: editingBenefit._id,
        emoji: editingBenefit.emoji,
        text: editingBenefit.text.trim(),
      });
      toast.success("Benefit updated successfully");
      setEditingId(null);
      setEditingBenefit(null);
      setEmojiPickerFor(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update benefit"
      );
    }
  };

  const handleDelete = async (benefitId: Id<"benefits">) => {
    if (!confirm("Are you sure you want to delete this benefit?")) {
      return;
    }

    try {
      await deleteBenefit({ benefitId });
      toast.success("Benefit deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete benefit"
      );
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    if (emojiPickerFor === "create") {
      setNewBenefit({ ...newBenefit, emoji });
    } else if (emojiPickerFor === "edit" && editingBenefit) {
      setEditingBenefit({ ...editingBenefit, emoji });
    }
    setEmojiPickerOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Benefits</h2>
        {!isCreating && (
          <ButtonPrimary
            onClick={() => {
              setIsCreating(true);
              setEmojiPickerFor("create");
            }}
          >
            <Plus className="size-4" />
            Add Benefit
          </ButtonPrimary>
        )}
      </div>

      {/* Create Form */}
      {isCreating && (
        <div className="border-2 border-dashed border-primary/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Popover
              open={emojiPickerOpen && emojiPickerFor === "create"}
              onOpenChange={setEmojiPickerOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-12 w-12 text-2xl p-0 shrink-0"
                  onClick={() => {
                    setEmojiPickerOpen(true);
                    setEmojiPickerFor("create");
                  }}
                >
                  {newBenefit.emoji || "😊"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </PopoverContent>
            </Popover>
            <Input
              placeholder="Enter benefit text and press Enter..."
              value={newBenefit.text}
              onChange={(e) =>
                setNewBenefit({ ...newBenefit, text: e.target.value })
              }
              className="flex-1"
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  newBenefit.emoji &&
                  newBenefit.text.trim()
                ) {
                  handleCreate();
                } else if (e.key === "Escape") {
                  setIsCreating(false);
                  setNewBenefit({ emoji: "", text: "" });
                  setEmojiPickerOpen(false);
                }
              }}
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsCreating(false);
                setNewBenefit({ emoji: "", text: "" });
                setEmojiPickerOpen(false);
              }}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Benefits List */}
      {benefits.length === 0 && !isCreating ? (
        <div className="py-12 text-center border rounded-lg">
          <p className="text-muted-foreground">
            No benefits added yet. Click "Add Benefit" to get started.
          </p>
        </div>
      ) : (
        <div className="border rounded-lg divide-y">
          {benefits.map((benefit, index) => (
            <div
              key={benefit._id}
              className="group relative p-4 hover:bg-accent/50 transition-colors"
            >
              {editingId === benefit._id ? (
                <div className="flex items-center gap-3">
                  <Popover
                    open={emojiPickerOpen && emojiPickerFor === "edit"}
                    onOpenChange={setEmojiPickerOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="h-12 w-12 text-2xl p-0 shrink-0"
                        onClick={() => {
                          setEmojiPickerOpen(true);
                          setEmojiPickerFor("edit");
                        }}
                      >
                        {editingBenefit?.emoji || benefit.emoji}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </PopoverContent>
                  </Popover>
                  <Input
                    value={editingBenefit?.text || benefit.text}
                    onChange={(e) =>
                      setEditingBenefit(
                        editingBenefit
                          ? { ...editingBenefit, text: e.target.value }
                          : null
                      )
                    }
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        editingBenefit?.emoji &&
                        editingBenefit?.text.trim()
                      ) {
                        handleUpdate();
                      } else if (e.key === "Escape") {
                        setEditingId(null);
                        setEditingBenefit(null);
                        setEmojiPickerOpen(false);
                      }
                    }}
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingId(null);
                      setEditingBenefit(null);
                      setEmojiPickerOpen(false);
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="text-2xl shrink-0">{benefit.emoji}</div>
                  <p className="text-sm text-muted-foreground flex-1">
                    {benefit.text}
                  </p>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleStartEdit(benefit)}
                    >
                      <Edit2 className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(benefit._id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
