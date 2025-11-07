import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount } = body;

    if (!amount || typeof amount !== "number") {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
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

    // Format datetime: yyyy-MM-dd HH:mm:ss
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);

    // Calculate signature: SHA256(merchantcode + paymentAmount + datetime + apiKey)
    const signatureString = `${merchantCode}${amount}${datetime}${apiKey}`;
    const signature = crypto.createHash("sha256").update(signatureString).digest("hex");

    // Prepare request payload
    const payload = {
      merchantcode: merchantCode,
      amount: amount,
      datetime: datetime,
      signature: signature,
    };

    // Call Duitku API
    const response = await fetch(
      `${baseUrl}/webapi/api/merchant/paymentmethod/getpaymentmethod`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Duitku API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to fetch payment methods", details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();

    // Check if response is successful
    if (result.responseCode !== "00") {
      return NextResponse.json(
        {
          error: result.responseMessage || "Failed to fetch payment methods",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      paymentMethods: result.paymentFee || [],
      responseCode: result.responseCode,
      responseMessage: result.responseMessage,
    });
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

