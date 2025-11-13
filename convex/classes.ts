import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { getCurrentUserOrThrow } from './auth';

// ==================== PUBLIC QUERIES (for landing page) ====================

// Get published classes for public landing page (no auth required)
export const getPublishedClassesPublic = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    // Get only published classes
    let classes = await ctx.db
      .query('classes')
      .withIndex('by_status', (q) => q.eq('status', 'published'))
      .collect();

    // Filter by category if provided
    if (args.category) {
      classes = classes.filter((c) => c.category === args.category);
    }

    // Limit results if provided
    if (args.limit) {
      classes = classes.slice(0, args.limit);
    }

    // Enrich with expert data
    const enriched = await Promise.all(
      classes.map(async (classItem) => {
        const expert = await ctx.db.get(classItem.expertId);
        return {
          ...classItem,
          expert
        };
      })
    );

    return enriched;
  }
});

// Get all classes for public exclusive-class page (supports status filtering)
export const getAllClassesPublic = query({
  args: {
    status: v.optional(
      v.union(
        v.literal('draft'),
        v.literal('published'),
        v.literal('completed'),
        v.literal('cancelled')
      )
    )
  },
  handler: async (ctx, args) => {
    let classes;
    
    // If status is provided, filter by status
    if (args.status) {
      classes = await ctx.db
        .query('classes')
        .withIndex('by_status', (q) => q.eq('status', args.status!))
        .collect();
    } else {
      // Get all classes (for "All" tab)
      // We need to query each status separately since we can't query all at once
      const [published, draft, completed, cancelled] = await Promise.all([
        ctx.db.query('classes').withIndex('by_status', (q) => q.eq('status', 'published')).collect(),
        ctx.db.query('classes').withIndex('by_status', (q) => q.eq('status', 'draft')).collect(),
        ctx.db.query('classes').withIndex('by_status', (q) => q.eq('status', 'completed')).collect(),
        ctx.db.query('classes').withIndex('by_status', (q) => q.eq('status', 'cancelled')).collect(),
      ]);
      classes = [...published, ...draft, ...completed, ...cancelled];
    }

    // Enrich with expert data
    const enriched = await Promise.all(
      classes.map(async (classItem) => {
        const expert = await ctx.db.get(classItem.expertId);
        return {
          ...classItem,
          expert
        };
      })
    );

    return enriched;
  }
});

// Get unique categories from published classes (for badges)
export const getPublishedClassCategories = query({
  args: {},
  handler: async (ctx) => {
    // Use composite index for better performance
    // Query by status='published' and collect all categories
    const classes = await ctx.db
      .query('classes')
      .withIndex('by_status_category', (q) => q.eq('status', 'published'))
      .collect();

    // Get unique categories - use Set for O(n) deduplication
    const categorySet = new Set<string>();
    for (const classItem of classes) {
      categorySet.add(classItem.category);
    }
    
    // Convert to array and sort
    return Array.from(categorySet).sort();
  }
});

// Get all unique categories from all classes (for exclusive-class page tabs)
export const getAllClassCategories = query({
  args: {},
  handler: async (ctx) => {
    // Get all classes (all statuses)
    const [published, draft, completed, cancelled] = await Promise.all([
      ctx.db.query('classes').withIndex('by_status', (q) => q.eq('status', 'published')).collect(),
      ctx.db.query('classes').withIndex('by_status', (q) => q.eq('status', 'draft')).collect(),
      ctx.db.query('classes').withIndex('by_status', (q) => q.eq('status', 'completed')).collect(),
      ctx.db.query('classes').withIndex('by_status', (q) => q.eq('status', 'cancelled')).collect(),
    ]);
    const allClasses = [...published, ...draft, ...completed, ...cancelled];

    // Get unique categories
    const categories = Array.from(new Set(allClasses.map((c) => c.category)));
    return categories.sort();
  }
});

// ==================== PROTECTED QUERIES ====================

// Get classes with optional filters (default: published only, can filter by status)
export const getClasses = query({
  args: {
    category: v.optional(v.string()),
    type: v.optional(
      v.union(v.literal('offline'), v.literal('online'), v.literal('hybrid'))
    ),
    expertId: v.optional(v.id('experts')),
    status: v.optional(
      v.union(
        v.literal('draft'),
        v.literal('published'),
        v.literal('completed'),
        v.literal('cancelled')
      )
    )
  },
  handler: async (ctx, args) => {
    // Get classes - filter by status if provided, otherwise default to published (for backward compatibility)
    let classes;
    if (args.status) {
      classes = await ctx.db
        .query('classes')
        .withIndex('by_status', (q) => q.eq('status', args.status!))
        .collect();
    } else {
      // Default behavior: get published classes (for backward compatibility)
      classes = await ctx.db
        .query('classes')
        .withIndex('by_status', (q) => q.eq('status', 'published'))
        .collect();
    }

    // Apply filters
    let filtered = classes;
    if (args.category) {
      filtered = filtered.filter((c) => c.category === args.category);
    }
    if (args.type) {
      filtered = filtered.filter((c) => c.type === args.type);
    }
    if (args.expertId) {
      filtered = filtered.filter((c) => c.expertId === args.expertId);
    }

    // Enrich with expert and curriculum data
    const enriched = await Promise.all(
      filtered.map(async (classItem) => {
        const expert = await ctx.db.get(classItem.expertId);
        const curriculum = await ctx.db
          .query('curriculum')
          .withIndex('by_classId', (q) => q.eq('classId', classItem._id))
          .first();
        const schedules = await ctx.db
          .query('schedules')
          .withIndex('by_classId', (q) => q.eq('classId', classItem._id))
          .collect();

        return {
          ...classItem,
          expert,
          curriculum,
          schedules: schedules.sort((a, b) =>
            a.sessionNumber.localeCompare(b.sessionNumber)
          )
        };
      })
    );

    return enriched;
  }
});

