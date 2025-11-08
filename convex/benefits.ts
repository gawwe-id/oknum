import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get benefits by class ID (ordered by order field)
export const getBenefitsByClassId = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    const benefits = await ctx.db
      .query("benefits")
      .withIndex("by_classId", (q) => q.eq("classId", args.classId))
      .collect();

    // Sort by order field if present, otherwise by creation time
    return benefits.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      return a.createdAt - b.createdAt;
    });
  },
});

// Create benefit for a class
export const createBenefit = mutation({
  args: {
    classId: v.id("classes"),
    emoji: v.string(),
    text: v.string(),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Verify class exists
    const classItem = await ctx.db.get(args.classId);
    if (!classItem) {
      throw new Error("Class not found");
    }

    const now = Date.now();
    return await ctx.db.insert("benefits", {
      classId: args.classId,
      emoji: args.emoji,
      text: args.text,
      order: args.order,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update benefit
export const updateBenefit = mutation({
  args: {
    benefitId: v.id("benefits"),
    emoji: v.optional(v.string()),
    text: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { benefitId, ...updates } = args;
    const existing = await ctx.db.get(benefitId);
    if (!existing) {
      throw new Error("Benefit not found");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (updates.emoji !== undefined) updateData.emoji = updates.emoji;
    if (updates.text !== undefined) updateData.text = updates.text;
    if (updates.order !== undefined) updateData.order = updates.order;

    await ctx.db.patch(benefitId, updateData);
    return await ctx.db.get(benefitId);
  },
});

// Delete benefit
export const deleteBenefit = mutation({
  args: {
    benefitId: v.id("benefits"),
  },
  handler: async (ctx, args) => {
    const benefit = await ctx.db.get(args.benefitId);
    if (!benefit) {
      throw new Error("Benefit not found");
    }

    await ctx.db.delete(args.benefitId);
  },
});

// Reorder benefits (update order of multiple benefits)
export const reorderBenefits = mutation({
  args: {
    benefitOrders: v.array(
      v.object({
        benefitId: v.id("benefits"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Update each benefit's order
    await Promise.all(
      args.benefitOrders.map(async ({ benefitId, order }) => {
        const benefit = await ctx.db.get(benefitId);
        if (!benefit) {
          throw new Error(`Benefit ${benefitId} not found`);
        }

        await ctx.db.patch(benefitId, {
          order,
          updatedAt: Date.now(),
        });
      })
    );

    return { success: true };
  },
});

