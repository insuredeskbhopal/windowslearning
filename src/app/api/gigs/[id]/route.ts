import { NextRequest, NextResponse } from "next/server";
import { getLearningGigById } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const gig = await getLearningGigById(id);

    if (!gig) {
      return NextResponse.json(
        { success: false, message: "Learning request not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, gig });
  } catch (error: any) {
    console.error("Fetch gig error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch gig." },
      { status: 500 }
    );
  }
}
