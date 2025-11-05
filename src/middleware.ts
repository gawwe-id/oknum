import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Protected routes - routes that require authentication
const protectedRoutes = createRouteMatcher([
  "/overview",
  "/settings",
  "/classes",
  "/room",
  "/consultant",
  "/payment-invoices",
  "/contact-us",
]);

const isAuthRoute = createRouteMatcher(["/login", "/signup"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const pathname = req.nextUrl.pathname;

  // If user is authenticated and trying to access login/signup, redirect to overview
  if (userId) {
    if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
      return NextResponse.redirect(new URL("/overview", req.url));
    }
  }

  if (protectedRoutes(req)) {
    await auth.protect();
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
