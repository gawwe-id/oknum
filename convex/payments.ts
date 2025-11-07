import {
  query,
  mutation,
  action,
  internalQuery,
  internalMutation,
} from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

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

// Initiate Duitku payment (action - can make HTTP calls)
// export const initiateDuitkuPayment = action({
//   args: {
//     paymentId: v.id("payments"),
//     customerName: v.string(),
//     customerEmail: v.string(),
//     customerPhone: v.optional(v.string()),
//     returnUrl: v.string(),
//     callbackUrl: v.string(),
//   },
//   handler: async (ctx, args) => {
//     // Get payment and booking details
//     const payment = await ctx.runQuery(internal.payments.getPaymentByIdInternal, {
//       paymentId: args.paymentId,
//     });

//     if (!payment) {
//       throw new Error("Payment not found");
//     }

//     const booking = await ctx.runQuery(internal.bookings.getBookingByIdInternal, {
//       bookingId: payment.bookingId,
//     });

//     if (!booking) {
//       throw new Error("Booking not found");
//     }

//     // Get Duitku API credentials from environment
//     const merchantCode = process.env.DUITKU_MERCHANT_CODE;
//     const apiKey = process.env.DUITKU_API_KEY;
//     const baseUrl = process.env.DUITKU_BASE_URL || "https://api.duitku.com";

//     if (!merchantCode || !apiKey) {
//       throw new Error("Duitku credentials not configured");
//     }

//     // Prepare Duitku payment request
//     const paymentRequest = {
//       merchantCode,
//       paymentAmount: payment.amount,
//       merchantOrderId: payment._id,
//       productDetails: `Booking for ${booking.classItem?.title || "Class"}`,
//       customerVaName: args.customerName,
//       customerEmail: args.customerEmail,
//       customerPhone: args.customerPhone || "",
//       callbackUrl: args.callbackUrl,
//       returnUrl: args.returnUrl,
//       paymentMethod: payment.paymentMethod,
//       signature: "", // Will be calculated below
//     };

//     // Calculate signature (MD5 hash)
//     // In Convex actions, we can use Node.js crypto module
//     const crypto = require("crypto");
//     const signatureString = `${merchantCode}${paymentRequest.merchantOrderId}${payment.amount}${apiKey}`;
//     const signatureHex = crypto.createHash("md5").update(signatureString).digest("hex");
//     paymentRequest.signature = signatureHex;

//     // Make request to Duitku API
//     const response = await fetch(`${baseUrl}/api/merchant/v2/inquiry`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(paymentRequest),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Duitku API error: ${errorText}`);
//     }

//     const result = await response.json();

//     // Update payment with Duitku response
//     await ctx.runMutation(internal.payments.updatePaymentStatus, {
//       paymentId: args.paymentId,
//       status: result.statusCode === "00" ? "processing" : "failed",
//       gatewayTransactionId: result.reference,
//       duitkuReference: result.reference,
//       paymentUrl: result.paymentUrl,
//       metadata: result,
//     });

//     return {
//       paymentUrl: result.paymentUrl,
//       reference: result.reference,
//       status: result.statusCode === "00" ? "processing" : "failed",
//     };
//   },
// });

// Process Duitku webhook (action - can make HTTP calls)
// export const processDuitkuWebhook = action({
//   args: {
//     merchantCode: v.string(),
//     merchantOrderId: v.string(),
//     reference: v.string(),
//     amount: v.number(),
//     statusCode: v.string(),
//     statusMessage: v.string(),
//     signature: v.string(),
//   },
//   handler: async (ctx, args) => {
//     // Verify signature
//     const apiKey = process.env.DUITKU_API_KEY;
//     if (!apiKey) {
//       throw new Error("Duitku API key not configured");
//     }

//     const crypto = require("crypto");
//     const signatureString = `${args.merchantCode}${args.merchantOrderId}${args.amount}${apiKey}`;
//     const expectedSignatureHex = crypto.createHash("md5").update(signatureString).digest("hex");

//     if (args.signature !== expectedSignatureHex) {
//       throw new Error("Invalid signature");
//     }

//     // Get payment by ID (merchantOrderId is paymentId)
//     const paymentId = args.merchantOrderId as any;
//     const payment = await ctx.runQuery(internal.payments.getPaymentById, {
//       paymentId,
//     });

//     if (!payment) {
//       throw new Error("Payment not found");
//     }

//     // Update payment status based on Duitku response
//     let paymentStatus: "pending" | "processing" | "success" | "failed" | "expired" = "pending";
//     if (args.statusCode === "00") {
//       paymentStatus = "success";
//     } else if (args.statusCode === "01") {
//       paymentStatus = "processing";
//     } else {
//       paymentStatus = "failed";
//     }

//     await ctx.runMutation(internal.payments.updatePaymentStatus, {
//       paymentId,
//       status: paymentStatus,
//       gatewayTransactionId: args.reference,
//       duitkuReference: args.reference,
//       paidAt: paymentStatus === "success" ? Date.now() : undefined,
//       failureReason: paymentStatus === "failed" ? args.statusMessage : undefined,
//       metadata: {
//         statusCode: args.statusCode,
//         statusMessage: args.statusMessage,
//         webhookReceivedAt: Date.now(),
//       },
//     });

//     return { success: true };
//   },
// });

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
