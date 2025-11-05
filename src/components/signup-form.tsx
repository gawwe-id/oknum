"use client";

import { SignUp } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center", className)}
      {...props}
    >
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-none",
          },
        }}
        routing="path"
        path="/signup"
        signInUrl="/login"
        afterSignUpUrl="/overview"
      />
    </div>
  );
}
