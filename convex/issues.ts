import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { getCurrentUserOrThrow } from './auth';

// Get all issues (admin only) with optional filters
export const getIssues = query({
  args: {
    status: v.optional(
      v.union(
        v.literal('pending'),
        v.literal('open'),
        v.literal('in_progress'),
        v.literal('resolved'),
        v.literal('closed')
      )
    ),
    category: v.optional(
      v.union(
        v.literal('technical'),
        v.literal('billing'),
        v.literal('general')
      )
    )
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is an admin
    if (currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can access all issues');
    }

    // Get issues with filters
    let issues;
    if (args.status) {
      issues = await ctx.db
        .query('issues')
        .withIndex('by_status', (q) => q.eq('status', args.status!))
        .collect();
    } else {
      issues = await ctx.db.query('issues').collect();
    }

    // Apply category filter if provided
    let filtered = issues;
    if (args.category) {
      filtered = filtered.filter((t) => t.category === args.category);
    }

    // Enrich with user data
    const enriched = await Promise.all(
      filtered.map(async (issue) => {
        const user = await ctx.db.get(issue.userId);
        const replies = await ctx.db
          .query('issueReplies')
          .withIndex('by_issueId', (q) => q.eq('issueId', issue._id))
          .collect();

        return {
          ...issue,
          user,
          repliesCount: replies.length
        };
      })
    );

    return enriched.sort((a, b) => b.createdAt - a.createdAt);
  }
});

// Get issues by current authenticated user (student/expert)
export const getIssuesByUser = query({
  args: {},
  handler: async (ctx) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is student or expert
    if (currentUser.role !== 'student' && currentUser.role !== 'expert') {
      throw new Error(
        'Unauthorized: Only students and experts can access their issues'
      );
    }

    const issues = await ctx.db
      .query('issues')
      .withIndex('by_userId', (q) => q.eq('userId', currentUser._id))
      .collect();

    // Enrich with replies
    const enriched = await Promise.all(
      issues.map(async (issue) => {
        const replies = await ctx.db
          .query('issueReplies')
          .withIndex('by_issueId', (q) => q.eq('issueId', issue._id))
          .collect();

        // Enrich replies with user data
        const enrichedReplies = await Promise.all(
          replies.map(async (reply) => {
            const user = await ctx.db.get(reply.userId);
            return {
              ...reply,
              user
            };
          })
        );

        return {
          ...issue,
          replies: enrichedReplies.sort((a, b) => a.createdAt - b.createdAt)
        };
      })
    );

    return enriched.sort((a, b) => b.createdAt - a.createdAt);
  }
});

// Get issue by ID with all replies
export const getIssueById = query({
  args: { issueId: v.id('issues') },
  handler: async (ctx, args) => {
    const issue = await ctx.db.get(args.issueId);
    if (!issue) return null;

    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Check authorization: admin can see all, user can only see their own issues
    if (currentUser.role !== 'admin' && issue.userId !== currentUser._id) {
      throw new Error('Unauthorized: You can only view your own issues');
    }

    // Get user who created the issue
    const user = await ctx.db.get(issue.userId);

    // Get all replies
    const replies = await ctx.db
      .query('issueReplies')
      .withIndex('by_issueId', (q) => q.eq('issueId', args.issueId))
      .collect();

    // Enrich replies with user data
    const enrichedReplies = await Promise.all(
      replies.map(async (reply) => {
        const user = await ctx.db.get(reply.userId);
        return {
          ...reply,
          user
        };
      })
    );

    return {
      ...issue,
      user,
      replies: enrichedReplies.sort((a, b) => a.createdAt - b.createdAt)
    };
  }
});

// Get issue replies for a specific issue
export const getIssueReplies = query({
  args: { issueId: v.id('issues') },
  handler: async (ctx, args) => {
    const issue = await ctx.db.get(args.issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }

    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Check authorization: admin can see all, user can only see their own issues
    if (currentUser.role !== 'admin' && issue.userId !== currentUser._id) {
      throw new Error(
        'Unauthorized: You can only view replies for your own issues'
      );
    }

    const replies = await ctx.db
      .query('issueReplies')
      .withIndex('by_issueId', (q) => q.eq('issueId', args.issueId))
      .collect();

    // Enrich replies with user data
    const enrichedReplies = await Promise.all(
      replies.map(async (reply) => {
        const replyUser = await ctx.db.get(reply.userId);
        return {
          ...reply,
          user: replyUser
        };
      })
    );

    return enrichedReplies.sort((a, b) => a.createdAt - b.createdAt);
  }
});

// Create issue (student/expert only)
export const createIssue = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    evidences: v.array(v.string()),
    category: v.union(
      v.literal('technical'),
      v.literal('billing'),
      v.literal('general')
    )
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is student or expert
    if (currentUser.role !== 'student' && currentUser.role !== 'expert') {
      throw new Error('Only students and experts can create issues');
    }

    const now = Date.now();
    return await ctx.db.insert('issues', {
      userId: currentUser._id,
      title: args.title,
      description: args.description,
      evidences: args.evidences,
      category: args.category,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    });
  }
});

// Update issue status (admin only)
export const updateIssueStatus = mutation({
  args: {
    issueId: v.id('issues'),
    status: v.union(
      v.literal('pending'),
      v.literal('open'),
      v.literal('in_progress'),
      v.literal('resolved'),
      v.literal('closed')
    )
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is an admin
    if (currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can update issue status');
    }

    const issue = await ctx.db.get(args.issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }

    await ctx.db.patch(args.issueId, {
      status: args.status,
      updatedAt: Date.now()
    });

    return await ctx.db.get(args.issueId);
  }
});

// Create issue reply
export const createIssueReply = mutation({
  args: {
    issueId: v.id('issues'),
    message: v.string(),
    attachments: v.optional(v.array(v.string()))
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    const issue = await ctx.db.get(args.issueId);
    if (!issue) {
      throw new Error('Issues not found');
    }

    // Admin can reply anytime
    if (currentUser.role === 'admin') {
      const now = Date.now();
      const replyId = await ctx.db.insert('issueReplies', {
        issueId: args.issueId,
        userId: currentUser._id,
        message: args.message,
        attachments: args.attachments,
        createdAt: now,
        updatedAt: now
      });

      // Update issue status to "open" if it was "pending"
      if (issue.status === 'pending') {
        await ctx.db.patch(args.issueId, {
          status: 'open',
          updatedAt: now
        });
      }

      return replyId;
    }

    // Student/expert can only reply if they own the issue AND there's at least one admin reply
    if (currentUser.role === 'student' || currentUser.role === 'expert') {
      // Check if user owns the issue
      if (issue.userId !== currentUser._id) {
        throw new Error('Unauthorized: You can only reply to your own issues');
      }

      // Check if there's at least one admin reply
      const allReplies = await ctx.db
        .query('issueReplies')
        .withIndex('by_issueId', (q) => q.eq('issueId', args.issueId))
        .collect();

      // Get all reply users to check if any is admin
      const replyUsers = await Promise.all(
        allReplies.map((reply) => ctx.db.get(reply.userId))
      );

      const hasAdminReply = replyUsers.some(
        (user) => user && user.role === 'admin'
      );

      if (!hasAdminReply) {
        throw new Error(
          'You can only reply after an admin has responded to your issue'
        );
      }

      const now = Date.now();
      return await ctx.db.insert('issueReplies', {
        issueId: args.issueId,
        userId: currentUser._id,
        message: args.message,
        attachments: args.attachments,
        createdAt: now,
        updatedAt: now
      });
    }

    throw new Error('Unauthorized: Invalid user role');
  }
});
