import { NextRequest, NextResponse } from "next/server";
import { getSkillsFromDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const difficulty = searchParams.get("difficulty") || undefined;
    const search = searchParams.get("search") || undefined;
    const featured = searchParams.get("featured") === "true";

    const skills = await getSkillsFromDb({
      category,
      difficulty,
      search,
      featured: featured ? true : undefined,
    });

    return NextResponse.json({ success: true, skills });
  } catch (error: any) {
    console.error("Error in /api/skills route:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch skills from database" },
      { status: 500 }
    );
  }
}
