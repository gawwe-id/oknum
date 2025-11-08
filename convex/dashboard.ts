import { query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./auth";

// Admin Dashboard - Overview sistem secara keseluruhan
export const getAdminDashboard = query({
  args: {},
  handler: async (ctx) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is an admin
    if (currentUser.role !== "admin") {
      throw new Error("Unauthorized: Only admins can access this query");
    }

    // Get total students
    const students = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "student"))
      .collect();
    const totalStudents = students.length;

    // Get total experts
    const experts = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "expert"))
      .collect();
    const totalExperts = experts.length;

    // Get total classes
    const allClasses = await ctx.db.query("classes").collect();
    const totalClasses = allClasses.length;

    // Get active classes (published)
    const activeClasses = allClasses.filter(
      (c) => c.status === "published"
    ).length;

    // Get total bookings
    const allBookings = await ctx.db.query("bookings").collect();
    const totalBookings = allBookings.length;

    // Get pending bookings
    const pendingBookings = allBookings.filter(
      (b) => b.status === "pending"
    ).length;

    // Get all successful payments
    const successfulPayments = await ctx.db
      .query("payments")
      .withIndex("by_status", (q) => q.eq("status", "success"))
      .collect();
    const totalPayments = successfulPayments.length;

    // Calculate total revenue (grouped by currency)
    const totalRevenue: Record<string, number> = {};
    successfulPayments.forEach((payment) => {
      const currency = payment.currency;
      totalRevenue[currency] = (totalRevenue[currency] || 0) + payment.amount;
    });

    // Get recent bookings (limit 10, sorted by createdAt desc)
    const recentBookings = allBookings
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10)
      .map(async (booking) => {
        const classItem = await ctx.db.get(booking.classId);
        const student = await ctx.db.get(booking.userId);
        return {
          ...booking,
          className: classItem?.title || "Unknown Class",
          studentName: student?.name || "Unknown Student",
        };
      });

    // Get recent payments (limit 10, sorted by createdAt desc)
    const recentPayments = successfulPayments
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10)
      .map(async (payment) => {
        const booking = await ctx.db.get(payment.bookingId);
        if (!booking) return null;
        const classItem = await ctx.db.get(booking.classId);
        const student = await ctx.db.get(booking.userId);
        return {
          ...payment,
          className: classItem?.title || "Unknown Class",
          studentName: student?.name || "Unknown Student",
        };
      });

    return {
      totalStudents,
      totalExperts,
      totalClasses,
      totalRevenue,
      totalBookings,
      totalPayments,
      activeClasses,
      pendingBookings,
      recentBookings: await Promise.all(recentBookings),
      recentPayments: (await Promise.all(recentPayments)).filter(
        (p) => p !== null
      ),
    };
  },
});

// Expert Dashboard - Data spesifik untuk expert yang login
export const getExpertDashboard = query({
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
        totalStudents: 0,
        totalClasses: 0,
        totalRevenue: {},
        activeClasses: 0,
        totalBookings: 0,
        upcomingSchedules: 0,
        recentEnrollments: [],
        recentRevenue: [],
      };
    }

    const expert = await ctx.db.get(currentUser.expertId);
    if (!expert) {
      return {
        totalStudents: 0,
        totalClasses: 0,
        totalRevenue: {},
        activeClasses: 0,
        totalBookings: 0,
        upcomingSchedules: 0,
        recentEnrollments: [],
        recentRevenue: [],
      };
    }

    // Get all classes by this expert
    const expertClasses = await ctx.db
      .query("classes")
      .withIndex("by_expertId", (q) => q.eq("expertId", expert._id))
      .collect();

    const totalClasses = expertClasses.length;
    const activeClasses = expertClasses.filter(
      (c) => c.status === "published"
    ).length;

    const classIds = expertClasses.map((c) => c._id);
    const classMap = new Map(classIds.map((id, i) => [id, expertClasses[i]]));

    // Get all bookings for these classes
    const allBookings = await Promise.all(
      classIds.map(async (classId) => {
        return await ctx.db
          .query("bookings")
          .withIndex("by_classId", (q) => q.eq("classId", classId))
          .collect();
      })
    );

    const bookings = allBookings.flat();
    const totalBookings = bookings.length;

    // Get unique students from bookings
    const uniqueStudentIds = new Set<string>();
    bookings.forEach((booking) => {
      uniqueStudentIds.add(booking.userId);
    });
    const totalStudents = uniqueStudentIds.size;

    // Get upcoming schedules for expert's classes
    const allSchedules = await Promise.all(
      classIds.map(async (classId) => {
        return await ctx.db
          .query("schedules")
          .withIndex("by_classId", (q) => q.eq("classId", classId))
          .collect();
      })
    );

    const schedules = allSchedules.flat();
    const now = new Date().toISOString();
    const upcomingSchedules = schedules.filter(
      (s) => s.status === "upcoming" && s.startDate >= now
    ).length;

    // Get successful payments for these bookings
    const paidBookings = bookings.filter((b) => b.paymentStatus === "paid");

    const revenueItems = await Promise.all(
      paidBookings.map(async (booking) => {
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
          amount: payment.amount,
          currency: payment.currency,
          paidAt: payment.paidAt || payment.createdAt,
        };
      })
    );

    const successfulRevenue = revenueItems.filter((item) => item !== null);

    // Calculate total revenue (grouped by currency)
    const totalRevenue: Record<string, number> = {};
    successfulRevenue.forEach((item) => {
      if (item) {
        const currency = item.currency;
        totalRevenue[currency] = (totalRevenue[currency] || 0) + item.amount;
      }
    });

    // Get recent enrollments (bookings, limit 10)
    const recentEnrollments = bookings
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10)
      .map(async (booking) => {
        const classItem = classMap.get(booking.classId);
        const student = await ctx.db.get(booking.userId);
        return {
          ...booking,
          className: classItem?.title || "Unknown Class",
          studentName: student?.name || "Unknown Student",
        };
      });

    // Get recent revenue (limit 10)
    const recentRevenue = successfulRevenue
      .sort((a, b) => (b?.paidAt || 0) - (a?.paidAt || 0))
      .slice(0, 10);

    return {
      totalStudents,
      totalClasses,
      totalRevenue,
      activeClasses,
      totalBookings,
      upcomingSchedules,
      recentEnrollments: await Promise.all(recentEnrollments),
      recentRevenue,
    };
  },
});

