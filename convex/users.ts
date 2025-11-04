import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get user profile by ID
export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Create user (for registration)
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    role: v.union(v.literal("student"), v.literal("expert"), v.literal("admin")),
    avatar: v.optional(v.string()),
    emailVerified: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      phone: args.phone,
      role: args.role,
      avatar: args.avatar,
      emailVerified: args.emailVerified,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update user
export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    avatar: v.optional(v.string()),
    emailVerified: v.optional(v.boolean()),
    expertId: v.optional(v.id("experts")),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    const existing = await ctx.db.get(userId);
    if (!existing) {
      throw new Error("User not found");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.avatar !== undefined) updateData.avatar = updates.avatar;
    if (updates.emailVerified !== undefined) updateData.emailVerified = updates.emailVerified;
    if (updates.expertId !== undefined) updateData.expertId = updates.expertId;

    await ctx.db.patch(userId, updateData);
    return await ctx.db.get(userId);
  },
});

