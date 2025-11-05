import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(), // Clerk user ID
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    role: v.union(
      v.literal("student"),
      v.literal("expert"),
      v.literal("admin")
    ),
    expertId: v.optional(v.id("experts")),
    avatar: v.optional(v.string()),
    emailVerified: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_expertId", ["expertId"]),

  experts: defineTable({
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    bio: v.string(),
    profileImage: v.optional(v.string()),
    specialization: v.array(v.string()),
    experience: v.string(),
    rating: v.optional(v.number()),
    totalStudents: v.optional(v.number()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"])
    .index("by_status", ["status"]),

  classes: defineTable({
    expertId: v.id("experts"),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    price: v.number(),
    currency: v.string(),
    type: v.union(
      v.literal("offline"),
      v.literal("online"),
      v.literal("hybrid")
    ),
    maxStudents: v.optional(v.number()),
    minStudents: v.optional(v.number()),
    duration: v.number(),
    thumbnail: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_expertId", ["expertId"])
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_type", ["type"]),

  curriculum: defineTable({
    classId: v.id("classes"),
    modules: v.array(
      v.object({
        order: v.number(),
        title: v.string(),
        description: v.string(),
        duration: v.number(),
        topics: v.array(v.string()),
      })
    ),
    learningObjectives: v.array(v.string()),
    prerequisites: v.optional(v.array(v.string())),
    materials: v.optional(v.array(v.string())),
  }).index("by_classId", ["classId"]),

  schedules: defineTable({
    classId: v.id("classes"),
    sessionNumber: v.number(),
    sessionTitle: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    timezone: v.string(),
    location: v.object({
      type: v.union(
        v.literal("offline"),
        v.literal("online"),
        v.literal("hybrid")
      ),
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
    bookedSeats: v.number(),
    status: v.union(
      v.literal("upcoming"),
      v.literal("ongoing"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    createdAt: v.number(),
  })
    .index("by_classId", ["classId"])
    .index("by_startDate", ["startDate"])
    .index("by_status", ["status"])
    .index("by_classId_sessionNumber", ["classId", "sessionNumber"]),

  bookings: defineTable({
    userId: v.id("users"),
    classId: v.id("classes"),
    scheduleIds: v.array(v.id("schedules")),
    sessionNumbers: v.array(v.number()),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed")
    ),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    paymentId: v.optional(v.id("payments")),
    totalAmount: v.number(),
    currency: v.string(),
    bookingDate: v.number(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_classId", ["classId"])
    .index("by_paymentStatus", ["paymentStatus"])
    .index("by_status", ["status"]),

  payments: defineTable({
    bookingId: v.id("bookings"),
    amount: v.number(),
    currency: v.string(),
    paymentMethod: v.string(),
    paymentGateway: v.literal("duitku"),
    gatewayTransactionId: v.optional(v.string()),
    duitkuReference: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("success"),
      v.literal("failed"),
      v.literal("expired")
    ),
    paymentUrl: v.optional(v.string()),
    paidAt: v.optional(v.number()),
    failureReason: v.optional(v.string()),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_bookingId", ["bookingId"])
    .index("by_status", ["status"])
    .index("by_gatewayTransactionId", ["gatewayTransactionId"])
    .index("by_duitkuReference", ["duitkuReference"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    parentId: v.optional(v.id("categories")),
    order: v.number(),
    isActive: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_parentId", ["parentId"])
    .index("by_isActive", ["isActive"]),
});
