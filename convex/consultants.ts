import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { getCurrentUserOrThrow } from './auth';

// ==================== CONSULTANTS QUERIES ====================

// Get all active consultants (public - can be viewed by anyone)
export const getConsultants = query({
  args: {},
  handler: async (ctx) => {
    const consultants = await ctx.db
      .query('consultants')
      .withIndex('by_status', (q) => q.eq('status', 'active'))
      .collect();

    // Sort by order field
    return consultants.sort((a, b) => a.order - b.order);
  }
});

// Get all consultants (admin only - includes inactive)
export const getAllConsultants = query({
  args: {},
  handler: async (ctx) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is an admin
    if (currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can access all consultants');
    }

    const consultants = await ctx.db.query('consultants').collect();

    // Sort by order field
    return consultants.sort((a, b) => a.order - b.order);
  }
});

// Get consultant by ID
export const getConsultantById = query({
  args: { consultantId: v.id('consultants') },
  handler: async (ctx, args) => {
    const consultant = await ctx.db.get(args.consultantId);
    if (!consultant) return null;

    // If consultant is inactive, only admin can view
    if (consultant.status === 'inactive') {
      const currentUser = await getCurrentUserOrThrow(ctx);
      if (currentUser.role !== 'admin') {
        throw new Error('Unauthorized: This consultant is not available');
      }
    }

    return consultant;
  }
});

// ==================== CONSULTANTS MUTATIONS ====================

// Create consultant (admin only)
export const createConsultant = mutation({
  args: {
    title: v.string(),
    subtitle: v.string(),
    description: v.string(),
    color: v.string(),
    includes: v.array(v.string()),
    technologies: v.array(v.string()),
    illustration: v.optional(v.string()),
    status: v.union(v.literal('active'), v.literal('inactive')),
    order: v.number()
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is an admin
    if (currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can create consultants');
    }

    const now = Date.now();
    return await ctx.db.insert('consultants', {
      title: args.title,
      subtitle: args.subtitle,
      description: args.description,
      color: args.color,
      includes: args.includes,
      technologies: args.technologies,
      illustration: args.illustration,
      status: args.status,
      order: args.order,
      createdAt: now,
      updatedAt: now
    });
  }
});

// Update consultant (admin only)
export const updateConsultant = mutation({
  args: {
    consultantId: v.id('consultants'),
    title: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    includes: v.optional(v.array(v.string())),
    technologies: v.optional(v.array(v.string())),
    illustration: v.optional(v.string()),
    status: v.optional(v.union(v.literal('active'), v.literal('inactive'))),
    order: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is an admin
    if (currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can update consultants');
    }

    const consultant = await ctx.db.get(args.consultantId);
    if (!consultant) {
      throw new Error('Consultant not found');
    }

    // Build update object with only provided fields
    const updateData: any = {
      updatedAt: Date.now()
    };

    if (args.title !== undefined) updateData.title = args.title;
    if (args.subtitle !== undefined) updateData.subtitle = args.subtitle;
    if (args.description !== undefined)
      updateData.description = args.description;
    if (args.color !== undefined) updateData.color = args.color;
    if (args.includes !== undefined) updateData.includes = args.includes;
    if (args.technologies !== undefined)
      updateData.technologies = args.technologies;
    if (args.illustration !== undefined)
      updateData.illustration = args.illustration;
    if (args.status !== undefined) updateData.status = args.status;
    if (args.order !== undefined) updateData.order = args.order;

    await ctx.db.patch(args.consultantId, updateData);

    return await ctx.db.get(args.consultantId);
  }
});

// Delete consultant (admin only)
export const deleteConsultant = mutation({
  args: { consultantId: v.id('consultants') },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is an admin
    if (currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can delete consultants');
    }

    const consultant = await ctx.db.get(args.consultantId);
    if (!consultant) {
      throw new Error('Consultant not found');
    }

    // Check if there are any requests for this consultant
    const requests = await ctx.db
      .query('consultantRequests')
      .withIndex('by_consultantId', (q) =>
        q.eq('consultantId', args.consultantId)
      )
      .collect();

    if (requests.length > 0) {
      throw new Error(
        'Cannot delete consultant: There are existing requests for this consultant'
      );
    }

    await ctx.db.delete(args.consultantId);
    return { success: true };
  }
});

// ==================== CONSULTANT REQUESTS QUERIES ====================

// Get all consultant requests (admin only)
export const getConsultantRequests = query({
  args: {
    status: v.optional(
      v.union(
        v.literal('pending'),
        v.literal('in_progress'),
        v.literal('completed'),
        v.literal('cancelled')
      )
    ),
    consultantId: v.optional(v.id('consultants'))
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is an admin
    if (currentUser.role !== 'admin') {
      throw new Error(
        'Unauthorized: Only admins can access all consultant requests'
      );
    }

    // Get requests with filters
    let requests;
    if (args.status) {
      requests = await ctx.db
        .query('consultantRequests')
        .withIndex('by_status', (q) => q.eq('status', args.status!))
        .collect();
    } else {
      requests = await ctx.db.query('consultantRequests').collect();
    }

    // Apply consultant filter if provided
    let filtered = requests;
    if (args.consultantId) {
      filtered = filtered.filter((r) => r.consultantId === args.consultantId);
    }

    // Enrich with user and consultant data
    const enriched = await Promise.all(
      filtered.map(async (request) => {
        const user = await ctx.db.get(request.userId);
        const consultant = await ctx.db.get(request.consultantId);

        return {
          ...request,
          user,
          consultant
        };
      })
    );

    return enriched.sort((a, b) => b.createdAt - a.createdAt);
  }
});