// Get class by ID with full details
export const getClassById = query({
  args: { classId: v.id('classes') },
  handler: async (ctx, args) => {
    const classItem = await ctx.db.get(args.classId);
    if (!classItem) return null;

    const expert = await ctx.db.get(classItem.expertId);
    // Get user data for avatar
    let expertUser = null;
    if (expert) {
      expertUser = await ctx.db.get(expert.userId);
    }

    const curriculum = await ctx.db
      .query('curriculum')
      .withIndex('by_classId', (q) => q.eq('classId', args.classId))
      .first();
    const schedules = await ctx.db
      .query('schedules')
      .withIndex('by_classId', (q) => q.eq('classId', args.classId))
      .collect();

    return {
      ...classItem,
      expert: expert
        ? {
            ...expert,
            user: expertUser,
            // Include avatar from user table for easy access
            userAvatar: expertUser?.avatar
          }
        : null,
      curriculum,
      schedules: schedules.sort((a, b) =>
        a.sessionNumber.localeCompare(b.sessionNumber)
      )
    };
  }
});

// Get class by ID with all related data for public detail page
export const getClassByIdPublic = query({
  args: { classId: v.id('classes') },
  handler: async (ctx, args) => {
    const classItem = await ctx.db.get(args.classId);
    if (!classItem) return null;

    // Get expert data
    const expert = await ctx.db.get(classItem.expertId);
    let expertUser = null;
    if (expert) {
      expertUser = await ctx.db.get(expert.userId);
    }

    // Get curriculum
    const curriculum = await ctx.db
      .query('curriculum')
      .withIndex('by_classId', (q) => q.eq('classId', args.classId))
      .first();

    // Get schedules (sorted by sessionNumber)
    const schedules = await ctx.db
      .query('schedules')
      .withIndex('by_classId', (q) => q.eq('classId', args.classId))
      .collect();

    // Get benefits (sorted by order)
    const benefits = await ctx.db
      .query('benefits')
      .withIndex('by_classId', (q) => q.eq('classId', args.classId))
      .collect();

    // Get journey
    const journey = await ctx.db
      .query('journey')
      .withIndex('by_classId', (q) => q.eq('classId', args.classId))
      .first();

    // Get additional perks
    const additionalPerks = await ctx.db
      .query('additionalPerks')
      .withIndex('by_classId', (q) => q.eq('classId', args.classId))
      .collect();

    // Sort schedules by sessionNumber
    const sortedSchedules = schedules.sort((a, b) =>
      a.sessionNumber.localeCompare(b.sessionNumber)
    );

    // Sort benefits by order field
    const sortedBenefits = benefits.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      return a.createdAt - b.createdAt;
    });

    // Sort journey steps by order if journey exists
    const sortedJourney = journey
      ? {
          ...journey,
          steps: journey.steps.sort((a, b) => a.order - b.order)
        }
      : null;

    return {
      ...classItem,
      expert: expert
        ? {
            ...expert,
            user: expertUser,
            userAvatar: expertUser?.avatar
          }
        : null,
      curriculum,
      schedules: sortedSchedules,
      benefits: sortedBenefits,
      journey: sortedJourney,
      additionalPerks
    };
  }
});

// Get classes by expert
export const getClassesByExpert = query({
  args: { expertId: v.id('experts') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('classes')
      .withIndex('by_expertId', (q) => q.eq('expertId', args.expertId))
      .collect();
  }
});

// Get classes by current authenticated expert (for expert dashboard)
export const getClassesByCurrentExpert = query({
  args: {},
  handler: async (ctx) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is an expert
    if (currentUser.role !== 'expert') {
      throw new Error('Unauthorized: Only experts can access this query');
    }

    // Get expert record
    if (!currentUser.expertId) {
      return [];
    }

    const expert = await ctx.db.get(currentUser.expertId);
    if (!expert) {
      return [];
    }

    // Get all classes by this expert (all statuses)
    const classes = await ctx.db
      .query('classes')
      .withIndex('by_expertId', (q) => q.eq('expertId', expert._id))
      .collect();

    // Enrich with expert and curriculum data
    const enriched = await Promise.all(
      classes.map(async (classItem) => {
        const curriculum = await ctx.db
          .query('curriculum')
          .withIndex('by_classId', (q) => q.eq('classId', classItem._id))
          .first();
        const schedules = await ctx.db
          .query('schedules')
          .withIndex('by_classId', (q) => q.eq('classId', classItem._id))
          .collect();

        return {
          ...classItem,
          expert,
          curriculum,
          schedules: schedules.sort((a, b) =>
            a.sessionNumber.localeCompare(b.sessionNumber)
          )
        };
      })
    );

    return enriched.sort((a, b) => b.createdAt - a.createdAt);
  }
});

