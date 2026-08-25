import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { createTeachingSession, getTeachingSessions } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const skill = searchParams.get("skill") || undefined;
    const level = searchParams.get("level") || undefined;
    const mentorId = searchParams.get("mentorId") || undefined;

    const sessions = await getTeachingSessions({ skill, level, mentorId });
    return NextResponse.json({ success: true, sessions });
  } catch (error: any) {
    console.error("Fetch teaching sessions error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in as a mentor." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, description, learningOutcomes, skillSlug, durationMinutes, price, level, format } = body;

    if (!title || !description || !price || !skillSlug) {
      return NextResponse.json(
        { success: false, message: "Please provide session title, description, skill, and price." },
        { status: 400 }
      );
    }

    const newSession = await createTeachingSession(session.id, {
      title,
      description,
      learningOutcomes: Array.isArray(learningOutcomes) ? learningOutcomes : [learningOutcomes],
      skillSlug,
      durationMinutes: Number(durationMinutes) || 60,
      price: Number(price) || 500,
      level: level || "All Levels",
      format: format || "1:1 Live Online",
    });

    return NextResponse.json({ success: true, session: newSession });
  } catch (error: any) {
    console.error("Create teaching session error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create session" },
      { status: 500 }
    );
  }
}
