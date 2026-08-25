import { NextRequest, NextResponse } from "next/server";
import { getMentorsFromDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get("skill") || undefined;
    const availability = searchParams.get("availability") || undefined;
    const freeOnly = searchParams.get("freeOnly") === "true";
    const search = searchParams.get("search") || undefined;

    const mentors = await getMentorsFromDb({
      skill,
      availability,
      freeOnly,
      search,
    });

    return NextResponse.json({ success: true, mentors });
  } catch (error: any) {
    console.error("Error in /api/mentors route:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch mentors from database" },
      { status: 500 }
    );
  }
}
