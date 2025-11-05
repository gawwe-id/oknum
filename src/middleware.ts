import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Student routes - no prefix
const studentRoutes = createRouteMatcher([
  "/overview",
  "/settings",
  "/classes",
  "/room",
  "/consultant",
  "/payment-invoices",
  "/contact-us",
]);

// Expert routes - /expert/* prefix
const expertRoutes = createRouteMatcher(["/expert(.*)"]);

// Admin routes - /admin/* prefix
const adminRoutes = createRouteMatcher(["/admin(.*)"]);

// All protected routes (student, expert, admin)
const protectedRoutes = createRouteMatcher([
  "/overview",
  "/settings",
  "/classes",
  "/room",
  "/consultant",
  "/payment-invoices",
  "/contact-us",
  "/expert(.*)",
  "/admin(.*)",
]);

const isAuthRoute = createRouteMatcher(["/login", "/signup"]);

// Helper function to get user role from Convex
async function getUserRole(
  userId: string
): Promise<"student" | "expert" | "admin"> {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    console.error("NEXT_PUBLIC_CONVEX_URL is not set");
    return "student"; // Default to student
  }

  try {
    const response = await fetch(
      `${convexUrl}/get-user-role?userId=${encodeURIComponent(userId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch user role:", response.status);
      return "student"; // Default to student
    }

    const data = await response.json();
    return (data.role || "student") as "student" | "expert" | "admin";
  } catch (error) {
    console.error("Error fetching user role:", error);
    return "student"; // Default to student
  }
}

// Helper function to get default route for a role
function getDefaultRouteForRole(role: "student" | "expert" | "admin"): string {
  switch (role) {
    case "expert":
      return "/expert/overview";
    case "admin":
      return "/admin/overview";
    case "student":
    default:
      return "/overview";
  }
}

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const pathname = req.nextUrl.pathname;

  // If user is authenticated and trying to access login/signup, redirect based on role
  if (userId) {
    if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
      const role = await getUserRole(userId);
      const defaultRoute = getDefaultRouteForRole(role);
      return NextResponse.redirect(new URL(defaultRoute, req.url));
    }
  }

  // Check if route is protected
  if (protectedRoutes(req)) {
    await auth.protect();

    // Only check role-based access if user is authenticated
    if (userId) {
      const userRole = await getUserRole(userId);

      // Check if user is accessing routes for their role
      const isStudentRoute = studentRoutes(req);
      const isExpertRoute = expertRoutes(req);
      const isAdminRoute = adminRoutes(req);

      // Redirect if user tries to access routes for other roles
      if (userRole === "student" && (isExpertRoute || isAdminRoute)) {
        return NextResponse.redirect(new URL("/overview", req.url));
      }

      if (userRole === "expert" && (isStudentRoute || isAdminRoute)) {
        return NextResponse.redirect(new URL("/expert/overview", req.url));
      }

      if (userRole === "admin" && (isStudentRoute || isExpertRoute)) {
        return NextResponse.redirect(new URL("/admin/overview", req.url));
      }
    }
  }

  // Allow auth routes to proceed
  if (isAuthRoute(req)) {
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
