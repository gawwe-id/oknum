import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get curriculum by class ID
export const getCurriculumsByClass = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("curriculum")
      .withIndex("by_classId", (q) => q.eq("classId", args.classId))
      .first();
  },
});

// Create or update curriculum for a class
export const upsertCurriculum = mutation({
  args: {
    classId: v.id("classes"),
    modules: v.array(
      v.object({
        order: v.number(),
        title: v.string(),
        description: v.string(),
        duration: v.number(),
        topics: v.array(v.string()),
      })
    ),
    learningObjectives: v.array(v.string()),
    prerequisites: v.optional(v.array(v.string())),
    materials: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Verify class exists
    const classItem = await ctx.db.get(args.classId);
    if (!classItem) {
      throw new Error("Class not found");
    }

    // Check if curriculum already exists
    const existing = await ctx.db
      .query("curriculum")
      .withIndex("by_classId", (q) => q.eq("classId", args.classId))
      .first();

    if (existing) {
      // Update existing curriculum
      await ctx.db.patch(existing._id, {
        modules: args.modules,
        learningObjectives: args.learningObjectives,
        prerequisites: args.prerequisites,
        materials: args.materials,
      });
      return existing._id;
    } else {
      // Create new curriculum
      return await ctx.db.insert("curriculum", {
        classId: args.classId,
        modules: args.modules,
        learningObjectives: args.learningObjectives,
        prerequisites: args.prerequisites,
        materials: args.materials,
      });
    }
  },
});