// Student Dashboard - Data spesifik untuk student yang login
export const getStudentDashboard = query({
  args: {},
  handler: async (ctx) => {
    // Get authenticated user
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Verify user is a student
    if (currentUser.role !== "student") {
      throw new Error("Unauthorized: Only students can access this query");
    }

    // Get all bookings for this student
    const studentBookings = await ctx.db
      .query("bookings")
      .withIndex("by_userId", (q) => q.eq("userId", currentUser._id))
      .collect();

    // Get total classes enrolled (confirmed or completed)
    const enrolledBookings = studentBookings.filter(
      (b) => b.status === "confirmed" || b.status === "completed"
    );
    const totalClasses = enrolledBookings.length;

    // Get completed classes
    const completedClasses = studentBookings.filter(
      (b) => b.status === "completed"
    ).length;

    // Get pending bookings
    const pendingBookings = studentBookings.filter(
      (b) => b.status === "pending"
    ).length;

    // Get upcoming schedules from confirmed bookings
    const confirmedBookings = studentBookings.filter(
      (b) => b.status === "confirmed"
    );

    const upcomingScheduleItems = await Promise.all(
      confirmedBookings.flatMap(async (booking) => {
        const classItem = await ctx.db.get(booking.classId);
        if (!classItem) return [];

        const schedules = await Promise.all(
          booking.scheduleIds.map(async (scheduleId) => {
            const schedule = await ctx.db.get(scheduleId);
            if (!schedule) return null;
            if (schedule.status === "upcoming") {
              const now = new Date().toISOString();
              if (schedule.startDate >= now) {
                return {
                  scheduleId: schedule._id,
                  classId: booking.classId,
                  className: classItem.title,
                  sessionNumber: schedule.sessionNumber,
                  sessionTitle: schedule.sessionTitle,
                  startDate: schedule.startDate,
                  endDate: schedule.endDate,
                  startTime: schedule.startTime,
                  endTime: schedule.endTime,
                  location: schedule.location,
                };
              }
            }
            return null;
          })
        );

        return schedules.filter((s) => s !== null);
      })
    );

    const upcomingSchedules = upcomingScheduleItems.flat();
    const incomingClasses = upcomingSchedules.length;

    // Get total spent (from successful payments)
    const paidBookings = studentBookings.filter(
      (b) => b.paymentStatus === "paid" && b.paymentId
    );

    const payments = await Promise.all(
      paidBookings.map(async (booking) => {
        if (!booking.paymentId) return null;
        const payment = await ctx.db.get(booking.paymentId);
        if (!payment || payment.status !== "success") return null;
        return payment;
      })
    );

    const successfulPayments = payments.filter((p) => p !== null);

    // Calculate total spent (grouped by currency)
    const totalSpent: Record<string, number> = {};
    successfulPayments.forEach((payment) => {
      if (payment) {
        const currency = payment.currency;
        totalSpent[currency] = (totalSpent[currency] || 0) + payment.amount;
      }
    });

    // Get recent bookings (limit 10)
    const recentBookings = studentBookings
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10)
      .map(async (booking) => {
        const classItem = await ctx.db.get(booking.classId);
        const schedules = await Promise.all(
          booking.scheduleIds.map((id) => ctx.db.get(id))
        );
        return {
          ...booking,
          className: classItem?.title || "Unknown Class",
          schedules: schedules.filter((s) => s !== null),
        };
      });

    return {
      totalClasses,
      incomingClasses,
      completedClasses,
      pendingBookings,
      totalSpent,
      upcomingSchedules,
      recentBookings: await Promise.all(recentBookings),
    };
  },
});
