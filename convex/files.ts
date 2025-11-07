import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./auth";

// Generate upload URL for image files
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    // Get authenticated user
    await getCurrentUserOrThrow(ctx);

    // Generate upload URL
    return await ctx.storage.generateUploadUrl();
  },
});

// Get file URL from storage ID and return it
export const getFileUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    await getCurrentUserOrThrow(ctx);

    // Get file URL from storage ID
    return await ctx.storage.getUrl(args.storageId);
  },
});

