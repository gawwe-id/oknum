import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get journey by class ID
export const getJourneyByClassId = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("journey")
      .withIndex("by_classId", (q) => q.eq("classId", args.classId))
      .first();
  },
});

// Get journey by ID
export const getJourneyById = query({
  args: { journeyId: v.id("journey") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.journeyId);
  },
});

// Create journey for a class
export const createJourney = mutation({
  args: {
    classId: v.id("classes"),
    steps: v.array(
      v.object({
        order: v.number(),
        title: v.string(),
        description: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Verify class exists
    const classItem = await ctx.db.get(args.classId);
    if (!classItem) {
      throw new Error("Class not found");
    }

    // Check if journey already exists for this class
    const existing = await ctx.db
      .query("journey")
      .withIndex("by_classId", (q) => q.eq("classId", args.classId))
      .first();

    if (existing) {
      throw new Error("Journey already exists for this class. Use updateJourney or upsertJourney instead.");
    }

    const now = Date.now();
    return await ctx.db.insert("journey", {
      classId: args.classId,
      steps: args.steps,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update journey
export const updateJourney = mutation({
  args: {
    journeyId: v.id("journey"),
    steps: v.optional(
      v.array(
        v.object({
          order: v.number(),
          title: v.string(),
          description: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.journeyId);
    if (!existing) {
      throw new Error("Journey not found");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (args.steps !== undefined) {
      updateData.steps = args.steps;
    }

    await ctx.db.patch(args.journeyId, updateData);
    return await ctx.db.get(args.journeyId);
  },
});

// Create or update journey for a class (similar to curriculum pattern)
export const upsertJourney = mutation({
  args: {
    classId: v.id("classes"),
    steps: v.array(
      v.object({
        order: v.number(),
        title: v.string(),
        description: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Verify class exists
    const classItem = await ctx.db.get(args.classId);
    if (!classItem) {
      throw new Error("Class not found");
    }

    // Check if journey already exists
    const existing = await ctx.db
      .query("journey")
      .withIndex("by_classId", (q) => q.eq("classId", args.classId))
      .first();

    if (existing) {
      // Update existing journey
      await ctx.db.patch(existing._id, {
        steps: args.steps,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      // Create new journey
      const now = Date.now();
      return await ctx.db.insert("journey", {
        classId: args.classId,
        steps: args.steps,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

