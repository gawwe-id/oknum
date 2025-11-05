import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, getCurrentUserOrThrow } from "./auth";

// Get current authenticated user
export const getCurrentUserQuery = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

// Get user profile by ID
export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Get user by Clerk userId
export const getUserByClerkId = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.clerkUserId))
      .first();
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

// Create user (for registration with Clerk)
export const createUser = mutation({
  args: {
    userId: v.string(), // Clerk user ID
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    role: v.union(
      v.literal("student"),
      v.literal("expert"),
      v.literal("admin")
    ),
    avatar: v.optional(v.string()),
    emailVerified: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      throw new Error("User already exists");
    }

    const now = Date.now();
    return await ctx.db.insert("users", {
      userId: args.userId,
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

// Update user role and phone after Clerk signup
export const updateUserAfterSignup = mutation({
  args: {
    userId: v.string(), // Clerk user ID
    phone: v.optional(v.string()),
    role: v.optional(
      v.union(v.literal("student"), v.literal("expert"), v.literal("admin"))
    ),
  },
  handler: async (ctx, args) => {
    // Validate that the authenticated user matches the userId
    const currentUser = await getCurrentUserOrThrow(ctx);
    if (currentUser.userId !== args.userId) {
      throw new Error("Unauthorized: Cannot update another user");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    // Set role to student by default if not set
    if (args.role !== undefined) {
      updateData.role = args.role;
    } else if (!currentUser.role) {
      updateData.role = "student";
    }

    if (args.phone !== undefined) {
      updateData.phone = args.phone;
    }

    await ctx.db.patch(currentUser._id, updateData);
    return await ctx.db.get(currentUser._id);
  },
});

// Update user (requires authentication - can only update own profile)
export const updateUser = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    avatar: v.optional(v.string()),
    emailVerified: v.optional(v.boolean()),
    expertId: v.optional(v.id("experts")),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) updateData.name = args.name;
    if (args.phone !== undefined) updateData.phone = args.phone;
    if (args.avatar !== undefined) updateData.avatar = args.avatar;
    if (args.emailVerified !== undefined)
      updateData.emailVerified = args.emailVerified;
    if (args.expertId !== undefined) updateData.expertId = args.expertId;

    await ctx.db.patch(currentUser._id, updateData);
    return await ctx.db.get(currentUser._id);
  },
});
