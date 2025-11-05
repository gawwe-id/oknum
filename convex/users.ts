import {
  query,
  mutation,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./auth";

// Get current authenticated user
export const getCurrentUserQuery = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Find user by Clerk userId
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    return user;
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

// Get user role by Clerk userId (public query for API routes)
export const getUserRoleByClerkIdPublic = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.clerkUserId))
      .first();
    return user ? user.role : null;
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

// Internal query to check if user exists by userId or email (for webhook)
export const checkUserExists = internalQuery({
  args: {
    userId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check by userId first
    const userByUserId = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (userByUserId) {
      return userByUserId;
    }

    // Check by email
    const userByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    return userByEmail;
  },
});

// Internal query to get user role by Clerk userId (for middleware)
export const getUserRoleByClerkId = internalQuery({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.clerkUserId))
      .first();

    return user ? user.role : null;
  },
});

// Internal mutation to create user from Clerk (used by webhook and lazy creation)
export const createUserFromClerk = internalMutation({
  args: {
    userId: v.string(), // Clerk user ID
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    avatar: v.optional(v.string()),
    emailVerified: v.boolean(),
    role: v.optional(
      v.union(v.literal("student"), v.literal("expert"), v.literal("admin"))
    ),
  },
  handler: async (ctx, args) => {
    // Check if user already exists (idempotent)
    const existing = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      return existing;
    }

    const now = Date.now();
    return await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      name: args.name,
      phone: args.phone,
      role: args.role || "student", // Default role is "student"
      avatar: args.avatar,
      emailVerified: args.emailVerified,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Create user (for registration with Clerk)
export const createUser = mutation({
  args: {
    userId: v.string(), // Clerk user ID
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    role: v.optional(
      v.union(v.literal("student"), v.literal("expert"), v.literal("admin"))
    ),
    avatar: v.optional(v.string()),
    emailVerified: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists (idempotent)
    const existing = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      return existing;
    }

    const now = Date.now();
    return await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      name: args.name,
      phone: args.phone,
      role: args.role || "student", // Default role is "student"
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

// Ensure user exists (lazy creation - can be called from client side)
export const ensureUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: Authentication required");
    }

    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (existing) {
      return existing;
    }

    // Extract user information from Clerk identity
    const email = identity.email || "";
    const name =
      identity.name ||
      `${identity.given_name || ""} ${identity.family_name || ""}`.trim() ||
      email.split("@")[0] ||
      "User";
    const avatar =
      typeof identity.picture === "string" ? identity.picture : undefined;
    const emailVerified =
      typeof identity.email_verified === "boolean"
        ? identity.email_verified
        : false;
    const phone =
      typeof identity.phone_number === "string"
        ? identity.phone_number
        : undefined;

    // Create user with default role "student" (directly insert since we're in mutation context)
    const now = Date.now();
    return await ctx.db.insert("users", {
      userId: identity.subject,
      email,
      name,
      phone,
      avatar,
      emailVerified,
      role: "student", // Default role
      createdAt: now,
      updatedAt: now,
    });
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