// Get consultant requests by current user (student/expert)
export const getConsultantRequestsByUser = query({
  args: {},
  handler: async (ctx) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is student or expert
    if (currentUser.role !== 'student' && currentUser.role !== 'expert') {
      throw new Error(
        'Unauthorized: Only students and experts can access their consultant requests'
      );
    }

    const requests = await ctx.db
      .query('consultantRequests')
      .withIndex('by_userId', (q) => q.eq('userId', currentUser._id))
      .collect();

    // Enrich with consultant data
    const enriched = await Promise.all(
      requests.map(async (request) => {
        const consultant = await ctx.db.get(request.consultantId);

        return {
          ...request,
          consultant
        };
      })
    );

    return enriched.sort((a, b) => b.createdAt - a.createdAt);
  }
});

// Get consultant request by ID
export const getConsultantRequestById = query({
  args: { requestId: v.id('consultantRequests') },
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.requestId);
    if (!request) return null;

    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Check authorization: admin can see all, user can only see their own requests
    if (currentUser.role !== 'admin' && request.userId !== currentUser._id) {
      throw new Error(
        'Unauthorized: You can only view your own consultant requests'
      );
    }

    // Enrich with user and consultant data
    const user = await ctx.db.get(request.userId);
    const consultant = await ctx.db.get(request.consultantId);

    return {
      ...request,
      user,
      consultant
    };
  }
});

// ==================== CONSULTANT REQUESTS MUTATIONS ====================

// Create consultant request (student/expert only)
export const createConsultantRequest = mutation({
  args: {
    consultantId: v.id('consultants'),
    message: v.string(),
    phone: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is student or expert
    if (currentUser.role !== 'student' && currentUser.role !== 'expert') {
      throw new Error(
        'Only students and experts can create consultant requests'
      );
    }

    // Verify consultant exists and is active
    const consultant = await ctx.db.get(args.consultantId);
    if (!consultant) {
      throw new Error('Consultant not found');
    }

    if (consultant.status !== 'active') {
      throw new Error('This consultant service is not available');
    }

    const now = Date.now();
    return await ctx.db.insert('consultantRequests', {
      userId: currentUser._id,
      consultantId: args.consultantId,
      message: args.message,
      phone: args.phone,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    });
  }
});

// Update consultant request status (admin only)
export const updateConsultantRequestStatus = mutation({
  args: {
    requestId: v.id('consultantRequests'),
    status: v.union(
      v.literal('pending'),
      v.literal('in_progress'),
      v.literal('completed'),
      v.literal('cancelled')
    )
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is an admin
    if (currentUser.role !== 'admin') {
      throw new Error(
        'Unauthorized: Only admins can update consultant request status'
      );
    }

    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new Error('Consultant request not found');
    }

    await ctx.db.patch(args.requestId, {
      status: args.status,
      updatedAt: Date.now()
    });

    return await ctx.db.get(args.requestId);
  }
});

// Update consultant request admin notes (admin only)
export const updateConsultantRequestNotes = mutation({
  args: {
    requestId: v.id('consultantRequests'),
    adminNotes: v.string()
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is an admin
    if (currentUser.role !== 'admin') {
      throw new Error(
        'Unauthorized: Only admins can update consultant request notes'
      );
    }

    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new Error('Consultant request not found');
    }

    await ctx.db.patch(args.requestId, {
      adminNotes: args.adminNotes,
      updatedAt: Date.now()
    });

    return await ctx.db.get(args.requestId);
  }
});

// Update consultant request (admin can update status and notes together)
export const updateConsultantRequest = mutation({
  args: {
    requestId: v.id('consultantRequests'),
    status: v.optional(
      v.union(
        v.literal('pending'),
        v.literal('in_progress'),
        v.literal('completed'),
        v.literal('cancelled')
      )
    ),
    adminNotes: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is an admin
    if (currentUser.role !== 'admin') {
      throw new Error(
        'Unauthorized: Only admins can update consultant requests'
      );
    }

    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new Error('Consultant request not found');
    }

    // Build update object with only provided fields
    const updateData: any = {
      updatedAt: Date.now()
    };

    if (args.status !== undefined) updateData.status = args.status;
    if (args.adminNotes !== undefined) updateData.adminNotes = args.adminNotes;

    await ctx.db.patch(args.requestId, updateData);

    return await ctx.db.get(args.requestId);
  }
});

// Delete consultant request (admin only)
export const deleteConsultantRequest = mutation({
  args: { requestId: v.id('consultantRequests') },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is an admin
    if (currentUser.role !== 'admin') {
      throw new Error(
        'Unauthorized: Only admins can delete consultant requests'
      );
    }

    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new Error('Consultant request not found');
    }

    await ctx.db.delete(args.requestId);
    return { success: true };
  }
});
