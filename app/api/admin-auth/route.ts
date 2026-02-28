import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  return NextResponse.json({
    authenticated: password === adminPassword,
  });
}
