import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./auth";

// Get all documentation for a class (optionally filtered by type)
export const getDocumentationByClassId = query({
  args: {
    classId: v.id("classes"),
    type: v.optional(v.union(v.literal("photo"), v.literal("video"))),
  },
  handler: async (ctx, args) => {
    let docs;
    if (args.type) {
      const type = args.type; // Type narrowing helper
      docs = await ctx.db
        .query("documentation")
        .withIndex("by_classId_type", (q) =>
          q.eq("classId", args.classId).eq("type", type)
        )
        .collect();
    } else {
      docs = await ctx.db
        .query("documentation")
        .withIndex("by_classId", (q) => q.eq("classId", args.classId))
        .collect();
    }

    // Sort by creation date (newest first)
    return docs.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get single documentation record by ID
export const getDocumentationById = query({
  args: { documentationId: v.id("documentation") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.documentationId);
  },
});

// Get documentation filtered by class and type
export const getDocumentationByClassAndType = query({
  args: {
    classId: v.id("classes"),
    type: v.union(v.literal("photo"), v.literal("video")),
  },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("documentation")
      .withIndex("by_classId_type", (q) =>
        q.eq("classId", args.classId).eq("type", args.type)
      )
      .collect();

    // Sort by creation date (newest first)
    return docs.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Create new documentation record (expert/admin only)
export const createDocumentation = mutation({
  args: {
    classId: v.id("classes"),
    type: v.union(v.literal("photo"), v.literal("video")),
    url: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    mimeType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is expert or admin
    if (currentUser.role !== "expert" && currentUser.role !== "admin") {
      throw new Error(
        "Unauthorized: Only experts and admins can upload documentation"
      );
    }

    // Verify class exists
    const classItem = await ctx.db.get(args.classId);
    if (!classItem) {
      throw new Error("Class not found");
    }

    const now = Date.now();
    return await ctx.db.insert("documentation", {
      classId: args.classId,
      type: args.type,
      url: args.url,
      title: args.title,
      description: args.description,
      uploadedBy: currentUser._id,
      fileSize: args.fileSize,
      mimeType: args.mimeType,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update documentation metadata (expert/admin only)
export const updateDocumentation = mutation({
  args: {
    documentationId: v.id("documentation"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is expert or admin
    if (currentUser.role !== "expert" && currentUser.role !== "admin") {
      throw new Error(
        "Unauthorized: Only experts and admins can update documentation"
      );
    }

    const { documentationId, ...updates } = args;
    const existing = await ctx.db.get(documentationId);
    if (!existing) {
      throw new Error("Documentation not found");
    }

    // Check if user uploaded this documentation or is admin
    if (
      existing.uploadedBy !== currentUser._id &&
      currentUser.role !== "admin"
    ) {
      throw new Error(
        "Unauthorized: You can only update documentation you uploaded"
      );
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined)
      updateData.description = updates.description;

    await ctx.db.patch(documentationId, updateData);
    return await ctx.db.get(documentationId);
  },
});

// Delete documentation record (expert/admin only)
export const deleteDocumentation = mutation({
  args: {
    documentationId: v.id("documentation"),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is expert or admin
    if (currentUser.role !== "expert" && currentUser.role !== "admin") {
      throw new Error(
        "Unauthorized: Only experts and admins can delete documentation"
      );
    }

    const doc = await ctx.db.get(args.documentationId);
    if (!doc) {
      throw new Error("Documentation not found");
    }

    // Check if user uploaded this documentation or is admin
    if (doc.uploadedBy !== currentUser._id && currentUser.role !== "admin") {
      throw new Error(
        "Unauthorized: You can only delete documentation you uploaded"
      );
    }

    // Note: File deletion from storage should be handled separately
    // if needed, as we only store the URL here
    await ctx.db.delete(args.documentationId);
  },
});

