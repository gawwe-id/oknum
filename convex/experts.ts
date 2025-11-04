import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get expert by ID
export const getExpertById = query({
  args: { expertId: v.id("experts") },
  handler: async (ctx, args) => {
    const expert = await ctx.db.get(args.expertId);
    if (!expert) return null;

    // Get expert's classes
    const classes = await ctx.db
      .query("classes")
      .withIndex("by_expertId", (q) => q.eq("expertId", args.expertId))
      .collect();

    return {
      ...expert,
      classes,
    };
  },
});

// Get expert by userId
export const getExpertByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("experts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// Get all active experts
export const getActiveExperts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("experts")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
  },
});

// Create expert (self-registration, no approval needed)
export const createExpert = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    bio: v.string(),
    profileImage: v.optional(v.string()),
    specialization: v.array(v.string()),
    experience: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if expert already exists for this user
    const existingExpert = await ctx.db
      .query("experts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existingExpert) {
      throw new Error("Expert profile already exists for this user");
    }

    const now = Date.now();
    const expertId = await ctx.db.insert("experts", {
      userId: args.userId,
      name: args.name,
      email: args.email,
      bio: args.bio,
      profileImage: args.profileImage,
      specialization: args.specialization,
      experience: args.experience,
      status: "active", // No approval needed - directly active
      createdAt: now,
      updatedAt: now,
    });

    // Update user to link expertId
    await ctx.db.patch(args.userId, {
      expertId,
      role: "expert",
      updatedAt: now,
    });

    return expertId;
  },
});

// Update expert
export const updateExpert = mutation({
  args: {
    expertId: v.id("experts"),
    name: v.optional(v.string()),
    bio: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    specialization: v.optional(v.array(v.string())),
    experience: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
  },
  handler: async (ctx, args) => {
    const { expertId, ...updates } = args;
    const existing = await ctx.db.get(expertId);
    if (!existing) {
      throw new Error("Expert not found");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.bio !== undefined) updateData.bio = updates.bio;
    if (updates.profileImage !== undefined) updateData.profileImage = updates.profileImage;
    if (updates.specialization !== undefined) updateData.specialization = updates.specialization;
    if (updates.experience !== undefined) updateData.experience = updates.experience;
    if (updates.status !== undefined) updateData.status = updates.status;

    await ctx.db.patch(expertId, updateData);
    return await ctx.db.get(expertId);
  },
});

