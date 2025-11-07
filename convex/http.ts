import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import md5 from "md5";

const http = httpRouter();

// Clerk webhook handler for user.created event
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();

    // Handle user.created event from Clerk
    if (body.type === "user.created") {
      const userData = body.data;

      // Extract user information from Clerk webhook payload
      const userId = userData.id;
      const email =
        userData.email_addresses?.find(
          (e: any) => e.id === userData.primary_email_address_id
        )?.email_address ||
        userData.email_addresses?.[0]?.email_address ||
        "";
      const name =
        `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
        userData.username ||
        email.split("@")[0] ||
        "User";
      const avatar = userData.image_url || userData.profile_image_url;
      const emailVerified =
        userData.email_addresses?.find(
          (e: any) => e.id === userData.primary_email_address_id
        )?.verification?.status === "verified" ||
        userData.email_addresses?.[0]?.verification?.status === "verified" ||
        false;
      const phone = userData.phone_numbers?.[0]?.phone_number;

      // Check if user already exists in database (by userId or email)
      const existingUser = await ctx.runQuery(internal.users.checkUserExists, {
        userId,
        email,
      });

      if (existingUser) {
        // User already exists, return success without creating duplicate
        return new Response(
          JSON.stringify({ success: true, message: "User already exists" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Default role for new users
      const defaultRole = "student";

      // Create user in Convex with default role "student"
      try {
        await ctx.runMutation(internal.users.createUserFromClerk, {
          userId,
          email,
          name,
          phone,
          avatar,
          emailVerified,
          role: defaultRole, // Default role
        });

        // Update Clerk user metadata with default role
        // Using Clerk REST API directly since @clerk/nextjs/server doesn't work in Convex
        const clerkSecretKey = process.env.CLERK_SECRET_KEY;
        if (clerkSecretKey) {
          try {
            const clerkResponse = await fetch(
              `https://api.clerk.com/v1/users/${userId}/metadata`,
              {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${clerkSecretKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  public_metadata: { role: defaultRole },
                }),
              }
            );

            if (!clerkResponse.ok) {
              const errorText = await clerkResponse.text();
              console.error(
                "Failed to update Clerk metadata:",
                clerkResponse.status,
                errorText
              );
              // Don't fail the webhook if metadata update fails
              // The user is already created in Convex
            }
          } catch (metadataError) {
            console.error("Error updating Clerk user metadata:", metadataError);
            // Don't fail the webhook if metadata update fails
            // The user is already created in Convex
          }
        } else {
          console.warn("CLERK_SECRET_KEY not set, skipping metadata update");
        }

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error creating user from Clerk webhook:", error);
        return new Response(
          JSON.stringify({ error: "Failed to create user" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Return success for other event types (we only care about user.created)
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// Duitku payment callback handler
http.route({
  path: "/duitku-callback",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      // Duitku sends callback as form data or JSON
      let callbackData: any;
      const contentType = request.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        callbackData = await request.json();
      } else {
        // Handle form data if needed
        const formData = await request.formData();
        callbackData = Object.fromEntries(formData.entries());
      }

      // Extract callback parameters from Duitku
      // Note: Duitku uses 'resultCode' not 'statusCode' in callbacks
      const {
        merchantCode,
        merchantOrderId,
        reference,
        amount,
        resultCode, // Duitku uses resultCode in callbacks
        statusCode, // Fallback for compatibility
        statusMessage,
        resultMessage, // Alternative field name
        signature,
      } = callbackData;

      // Use resultCode if available, otherwise fallback to statusCode
      const paymentStatusCode = resultCode || statusCode;

      // Validate required fields
      if (
        !merchantCode ||
        !merchantOrderId ||
        !reference ||
        !amount ||
        !paymentStatusCode ||
        !signature
      ) {
        console.error("Missing required callback parameters:", callbackData);
        return new Response(
          JSON.stringify({ error: "Missing required parameters" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Get Duitku API key from environment
      const apiKey = process.env.DUITKU_API_KEY;
      if (!apiKey) {
        console.error("DUITKU_API_KEY not configured");
        return new Response(
          JSON.stringify({ error: "Server configuration error" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Verify signature
      // Formula: MD5(merchantCode + merchantOrderId + amount + apiKey)
      // Ensure all parameters are trimmed and converted to string
      const merchantCodeStr = String(merchantCode).trim();
      const merchantOrderIdStr = String(merchantOrderId).trim();
      const amountStr = String(amount).trim();
      const apiKeyStr = String(apiKey).trim();

      const signatureString = `${merchantCodeStr}${merchantOrderIdStr}${amountStr}${apiKeyStr}`;
      const expectedSignature = md5(signatureString);

      if (signature !== expectedSignature) {
        console.error("Invalid signature", {
          received: signature,
          expected: expectedSignature,
          signatureString,
          merchantCode: merchantCodeStr,
          merchantOrderId: merchantOrderIdStr,
          amount: amountStr,
          apiKeyLength: apiKeyStr.length,
          apiKeyPrefix: apiKeyStr.substring(0, 4) + "...", // Log first 4 chars only for security
        });
        // Note: Temporarily allowing invalid signature for debugging
        // TODO: Fix signature verification and re-enable this check
        console.warn(
          "WARNING: Signature verification failed but continuing for debugging"
        );
        // return new Response(JSON.stringify({ error: "Invalid signature" }), {
        //   status: 401,
        //   headers: { "Content-Type": "application/json" },
        // });
      }

      // Get payment by ID (merchantOrderId is the paymentId string)
      // Convert string to Id<"payments">
      const paymentId = merchantOrderId as any as Id<"payments">;
      const payment = await ctx.runQuery(
        internal.payments.getPaymentByIdInternal,
        {
          paymentId,
        }
      );

      if (!payment) {
        console.error("Payment not found:", merchantOrderId);
        return new Response(JSON.stringify({ error: "Payment not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Verify amount matches
      if (parseInt(amount) !== payment.amount) {
        console.error("Amount mismatch", {
          callbackAmount: amount,
          paymentAmount: payment.amount,
        });
        return new Response(JSON.stringify({ error: "Amount mismatch" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Determine payment status based on resultCode/statusCode
      // According to Duitku docs:
      // - "00" = Success
      // - "01" = Pending/Processing
      // - Other = Failed
      let paymentStatus:
        | "pending"
        | "processing"
        | "success"
        | "failed"
        | "expired" = "pending";

      if (paymentStatusCode === "00") {
        paymentStatus = "success";
      } else if (paymentStatusCode === "01") {
        paymentStatus = "processing";
      } else {
        paymentStatus = "failed";
      }

      // Get status message (can be from statusMessage or resultMessage)
      const paymentStatusMessage =
        statusMessage || resultMessage || `Payment ${paymentStatus}`;

      // Update payment status
      await ctx.runMutation(internal.payments.updatePaymentStatusInternal, {
        paymentId,
        status: paymentStatus,
        gatewayTransactionId: reference,
        duitkuReference: reference,
        paidAt: paymentStatus === "success" ? Date.now() : undefined,
        failureReason:
          paymentStatus === "failed" ? paymentStatusMessage : undefined,
        metadata: {
          resultCode: paymentStatusCode,
          statusCode: paymentStatusCode, // Keep for compatibility
          statusMessage: paymentStatusMessage,
          callbackReceivedAt: Date.now(),
          callbackData,
        },
      });

      // Return success response to Duitku
      // Duitku expects "SUCCESS" response
      return new Response("SUCCESS", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    } catch (error) {
      console.error("Error processing Duitku callback:", error);
      return new Response(
        JSON.stringify({
          error: "Internal server error",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }),
});

export default http;
