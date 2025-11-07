"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { CheckCircle2, XCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const reference = searchParams.get("reference");
  const resultCode = searchParams.get("resultCode");

  const isSuccess = resultCode === "00";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-6">
            {isSuccess ? (
              <>
                <div className="rounded-full bg-emerald-100 p-4">
                  <CheckCircle2 className="size-12 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold">Payment Successful!</h1>
                  <p className="text-muted-foreground">
                    Your payment has been processed successfully.
                  </p>
                </div>
                {reference && (
                  <div className="w-full space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Reference Number
                    </p>
                    <p className="font-mono text-sm bg-muted p-2 rounded">
                      {reference}
                    </p>
                  </div>
                )}
                <div className="w-full space-y-3 pt-4">
                  <ButtonPrimary
                    onClick={() => router.push("/enrollments")}
                    className="w-full"
                  >
                    View Enrollments
                  </ButtonPrimary>
                  <ButtonPrimary
                    variant="outline"
                    onClick={() => router.push("/overview")}
                    className="w-full"
                  >
                    Back to Home
                  </ButtonPrimary>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-full bg-red-100 p-4">
                  <XCircle className="size-12 text-red-600" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold">Payment Failed</h1>
                  <p className="text-muted-foreground">
                    Your payment could not be processed. Please try again.
                  </p>
                </div>
                {reference && (
                  <div className="w-full space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Reference Number
                    </p>
                    <p className="font-mono text-sm bg-muted p-2 rounded">
                      {reference}
                    </p>
                  </div>
                )}
                <div className="w-full space-y-3 pt-4">
                  <ButtonPrimary
                    onClick={() => router.push("/enrollments")}
                    className="w-full"
                  >
                    Back to Enrollments
                  </ButtonPrimary>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

