import { query } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";

type AuthCtx = QueryCtx | MutationCtx;

/**
 * Get the current authenticated user from Clerk
 * Returns null if not authenticated
 */
export const getCurrentUser = query({
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

/**
 * Helper function to require authentication and get the identity
 * Throws error if not authenticated
 */
export async function requireAuth(ctx: AuthCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized: Authentication required");
  }
  return identity;
}

/**
 * Helper function to get the current user or throw if not authenticated
 * Throws error if not authenticated or user not found in database
 */
export async function getCurrentUserOrThrow(ctx: AuthCtx) {
  const identity = await requireAuth(ctx);
  const user = await ctx.db
    .query("users")
    .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
    .first();

  if (!user) {
    throw new Error("User not found in database");
  }

  return user;
}

