import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAuthRoute = createRouteMatcher(["/login", "/signup"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isExpertRoute = createRouteMatcher(["/expert(.*)"]);
const isStudentRoute = createRouteMatcher([
  "/overview",
  "/settings",
  "/classes",
  "/room",
  "/consultant",
  "/payment-invoices",
  "/contact-us",
]);

// Helper function to get default route for a role
function getDefaultRouteForRole(
  role: "student" | "expert" | "admin" | null
): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "expert":
      return "/expert";
    case "student":
    default:
      return "/overview";
  }
}

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  const role = (await auth()).sessionClaims?.metadata?.role;

  // Check user roles
  const isRoleStudent = role === "student";
  const isRoleExpert = role === "expert";
  const isRoleAdmin = role === "admin";

  // Determine user's actual role
  let userRole: "student" | "expert" | "admin" | null = null;
  if (isRoleAdmin) userRole = "admin";
  else if (isRoleExpert) userRole = "expert";
  else if (isRoleStudent) userRole = "student";

  // If user is authenticated and trying to access login/signup, redirect based on role
  if (userId && isAuthRoute(req)) {
    const defaultRoute = getDefaultRouteForRole(userRole);
    return NextResponse.redirect(new URL(defaultRoute, req.url));
  }

  // Only check role-based redirects if user is authenticated
  if (!userId) {
    return NextResponse.next();
  }

  // Scenario 1: Student accessing admin or expert routes → redirect to /overview
  if (userRole === "student") {
    if (isAdminRoute(req) || isExpertRoute(req)) {
      return NextResponse.redirect(new URL("/overview", req.url));
    }
  }

  // Scenario 2: Admin accessing student routes or expert routes → redirect to /admin
  if (userRole === "admin") {
    if (isStudentRoute(req) || isExpertRoute(req)) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // Scenario 3: Expert accessing admin routes or student routes → redirect to /expert
  if (userRole === "expert") {
    if (isAdminRoute(req) || isStudentRoute(req)) {
      return NextResponse.redirect(new URL("/expert", req.url));
    }
  }

  // Edge case: User without role trying to access protected routes
  // Redirect to default route based on attempted access
  if (userRole === null) {
    if (isAdminRoute(req) || isExpertRoute(req)) {
      // User tanpa role mencoba akses admin/expert → redirect ke student default
      return NextResponse.redirect(new URL("/overview", req.url));
    }
    // User tanpa role bisa akses student routes (default behavior)
  }

  // Final protection: Double-check for admin and expert routes
  // This handles edge cases where role check might fail
  if (isAdminRoute(req) && !isRoleAdmin) {
    const defaultRoute = getDefaultRouteForRole(userRole);
    return NextResponse.redirect(new URL(defaultRoute, req.url));
  }

  if (isExpertRoute(req) && !isRoleExpert) {
    const defaultRoute = getDefaultRouteForRole(userRole);
    return NextResponse.redirect(new URL(defaultRoute, req.url));
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
