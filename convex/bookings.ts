import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get bookings by user (requires auth)
export const getBookingsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Enrich with class and schedule data
    const enriched = await Promise.all(
      bookings.map(async (booking) => {
        const classItem = await ctx.db.get(booking.classId);
        const schedules = await Promise.all(
          booking.scheduleIds.map((id) => ctx.db.get(id))
        );

        return {
          ...booking,
          classItem,
          schedules: schedules.filter((s) => s !== null),
        };
      })
    );

    return enriched.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get booking by ID
export const getBookingById = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) return null;

    const classItem = await ctx.db.get(booking.classId);
    const schedules = await Promise.all(
      booking.scheduleIds.map((id) => ctx.db.get(id))
    );
    const payment = booking.paymentId ? await ctx.db.get(booking.paymentId) : null;

    return {
      ...booking,
      classItem,
      schedules: schedules.filter((s) => s !== null),
      payment,
    };
  },
});

// Create booking (requires userId, can book multiple sessions)
export const createBooking = mutation({
  args: {
    userId: v.id("users"),
    classId: v.id("classes"),
    scheduleIds: v.array(v.id("schedules")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verify user exists
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify class exists
    const classItem = await ctx.db.get(args.classId);
    if (!classItem) {
      throw new Error("Class not found");
    }

    if (classItem.status !== "published") {
      throw new Error("Class is not available for booking");
    }

    // Verify all schedules exist and belong to the class
    const schedules = await Promise.all(
      args.scheduleIds.map(async (id) => {
        const schedule = await ctx.db.get(id);
        if (!schedule) {
          throw new Error(`Schedule ${id} not found`);
        }
        if (schedule.classId !== args.classId) {
          throw new Error(`Schedule ${id} does not belong to this class`);
        }
        if (schedule.status !== "upcoming") {
          throw new Error(`Schedule ${id} is not available for booking`);
        }
        // Check capacity
        if (schedule.bookedSeats >= schedule.capacity) {
          throw new Error(`Schedule ${id} is fully booked`);
        }
        return schedule;
      })
    );

    // Calculate total amount (price per class, not per session)
    const totalAmount = classItem.price;
    const sessionNumbers = schedules.map((s) => s.sessionNumber);

    // Create booking
    const bookingId = await ctx.db.insert("bookings", {
      userId: args.userId,
      classId: args.classId,
      scheduleIds: args.scheduleIds,
      sessionNumbers,
      status: "pending",
      paymentStatus: "pending",
      totalAmount,
      currency: classItem.currency,
      bookingDate: Date.now(),
      notes: args.notes,
      createdAt: Date.now(),
    });

    // Reserve seats for each schedule (will be confirmed when payment is successful)
    // Note: We don't increment bookedSeats here - only when payment is confirmed
    // This prevents double-booking if payment fails

    return bookingId;
  },
});

// Update booking status
export const updateBookingStatus = mutation({
  args: {
    bookingId: v.id("bookings"),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("cancelled"),
        v.literal("completed")
      )
    ),
    paymentStatus: v.optional(
      v.union(v.literal("pending"), v.literal("paid"), v.literal("failed"), v.literal("refunded"))
    ),
    paymentId: v.optional(v.id("payments")),
  },
  handler: async (ctx, args) => {
    const { bookingId, ...updates } = args;
    const existing = await ctx.db.get(bookingId);
    if (!existing) {
      throw new Error("Booking not found");
    }

    const updateData: any = {};

    if (updates.status !== undefined) {
      updateData.status = updates.status;
      // If booking is confirmed and payment is paid, increment booked seats
      if (updates.status === "confirmed" && existing.paymentStatus === "paid") {
        const schedules = await Promise.all(
          existing.scheduleIds.map((id) => ctx.db.get(id))
        );
        for (const schedule of schedules) {
          if (schedule) {
            const newBookedSeats = schedule.bookedSeats + 1;
            if (newBookedSeats <= schedule.capacity) {
              await ctx.db.patch(schedule._id, {
                bookedSeats: newBookedSeats,
              });
            }
          }
        }
      }
    }

    if (updates.paymentStatus !== undefined) {
      updateData.paymentStatus = updates.paymentStatus;
      // If payment is confirmed, also confirm booking
      if (updates.paymentStatus === "paid" && existing.status === "pending") {
        updateData.status = "confirmed";
        // Increment booked seats
        const schedules = await Promise.all(
          existing.scheduleIds.map((id) => ctx.db.get(id))
        );
        for (const schedule of schedules) {
          if (schedule) {
            const newBookedSeats = schedule.bookedSeats + 1;
            if (newBookedSeats <= schedule.capacity) {
              await ctx.db.patch(schedule._id, {
                bookedSeats: newBookedSeats,
              });
            }
          }
        }
      }
    }

    if (updates.paymentId !== undefined) {
      updateData.paymentId = updates.paymentId;
    }

    await ctx.db.patch(bookingId, updateData);
    return await ctx.db.get(bookingId);
  },
});

// Internal query for getting booking by ID (used in actions)
export const getBookingByIdInternal = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) return null;

    const classItem = await ctx.db.get(booking.classId);
    const schedules = await Promise.all(
      booking.scheduleIds.map((id) => ctx.db.get(id))
    );

    return {
      ...booking,
      classItem,
      schedules: schedules.filter((s) => s !== null),
    };
  },
});

