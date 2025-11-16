import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./auth";

// Helper to slugify a string
function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "expert";
}

// Ensure slug uniqueness by appending a numeric suffix if needed
async function generateUniqueSlug(ctx: any, name: string): Promise<string> {
  const base = slugify(name);
  let candidate = base;
  let suffix = 2;
  // Try find collisions
  // Loop limited just in case (though unlikely to reach high numbers)
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await ctx.db
      .query("experts")
      .withIndex("by_slug", (q: any) => q.eq("slug", candidate))
      .first();
    if (!existing) {
      return candidate;
    }
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

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

// Create expert (self-registration, no approval needed - requires authentication)
export const createExpert = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    bio: v.string(),
    profileImage: v.optional(v.string()),
    specialization: v.array(v.string()),
    experience: v.string(),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const user = await getCurrentUserOrThrow(ctx);

    // Check if expert already exists for this user
    const existingExpert = await ctx.db
      .query("experts")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (existingExpert) {
      throw new Error("Expert profile already exists for this user");
    }

    const now = Date.now();
    const slug = await generateUniqueSlug(ctx, args.name);
    const expertId = await ctx.db.insert("experts", {
      userId: user._id,
      name: args.name,
      email: args.email,
      slug,
      bio: args.bio,
      profileImage: args.profileImage,
      specialization: args.specialization,
      experience: args.experience,
      status: "active", // No approval needed - directly active
      createdAt: now,
      updatedAt: now,
    });

    // Update user to link expertId
    await ctx.db.patch(user._id, {
      expertId,
      role: "expert",
      updatedAt: now,
    });

    return expertId;
  },
});

// Admin create expert (admin can create expert profile for any user)
export const adminCreateExpert = mutation({
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
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is an admin
    if (currentUser.role !== "admin") {
      throw new Error("Only admins can create expert profiles for other users");
    }

    // Check if expert already exists for this user
    const existingExpert = await ctx.db
      .query("experts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existingExpert) {
      throw new Error("Expert profile already exists for this user");
    }

    // Verify user exists
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const now = Date.now();
    const slug = await generateUniqueSlug(ctx, args.name);
    const expertId = await ctx.db.insert("experts", {
      userId: args.userId,
      name: args.name,
      email: args.email,
      slug,
      bio: args.bio,
      profileImage: args.profileImage,
      specialization: args.specialization,
      experience: args.experience,
      status: "active",
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

// Update expert (requires authentication - can only update own expert profile unless admin)
export const updateExpert = mutation({
  args: {
    expertId: v.id("experts"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    bio: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    specialization: v.optional(v.array(v.string())),
    experience: v.optional(v.string()),
    rating: v.optional(v.number()),
    totalStudents: v.optional(v.number()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    const { expertId, ...updates } = args;
    const existing = await ctx.db.get(expertId);
    if (!existing) {
      throw new Error("Expert not found");
    }

    // Check if user owns the expert profile or is an admin
    if (existing.userId !== currentUser._id && currentUser.role !== "admin") {
      throw new Error(
        "Unauthorized: You can only update your own expert profile"
      );
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.bio !== undefined) updateData.bio = updates.bio;
    if (updates.profileImage !== undefined)
      updateData.profileImage = updates.profileImage;
    if (updates.specialization !== undefined)
      updateData.specialization = updates.specialization;
    if (updates.experience !== undefined)
      updateData.experience = updates.experience;
    if (updates.rating !== undefined) updateData.rating = updates.rating;
    if (updates.totalStudents !== undefined)
      updateData.totalStudents = updates.totalStudents;
    if (updates.status !== undefined) updateData.status = updates.status;

    await ctx.db.patch(expertId, updateData);
    return await ctx.db.get(expertId);
  },
});

// Admin-only: Backfill missing expert slugs based on name
export const adminBackfillExpertSlugs = mutation({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUserOrThrow(ctx);
    if (currentUser.role !== "admin") {
      throw new Error("Only admins can run this backfill");
    }

    // Scan all experts, patch those without slug
    const experts = await ctx.db.query("experts").collect();
    let updated = 0;
    for (const expert of experts) {
      if (!("slug" in expert) || !expert.slug) {
        const slug = await generateUniqueSlug(ctx, expert.name);
        await ctx.db.patch(expert._id, { slug, updatedAt: Date.now() });
        updated += 1;
      }
    }
    return { updated };
  },
});

// Public: Get expert by slug (includes classes)
export const getExpertBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const expert = await ctx.db
      .query("experts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (!expert) return null;

    const classes = await ctx.db
      .query("classes")
      .withIndex("by_expertId", (q) => q.eq("expertId", expert._id))
      .collect();

    return { ...expert, classes };
  },
});
