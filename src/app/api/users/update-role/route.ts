import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clerkUserId, role } = body;

    if (!clerkUserId || !role) {
      return NextResponse.json(
        { error: "Missing clerkUserId or role" },
        { status: 400 }
      );
    }

    const client = await clerkClient();

    // Update user metadata
    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        role: role,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating Clerk user metadata:", error);
    return NextResponse.json(
      {
        error: "Failed to update user metadata",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

