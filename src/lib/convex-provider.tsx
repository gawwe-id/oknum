"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
  // Allow public queries to run without authentication
  // Set to false so public queries (like getPublishedClassCategories) can work for unauthenticated users
  expectAuth: false,
});

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ConvexQueryCacheProvider>{children}</ConvexQueryCacheProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
