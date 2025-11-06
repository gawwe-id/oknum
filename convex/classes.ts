import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./auth";

// Get classes with optional filters (default: published only, can filter by status)
export const getClasses = query({
  args: {
    category: v.optional(v.string()),
    type: v.optional(
      v.union(v.literal("offline"), v.literal("online"), v.literal("hybrid"))
    ),
    expertId: v.optional(v.id("experts")),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("published"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
  },
  handler: async (ctx, args) => {
    // Get classes - filter by status if provided, otherwise default to published (for backward compatibility)
    let classes;
    if (args.status) {
      classes = await ctx.db
        .query("classes")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    } else {
      // Default behavior: get published classes (for backward compatibility)
      classes = await ctx.db
        .query("classes")
        .withIndex("by_status", (q) => q.eq("status", "published"))
        .collect();
    }

    // Apply filters
    let filtered = classes;
    if (args.category) {
      filtered = filtered.filter((c) => c.category === args.category);
    }
    if (args.type) {
      filtered = filtered.filter((c) => c.type === args.type);
    }
    if (args.expertId) {
      filtered = filtered.filter((c) => c.expertId === args.expertId);
    }

    // Enrich with expert and curriculum data
    const enriched = await Promise.all(
      filtered.map(async (classItem) => {
        const expert = await ctx.db.get(classItem.expertId);
        const curriculum = await ctx.db
          .query("curriculum")
          .withIndex("by_classId", (q) => q.eq("classId", classItem._id))
          .first();
        const schedules = await ctx.db
          .query("schedules")
          .withIndex("by_classId", (q) => q.eq("classId", classItem._id))
          .collect();

        return {
          ...classItem,
          expert,
          curriculum,
          schedules: schedules.sort(
            (a, b) => a.sessionNumber - b.sessionNumber
          ),
        };
      })
    );

    return enriched;
  },
});

// Get class by ID with full details
export const getClassById = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    const classItem = await ctx.db.get(args.classId);
    if (!classItem) return null;

    const expert = await ctx.db.get(classItem.expertId);
    const curriculum = await ctx.db
      .query("curriculum")
      .withIndex("by_classId", (q) => q.eq("classId", args.classId))
      .first();
    const schedules = await ctx.db
      .query("schedules")
      .withIndex("by_classId", (q) => q.eq("classId", args.classId))
      .collect();

    return {
      ...classItem,
      expert,
      curriculum,
      schedules: schedules.sort((a, b) => a.sessionNumber - b.sessionNumber),
    };
  },
});

// Get classes by expert
export const getClassesByExpert = query({
  args: { expertId: v.id("experts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("classes")
      .withIndex("by_expertId", (q) => q.eq("expertId", args.expertId))
      .collect();
  },
});

// Create class (expert creates class - requires authentication)
export const createClass = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    price: v.number(),
    currency: v.string(),
    type: v.union(
      v.literal("offline"),
      v.literal("online"),
      v.literal("hybrid")
    ),
    maxStudents: v.optional(v.number()),
    minStudents: v.optional(v.number()),
    duration: v.number(),
    thumbnail: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is an expert
    if (!currentUser.expertId) {
      throw new Error("Only experts can create classes");
    }

    // Verify expert exists
    const expert = await ctx.db.get(currentUser.expertId);
    if (!expert) {
      throw new Error("Expert profile not found");
    }

    const now = Date.now();
    return await ctx.db.insert("classes", {
      expertId: currentUser.expertId,
      title: args.title,
      description: args.description,
      category: args.category,
      price: args.price,
      currency: args.currency,
      type: args.type,
      maxStudents: args.maxStudents,
      minStudents: args.minStudents,
      duration: args.duration,
      thumbnail: args.thumbnail,
      images: args.images,
      status: args.status,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update class (requires authentication - can only update own classes unless admin)
export const updateClass = mutation({
  args: {
    classId: v.id("classes"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    price: v.optional(v.number()),
    type: v.optional(
      v.union(v.literal("offline"), v.literal("online"), v.literal("hybrid"))
    ),
    maxStudents: v.optional(v.number()),
    minStudents: v.optional(v.number()),
    duration: v.optional(v.number()),
    thumbnail: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("published"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    const { classId, ...updates } = args;
    const existing = await ctx.db.get(classId);
    if (!existing) {
      throw new Error("Class not found");
    }

    // Get the expert who owns this class
    const expert = await ctx.db.get(existing.expertId);
    if (!expert) {
      throw new Error("Expert not found for this class");
    }

    // Check if user owns the expert profile that owns this class, or is an admin
    if (expert.userId !== currentUser._id && currentUser.role !== "admin") {
      throw new Error("Unauthorized: You can only update your own classes");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined)
      updateData.description = updates.description;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.maxStudents !== undefined)
      updateData.maxStudents = updates.maxStudents;
    if (updates.minStudents !== undefined)
      updateData.minStudents = updates.minStudents;
    if (updates.duration !== undefined) updateData.duration = updates.duration;
    if (updates.thumbnail !== undefined)
      updateData.thumbnail = updates.thumbnail;
    if (updates.images !== undefined) updateData.images = updates.images;
    if (updates.status !== undefined) updateData.status = updates.status;

    await ctx.db.patch(classId, updateData);
    return await ctx.db.get(classId);
  },
});

// Admin create class (admin can create class for any expert)
export const adminCreateClass = mutation({
  args: {
    expertId: v.id("experts"),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    price: v.number(),
    currency: v.string(),
    type: v.union(
      v.literal("offline"),
      v.literal("online"),
      v.literal("hybrid")
    ),
    maxStudents: v.optional(v.number()),
    minStudents: v.optional(v.number()),
    duration: v.number(),
    thumbnail: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is an admin
    if (currentUser.role !== "admin") {
      throw new Error("Only admins can create classes for experts");
    }

    // Verify expert exists
    const expert = await ctx.db.get(args.expertId);
    if (!expert) {
      throw new Error("Expert profile not found");
    }

    const now = Date.now();
    return await ctx.db.insert("classes", {
      expertId: args.expertId,
      title: args.title,
      description: args.description,
      category: args.category,
      price: args.price,
      currency: args.currency,
      type: args.type,
      maxStudents: args.maxStudents,
      minStudents: args.minStudents,
      duration: args.duration,
      thumbnail: args.thumbnail,
      images: args.images,
      status: args.status,
      createdAt: now,
      updatedAt: now,
    });
  },
});
