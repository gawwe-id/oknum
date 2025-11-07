import {
  query,
  mutation,
  action,
  internalQuery,
  internalMutation,
} from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { getCurrentUserOrThrow } from "./auth";
import { Id } from "./_generated/dataModel";

// Get payment by booking ID
export const getPaymentByBooking = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_bookingId", (q) => q.eq("bookingId", args.bookingId))
      .first();
  },
});

// Get payment by ID
export const getPaymentById = query({
  args: { paymentId: v.id("payments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.paymentId);
  },
});

// Create payment (initialize payment)
export const createPayment = mutation({
  args: {
    bookingId: v.id("bookings"),
    amount: v.number(),
    currency: v.string(),
    paymentMethod: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify booking exists
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Check if payment already exists
    const existing = await ctx.db
      .query("payments")
      .withIndex("by_bookingId", (q) => q.eq("bookingId", args.bookingId))
      .first();

    if (existing && existing.status === "pending") {
      return existing._id; // Return existing pending payment
    }

    const now = Date.now();
    const paymentId = await ctx.db.insert("payments", {
      bookingId: args.bookingId,
      amount: args.amount,
      currency: args.currency,
      paymentMethod: args.paymentMethod,
      paymentGateway: "duitku",
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    // Update booking with payment ID
    await ctx.db.patch(args.bookingId, {
      paymentId,
    });

    return paymentId;
  },
});

// Update payment status (called from webhook or after payment initiation)
export const updatePaymentStatus = mutation({
  args: {
    paymentId: v.id("payments"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("success"),
      v.literal("failed"),
      v.literal("expired")
    ),
    gatewayTransactionId: v.optional(v.string()),
    duitkuReference: v.optional(v.string()),
    paymentUrl: v.optional(v.string()),
    paidAt: v.optional(v.number()),
    failureReason: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { paymentId, ...updates } = args;
    const existing = await ctx.db.get(paymentId);
    if (!existing) {
      throw new Error("Payment not found");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.gatewayTransactionId !== undefined)
      updateData.gatewayTransactionId = updates.gatewayTransactionId;
    if (updates.duitkuReference !== undefined)
      updateData.duitkuReference = updates.duitkuReference;
    if (updates.paymentUrl !== undefined)
      updateData.paymentUrl = updates.paymentUrl;
    if (updates.paidAt !== undefined) updateData.paidAt = updates.paidAt;
    if (updates.failureReason !== undefined)
      updateData.failureReason = updates.failureReason;
    if (updates.metadata !== undefined) updateData.metadata = updates.metadata;

    await ctx.db.patch(paymentId, updateData);

    // If payment is successful, update booking status
    if (updates.status === "success") {
      const booking = await ctx.db.get(existing.bookingId);
      if (booking) {
        await ctx.db.patch(existing.bookingId, {
          paymentStatus: "paid",
          status: "confirmed",
        });
      }
    } else if (updates.status === "failed" || updates.status === "expired") {
      const booking = await ctx.db.get(existing.bookingId);
      if (booking) {
        await ctx.db.patch(existing.bookingId, {
          paymentStatus: "failed",
        });
      }
    }

    return await ctx.db.get(paymentId);
  },
});

// Internal query for getting payment by ID (used in actions and http routes)
export const getPaymentByIdInternal = internalQuery({
  args: { paymentId: v.id("payments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.paymentId);
  },
});

// Internal mutation for updating payment status (used in http routes/webhooks)
export const updatePaymentStatusInternal = internalMutation({
  args: {
    paymentId: v.id("payments"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("success"),
      v.literal("failed"),
      v.literal("expired")
    ),
    gatewayTransactionId: v.optional(v.string()),
    duitkuReference: v.optional(v.string()),
    paymentUrl: v.optional(v.string()),
    paidAt: v.optional(v.number()),
    failureReason: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { paymentId, ...updates } = args;
    const existing = await ctx.db.get(paymentId);
    if (!existing) {
      throw new Error("Payment not found");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.gatewayTransactionId !== undefined)
      updateData.gatewayTransactionId = updates.gatewayTransactionId;
    if (updates.duitkuReference !== undefined)
      updateData.duitkuReference = updates.duitkuReference;
    if (updates.paymentUrl !== undefined)
      updateData.paymentUrl = updates.paymentUrl;
    if (updates.paidAt !== undefined) updateData.paidAt = updates.paidAt;
    if (updates.failureReason !== undefined)
      updateData.failureReason = updates.failureReason;
    if (updates.metadata !== undefined) updateData.metadata = updates.metadata;

    await ctx.db.patch(paymentId, updateData);

    // If payment is successful, update booking status
    if (updates.status === "success") {
      const booking = await ctx.db.get(existing.bookingId);
      if (booking) {
        await ctx.db.patch(existing.bookingId, {
          paymentStatus: "paid",
          status: "confirmed",
        });
      }
    } else if (updates.status === "failed" || updates.status === "expired") {
      const booking = await ctx.db.get(existing.bookingId);
      if (booking) {
        await ctx.db.patch(existing.bookingId, {
          paymentStatus: "failed",
        });
      }
    }

    return await ctx.db.get(paymentId);
  },
});

// Get revenue for current expert (list and total)
export const getExpertRevenue = query({
  args: {},
  handler: async (ctx) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is an expert
    if (currentUser.role !== "expert") {
      throw new Error("Unauthorized: Only experts can access this query");
    }

    // Get expert record
    if (!currentUser.expertId) {
      return {
        revenue: [],
        totalRevenue: {},
        totalTransactions: 0,
      };
    }

    const expert = await ctx.db.get(currentUser.expertId);
    if (!expert) {
      return {
        revenue: [],
        totalRevenue: {},
        totalTransactions: 0,
      };
    }

    // Get all classes by this expert
    const classes = await ctx.db
      .query("classes")
      .withIndex("by_expertId", (q) => q.eq("expertId", expert._id))
      .collect();

    if (classes.length === 0) {
      return {
        revenue: [],
        totalRevenue: {},
        totalTransactions: 0,
      };
    }

    const classIds = classes.map((c) => c._id);
    const classMap = new Map(classIds.map((id, i) => [id, classes[i]]));

    // Get all bookings for these classes with paymentStatus = "paid"
    const allBookings = await Promise.all(
      classIds.map(async (classId) => {
        return await ctx.db
          .query("bookings")
          .withIndex("by_classId", (q) => q.eq("classId", classId))
          .collect();
      })
    );

    const bookings = allBookings
      .flat()
      .filter((booking) => booking.paymentStatus === "paid");

    if (bookings.length === 0) {
      return {
        revenue: [],
        totalRevenue: {},
        totalTransactions: 0,
      };
    }

    // Get all payments with status = "success" for these bookings
    const revenueItems = await Promise.all(
      bookings.map(async (booking) => {
        if (!booking.paymentId) return null;

        const payment = await ctx.db.get(booking.paymentId);
        if (!payment || payment.status !== "success") return null;

        const classItem = classMap.get(booking.classId);
        const student = await ctx.db.get(booking.userId);

        return {
          paymentId: payment._id,
          bookingId: booking._id,
          classId: booking.classId,
          className: classItem?.title || "Unknown Class",
          studentId: booking.userId,
          studentName: student?.name || "Unknown Student",
          studentEmail: student?.email || "",
          amount: payment.amount,
          currency: payment.currency,
          paymentMethod: payment.paymentMethod,
          paidAt: payment.paidAt || payment.createdAt,
          createdAt: payment.createdAt,
          gatewayTransactionId: payment.gatewayTransactionId,
        };
      })
    );

    // Filter out null values
    const revenue = revenueItems.filter((item) => item !== null);

    // Calculate total revenue (group by currency)
    const totalByCurrency = new Map<string, number>();
    revenue.forEach((item) => {
      if (item) {
        const current = totalByCurrency.get(item.currency) || 0;
        totalByCurrency.set(item.currency, current + item.amount);
      }
    });

    // Convert Map to object for easier frontend usage
    const totalRevenueObj: Record<string, number> = {};
    totalByCurrency.forEach((value, key) => {
      totalRevenueObj[key] = value;
    });

    // Sort by paidAt (most recent first)
    revenue.sort((a, b) => (b?.paidAt || 0) - (a?.paidAt || 0));

    return {
      revenue,
      totalRevenue: totalRevenueObj,
      totalTransactions: revenue.length,
    };
  },
});

// Get revenue for admin (all payments from all classes that are paid)
export const getAdminRevenue = query({
  args: {},
  handler: async (ctx) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is an admin
    if (currentUser.role !== "admin") {
      throw new Error("Unauthorized: Only admins can access this query");
    }

    // Get all payments with status = "success"
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_status", (q) => q.eq("status", "success"))
      .collect();

    if (payments.length === 0) {
      return {
        revenue: [],
        totalRevenue: {},
        totalTransactions: 0,
      };
    }

    // Get booking and class info for each payment
    const revenueItems = await Promise.all(
      payments.map(async (payment) => {
        const booking = await ctx.db.get(payment.bookingId);
        if (!booking) return null;

        const classItem = await ctx.db.get(booking.classId);
        if (!classItem) return null;

        const expert = await ctx.db.get(classItem.expertId);
        const student = await ctx.db.get(booking.userId);

        return {
          paymentId: payment._id,
          bookingId: booking._id,
          classId: booking.classId,
          className: classItem.title,
          expertId: classItem.expertId,
          expertName: expert?.name || "Unknown Expert",
          expertEmail: expert?.email || "",
          studentId: booking.userId,
          studentName: student?.name || "Unknown Student",
          studentEmail: student?.email || "",
          amount: payment.amount,
          currency: payment.currency,
          paymentMethod: payment.paymentMethod,
          paidAt: payment.paidAt || payment.createdAt,
          createdAt: payment.createdAt,
          gatewayTransactionId: payment.gatewayTransactionId,
        };
      })
    );

    // Filter out null values
    const revenue = revenueItems.filter((item) => item !== null);

    // Calculate total revenue (group by currency)
    const totalByCurrency = new Map<string, number>();
    revenue.forEach((item) => {
      if (item) {
        const current = totalByCurrency.get(item.currency) || 0;
        totalByCurrency.set(item.currency, current + item.amount);
      }
    });

    // Convert Map to object for easier frontend usage
    const totalRevenueObj: Record<string, number> = {};
    totalByCurrency.forEach((value, key) => {
      totalRevenueObj[key] = value;
    });

    // Sort by paidAt (most recent first)
    revenue.sort((a, b) => (b?.paidAt || 0) - (a?.paidAt || 0));

    return {
      revenue,
      totalRevenue: totalRevenueObj,
      totalTransactions: revenue.length,
    };
  },
});
