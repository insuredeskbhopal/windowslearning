import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { createLearningGig, getLearningGigs } from "@/lib/db";
import { PLATFORM_CONFIG } from "@/lib/config";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "OPEN";
    const skillSlug = searchParams.get("skill") || undefined;
    const learnerId = searchParams.get("learnerId") || undefined;

    const gigs = await getLearningGigs({ status, skillSlug, learnerId });
    return NextResponse.json({ success: true, gigs });
  } catch (error: any) {
    console.error("Fetch gigs error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch learning gigs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, description, skillSlug, level, durationMinutes, budget, preferredTime } = body;

    if (!title || !description || !skillSlug) {
      return NextResponse.json(
        { success: false, message: "Please specify what you want to learn and what help is needed." },
        { status: 400 }
      );
    }

    const proposedBudget = Number(budget) || PLATFORM_CONFIG.MINIMUM_GIG_BUDGET;
    if (proposedBudget < PLATFORM_CONFIG.MINIMUM_GIG_BUDGET) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum acceptable budget is ${PLATFORM_CONFIG.CURRENCY_SYMBOL}${PLATFORM_CONFIG.MINIMUM_GIG_BUDGET}/session.`,
        },
        { status: 400 }
      );
    }

    const newGig = await createLearningGig(session.id, {
      title,
      description,
      skillSlug,
      level: level || "Beginner",
      durationMinutes: Number(durationMinutes) || PLATFORM_CONFIG.DEFAULT_SESSION_DURATION,
      budget: proposedBudget,
      preferredTime: preferredTime || "Flexible / Evening",
    });

    return NextResponse.json({ success: true, gig: newGig });
  } catch (error: any) {
    console.error("Create learning gig error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to post learning request." },
      { status: 500 }
    );
  }
}
