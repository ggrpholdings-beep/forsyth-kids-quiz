import { NextResponse } from "next/server";
import { activities } from "@/lib/activities";

/**
 * GET /api/activities
 * Returns all activities as JSON.
 *
 * In the future, this can be replaced with a call to the
 * WordPress REST API to pull live directory data.
 */
export async function GET() {
  return NextResponse.json({
    total: activities.length,
    activities,
  });
}
