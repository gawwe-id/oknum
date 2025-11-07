import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import crypto from "crypto";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { userId, getToken } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get auth token for Convex
    const token = await getToken({ template: "convex" });
    if (token) {
      convex.setAuth(token);
    }

    const body = await request.json();
    const { paymentId, customerName, customerEmail, customerPhone } = body;

    if (!paymentId || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get payment details from Convex
    const payment = await convex.query(api.payments.getPaymentById, {
      paymentId,
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    // Get booking details
    const booking = await convex.query(api.bookings.getBookingById, {
      bookingId: payment.bookingId,
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Get Duitku credentials from environment
    const merchantCode = process.env.DUITKU_MERCHANT_CODE;
    const apiKey = process.env.DUITKU_API_KEY;
    const baseUrl =
      process.env.DUITKU_BASE_URL || "https://sandbox.duitku.com";

    if (!merchantCode || !apiKey) {
      return NextResponse.json(
        { error: "Duitku credentials not configured" },
        { status: 500 }
      );
    }

    // Get base URL for callback and return URLs
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const host = request.headers.get("host") || "localhost:3000";
    const baseAppUrl = `${protocol}://${host}`;

    // Get Convex HTTP endpoint URL for callback
    // Convex HTTP endpoints use .convex.site domain
    // Extract deployment name from NEXT_PUBLIC_CONVEX_URL (e.g., https://xxx.convex.cloud -> xxx.convex.site)
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
    let convexHttpUrl = "";
    
    if (convexUrl) {
      // Extract deployment name and construct HTTP endpoint URL
      // Format: https://deployment-name.convex.site
      const urlMatch = convexUrl.match(/https?:\/\/([^.]+)\.convex\.(cloud|site)/);
      if (urlMatch) {
        convexHttpUrl = `https://${urlMatch[1]}.convex.site`;
      } else {
        // Fallback: try to use CONVEX_SITE_URL if available
        convexHttpUrl = process.env.CONVEX_SITE_URL || convexUrl.replace(".convex.cloud", ".convex.site");
      }
    }

    // Use Convex HTTP endpoint for callback, fallback to Next.js API route if not available
    const callbackUrl = convexHttpUrl
      ? `${convexHttpUrl}/duitku-callback`
      : `${baseAppUrl}/api/payments/callback`;

    // Prepare Duitku payment request
    const merchantOrderId = paymentId;
    const paymentRequest = {
      merchantCode,
      paymentAmount: payment.amount,
      merchantOrderId,
      productDetails: `Booking for ${booking.classItem?.title || "Class"}`,
      customerVaName: customerName,
      customerEmail: customerEmail,
      customerPhone: customerPhone || "",
      callbackUrl,
      returnUrl: `${baseAppUrl}/classes/payment/success?paymentId=${paymentId}`,
      paymentMethod: payment.paymentMethod,
      signature: "", // Will be calculated below
    };

    // Calculate signature (MD5 hash)
    const signatureString = `${merchantCode}${merchantOrderId}${payment.amount}${apiKey}`;
    const signature = crypto
      .createHash("md5")
      .update(signatureString)
      .digest("hex");
    paymentRequest.signature = signature;

    // Make request to Duitku API
    const response = await fetch(`${baseUrl}/webapi/api/merchant/v2/inquiry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Duitku API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to initiate payment", details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();

    // Check if response is successful
    if (result.statusCode !== "00") {
      return NextResponse.json(
        {
          error: result.statusMessage || "Failed to initiate payment",
        },
        { status: 400 }
      );
    }

    // Update payment with Duitku response via Convex mutation
    await convex.mutation(api.payments.updatePaymentStatus, {
      paymentId,
      status: result.statusCode === "00" ? "processing" : "failed",
      gatewayTransactionId: result.reference,
      duitkuReference: result.reference,
      paymentUrl: result.paymentUrl,
      metadata: result,
    });

    return NextResponse.json({
      paymentUrl: result.paymentUrl,
      reference: result.reference,
      status: result.statusCode === "00" ? "processing" : "failed",
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