// Create class (expert creates class - requires authentication)
export const createClass = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    price: v.number(),
    currency: v.string(),
    type: v.union(
      v.literal('offline'),
      v.literal('online'),
      v.literal('hybrid')
    ),
    maxStudents: v.optional(v.number()),
    minStudents: v.optional(v.number()),
    duration: v.number(),
    thumbnail: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    status: v.union(
      v.literal('draft'),
      v.literal('published'),
      v.literal('completed'),
      v.literal('cancelled')
    )
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is an expert
    if (!currentUser.expertId) {
      throw new Error('Only experts can create classes');
    }

    // Verify expert exists
    const expert = await ctx.db.get(currentUser.expertId);
    if (!expert) {
      throw new Error('Expert profile not found');
    }

    const now = Date.now();
    return await ctx.db.insert('classes', {
      expertId: currentUser.expertId,
      title: args.title,
      description: args.description,
      category: args.category,
      price: args.price,
      currency: args.currency,
      type: args.type,
      maxStudents: args.maxStudents,
      minStudents: args.minStudents,
      duration: args.duration,
      thumbnail: args.thumbnail,
      images: args.images,
      status: args.status,
      createdAt: now,
      updatedAt: now
    });
  }
});

// Update class (requires authentication - can only update own classes unless admin)
export const updateClass = mutation({
  args: {
    classId: v.id('classes'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    price: v.optional(v.number()),
    type: v.optional(
      v.union(v.literal('offline'), v.literal('online'), v.literal('hybrid'))
    ),
    maxStudents: v.optional(v.number()),
    minStudents: v.optional(v.number()),
    duration: v.optional(v.number()),
    thumbnail: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    status: v.optional(
      v.union(
        v.literal('draft'),
        v.literal('published'),
        v.literal('completed'),
        v.literal('cancelled')
      )
    )
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    const { classId, ...updates } = args;
    const existing = await ctx.db.get(classId);
    if (!existing) {
      throw new Error('Class not found');
    }

    // Get the expert who owns this class
    const expert = await ctx.db.get(existing.expertId);
    if (!expert) {
      throw new Error('Expert not found for this class');
    }

    // Check if user owns the expert profile that owns this class, or is an admin
    if (expert.userId !== currentUser._id && currentUser.role !== 'admin') {
      throw new Error('Unauthorized: You can only update your own classes');
    }

    const updateData: any = {
      updatedAt: Date.now()
    };

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined)
      updateData.description = updates.description;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.maxStudents !== undefined)
      updateData.maxStudents = updates.maxStudents;
    if (updates.minStudents !== undefined)
      updateData.minStudents = updates.minStudents;
    if (updates.duration !== undefined) updateData.duration = updates.duration;
    if (updates.thumbnail !== undefined)
      updateData.thumbnail = updates.thumbnail;
    if (updates.images !== undefined) updateData.images = updates.images;
    if (updates.status !== undefined) updateData.status = updates.status;

    await ctx.db.patch(classId, updateData);
    return await ctx.db.get(classId);
  }
});

// Admin create class (admin can create class for any expert)
export const adminCreateClass = mutation({
  args: {
    expertId: v.id('experts'),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    price: v.number(),
    currency: v.string(),
    type: v.union(
      v.literal('offline'),
      v.literal('online'),
      v.literal('hybrid')
    ),
    maxStudents: v.optional(v.number()),
    minStudents: v.optional(v.number()),
    duration: v.number(),
    thumbnail: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    status: v.union(
      v.literal('draft'),
      v.literal('published'),
      v.literal('completed'),
      v.literal('cancelled')
    )
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is an admin
    if (currentUser.role !== 'admin') {
      throw new Error('Only admins can create classes for experts');
    }

    // Verify expert exists
    const expert = await ctx.db.get(args.expertId);
    if (!expert) {
      throw new Error('Expert profile not found');
    }

    const now = Date.now();
    return await ctx.db.insert('classes', {
      expertId: args.expertId,
      title: args.title,
      description: args.description,
      category: args.category,
      price: args.price,
      currency: args.currency,
      type: args.type,
      maxStudents: args.maxStudents,
      minStudents: args.minStudents,
      duration: args.duration,
      thumbnail: args.thumbnail,
      images: args.images,
      status: args.status,
      createdAt: now,
      updatedAt: now
    });
  }
});
