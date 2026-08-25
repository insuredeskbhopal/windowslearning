import { NextRequest, NextResponse } from "next/server";
import { getMentorsFromDb } from "@/lib/db";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const mentors = await getMentorsFromDb();

    const mentor = mentors.find(
      (m) =>
        m.slug.toLowerCase() === slug.toLowerCase() ||
        m.id.toLowerCase() === slug.toLowerCase()
    );

    if (!mentor) {
      return NextResponse.json(
        { success: false, message: "Mentor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, mentor });
  } catch (error: any) {
    console.error("Error fetching mentor profile by slug:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch mentor" },
      { status: 500 }
    );
  }
}
