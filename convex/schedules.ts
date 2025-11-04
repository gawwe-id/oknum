import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get schedules by class (sorted by sessionNumber)
export const getSchedulesByClass = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    const schedules = await ctx.db
      .query("schedules")
      .withIndex("by_classId", (q) => q.eq("classId", args.classId))
      .collect();

    return schedules.sort((a, b) => a.sessionNumber - b.sessionNumber);
  },
});

// Get schedule by ID
export const getScheduleById = query({
  args: { scheduleId: v.id("schedules") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.scheduleId);
  },
});

// Get upcoming schedules
export const getUpcomingSchedules = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const schedules = await ctx.db
      .query("schedules")
      .withIndex("by_status", (q) => q.eq("status", "upcoming"))
      .collect();

    const now = new Date().toISOString();
    const upcoming = schedules
      .filter((s) => s.startDate >= now)
      .sort((a, b) => a.startDate.localeCompare(b.startDate));

    return args.limit ? upcoming.slice(0, args.limit) : upcoming;
  },
});

// Create schedule (support multi-session)
export const createSchedule = mutation({
  args: {
    classId: v.id("classes"),
    sessionNumber: v.number(),
    sessionTitle: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    timezone: v.string(),
    location: v.object({
      type: v.union(v.literal("offline"), v.literal("online"), v.literal("hybrid")),
      address: v.optional(v.string()),
      city: v.optional(v.string()),
      province: v.optional(v.string()),
      coordinates: v.optional(
        v.object({
          lat: v.number(),
          lng: v.number(),
        })
      ),
      onlineLink: v.optional(v.string()),
      platform: v.optional(v.string()),
    }),
    capacity: v.number(),
  },
  handler: async (ctx, args) => {
    // Verify class exists
    const classItem = await ctx.db.get(args.classId);
    if (!classItem) {
      throw new Error("Class not found");
    }

    // Check if session number already exists for this class
    const existing = await ctx.db
      .query("schedules")
      .withIndex("by_classId_sessionNumber", (q) =>
        q.eq("classId", args.classId).eq("sessionNumber", args.sessionNumber)
      )
      .first();

    if (existing) {
      throw new Error(`Session ${args.sessionNumber} already exists for this class`);
    }

    return await ctx.db.insert("schedules", {
      classId: args.classId,
      sessionNumber: args.sessionNumber,
      sessionTitle: args.sessionTitle,
      startDate: args.startDate,
      endDate: args.endDate,
      startTime: args.startTime,
      endTime: args.endTime,
      timezone: args.timezone,
      location: args.location,
      capacity: args.capacity,
      bookedSeats: 0,
      status: "upcoming",
      createdAt: Date.now(),
    });
  },
});

// Update schedule
export const updateSchedule = mutation({
  args: {
    scheduleId: v.id("schedules"),
    sessionTitle: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    timezone: v.optional(v.string()),
    location: v.optional(
      v.object({
        type: v.union(v.literal("offline"), v.literal("online"), v.literal("hybrid")),
        address: v.optional(v.string()),
        city: v.optional(v.string()),
        province: v.optional(v.string()),
        coordinates: v.optional(
          v.object({
            lat: v.number(),
            lng: v.number(),
          })
        ),
        onlineLink: v.optional(v.string()),
        platform: v.optional(v.string()),
      })
    ),
    capacity: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("upcoming"),
        v.literal("ongoing"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
  },
  handler: async (ctx, args) => {
    const { scheduleId, ...updates } = args;
    const existing = await ctx.db.get(scheduleId);
    if (!existing) {
      throw new Error("Schedule not found");
    }

    const updateData: any = {};

    if (updates.sessionTitle !== undefined) updateData.sessionTitle = updates.sessionTitle;
    if (updates.startDate !== undefined) updateData.startDate = updates.startDate;
    if (updates.endDate !== undefined) updateData.endDate = updates.endDate;
    if (updates.startTime !== undefined) updateData.startTime = updates.startTime;
    if (updates.endTime !== undefined) updateData.endTime = updates.endTime;
    if (updates.timezone !== undefined) updateData.timezone = updates.timezone;
    if (updates.location !== undefined) updateData.location = updates.location;
    if (updates.capacity !== undefined) updateData.capacity = updates.capacity;
    if (updates.status !== undefined) updateData.status = updates.status;

    await ctx.db.patch(scheduleId, updateData);
    return await ctx.db.get(scheduleId);
  },
});

// Increment booked seats (called when booking is created)
export const incrementBookedSeats = mutation({
  args: {
    scheduleId: v.id("schedules"),
    seats: v.number(),
  },
  handler: async (ctx, args) => {
    const schedule = await ctx.db.get(args.scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    const newBookedSeats = schedule.bookedSeats + args.seats;
    if (newBookedSeats > schedule.capacity) {
      throw new Error("Not enough seats available");
    }

    await ctx.db.patch(args.scheduleId, {
      bookedSeats: newBookedSeats,
    });
  },
});

