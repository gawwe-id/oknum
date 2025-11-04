import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all active categories
export const getActiveCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .collect()
      .then((categories) => categories.sort((a, b) => a.order - b.order));
  },
});

// Get category by ID
export const getCategoryById = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.categoryId);
  },
});

// Get category by slug
export const getCategoryBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Get subcategories by parent ID
export const getSubcategories = query({
  args: { parentId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_parentId", (q) => q.eq("parentId", args.parentId))
      .collect()
      .then((categories) => categories.sort((a, b) => a.order - b.order));
  },
});

// Create category
export const createCategory = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    parentId: v.optional(v.id("categories")),
    order: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if slug already exists
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      throw new Error("Category with this slug already exists");
    }

    return await ctx.db.insert("categories", {
      name: args.name,
      slug: args.slug,
      description: args.description,
      icon: args.icon,
      parentId: args.parentId,
      order: args.order,
      isActive: args.isActive,
    });
  },
});

// Update category
export const updateCategory = mutation({
  args: {
    categoryId: v.id("categories"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    parentId: v.optional(v.id("categories")),
    order: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { categoryId, ...updates } = args;
    const existing = await ctx.db.get(categoryId);
    if (!existing) {
      throw new Error("Category not found");
    }

    // If slug is being updated, check if new slug already exists
    if (updates.slug && updates.slug !== existing.slug) {
      const slugExists = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", updates.slug!))
        .first();

      if (slugExists) {
        throw new Error("Category with this slug already exists");
      }
    }

    const updateData: any = {};

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.slug !== undefined) updateData.slug = updates.slug;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.icon !== undefined) updateData.icon = updates.icon;
    if (updates.parentId !== undefined) updateData.parentId = updates.parentId;
    if (updates.order !== undefined) updateData.order = updates.order;
    if (updates.isActive !== undefined) updateData.isActive = updates.isActive;

    await ctx.db.patch(categoryId, updateData);
    return await ctx.db.get(categoryId);
  },
});

