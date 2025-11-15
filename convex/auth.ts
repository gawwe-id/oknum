import type { QueryCtx, MutationCtx, ActionCtx } from './_generated/server';
import { internal } from './_generated/api';
import type { Doc } from './_generated/dataModel';

type AuthCtx = QueryCtx | MutationCtx;

export async function assertIdentity(ctx: QueryCtx | MutationCtx | ActionCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('UNAUTHENTICATED');
  }
  return identity;
}

export async function currentUserId(ctx: QueryCtx | MutationCtx | ActionCtx) {
  const identity = (await assertIdentity(ctx)).subject;
  return identity; // Clerk user id
}

/**
 * Helper function to get the current user or throw if not authenticated
 * Auto-creates user if not found in database (lazy creation fallback for mutations)
 */
export async function getCurrentUserOrThrow(
  ctx: AuthCtx
): Promise<Doc<'users'>> {
  const identity = await assertIdentity(ctx);
  let user = await ctx.db
    .query('users')
    .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
    .first();

  // Lazy creation: if user doesn't exist, create it automatically (only in mutation context)
  if (!user) {
    // Extract user information from Clerk identity
    const email = identity.email || '';
    const name =
      identity.name ||
      `${identity.given_name || ''} ${identity.family_name || ''}`.trim() ||
      email.split('@')[0] ||
      'User';
    const avatar =
      typeof identity.picture === 'string' ? identity.picture : undefined;
    const emailVerified =
      typeof identity.email_verified === 'boolean'
        ? identity.email_verified
        : false;
    const phone =
      typeof identity.phone_number === 'string'
        ? identity.phone_number
        : undefined;

    // Create user with default role "student"
    // Only works in mutation context (can directly insert)
    if ('runMutation' in ctx) {
      // This is a mutation context, use internal mutation
      const createdUser = await (ctx as MutationCtx).runMutation(
        internal.users.createUserFromClerk,
        {
          userId: identity.subject,
          email,
          name,
          phone,
          avatar,
          emailVerified,
          role: 'student' // Default role
        }
      );
      user =
        typeof createdUser === 'string'
          ? await ctx.db.get(createdUser)
          : createdUser;
    } else {
      // For query context, throw error - client should handle by calling ensureUser mutation
      throw new Error(
        'User not found in database. Please refresh the page or contact support.'
      );
    }
  }

  if (!user) {
    throw new Error('Failed to create user');
  }

  return user;
}
