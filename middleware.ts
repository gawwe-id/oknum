import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/overview",
  "/settings",
  "/classes",
  "/classes/:id",
  "/room",
  "/room/:id",
  "/consultant",
  "/consultant/:id",
  "/payment-invoices",
  "/contact-us",
]);

const isAuthRoute = createRouteMatcher(["/login", "/signup"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If user is authenticated and trying to access login/signup, redirect to overview
  if (userId) {
    if (
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/signup")
    ) {
      return NextResponse.redirect(new URL("/overview", req.url));
    }
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }

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
