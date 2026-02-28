import { NextRequest, NextResponse } from "next/server";
import { addSubscriber } from "@/lib/mailerlite";
import { EmailSubmission } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: EmailSubmission = await request.json();

    if (!body.email || !body.email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Add to MailerLite (non-blocking for the user)
    const success = await addSubscriber(body);

    return NextResponse.json({
      success,
      message: success
        ? "Subscriber added successfully"
        : "Email saved (MailerLite sync pending)",
    });
  } catch (error) {
    console.error("Submit API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
