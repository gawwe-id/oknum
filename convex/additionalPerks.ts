import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get additional perks by class ID
export const getAdditionalPerksByClassId = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("additionalPerks")
      .withIndex("by_classId", (q) => q.eq("classId", args.classId))
      .collect();
  },
});

// Get additional perk by ID
export const getAdditionalPerkById = query({
  args: { perkId: v.id("additionalPerks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.perkId);
  },
});

// Create additional perk for a class
export const createAdditionalPerk = mutation({
  args: {
    classId: v.id("classes"),
    title: v.string(),
    description: v.string(),
    image: v.optional(v.string()),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    // Verify class exists
    const classItem = await ctx.db.get(args.classId);
    if (!classItem) {
      throw new Error("Class not found");
    }

    const now = Date.now();
    return await ctx.db.insert("additionalPerks", {
      classId: args.classId,
      title: args.title,
      description: args.description,
      image: args.image,
      price: args.price,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update additional perk
export const updateAdditionalPerk = mutation({
  args: {
    perkId: v.id("additionalPerks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    price: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { perkId, ...updates } = args;
    const existing = await ctx.db.get(perkId);
    if (!existing) {
      throw new Error("Additional perk not found");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined)
      updateData.description = updates.description;
    if (updates.image !== undefined) updateData.image = updates.image;
    if (updates.price !== undefined) updateData.price = updates.price;

    await ctx.db.patch(perkId, updateData);
    return await ctx.db.get(perkId);
  },
});

// Delete additional perk
export const deleteAdditionalPerk = mutation({
  args: {
    perkId: v.id("additionalPerks"),
  },
  handler: async (ctx, args) => {
    const perk = await ctx.db.get(args.perkId);
    if (!perk) {
      throw new Error("Additional perk not found");
    }

    await ctx.db.delete(args.perkId);
  },
});

