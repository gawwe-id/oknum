import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

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

export default http;
