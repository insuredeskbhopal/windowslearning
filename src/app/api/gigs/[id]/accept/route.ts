import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { acceptGigApplication } from "@/lib/db";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in as the learner." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await req.json();
    const { applicationId } = body;

    if (!applicationId) {
      return NextResponse.json(
        { success: false, message: "Application ID is required." },
        { status: 400 }
      );
    }

    const result = await acceptGigApplication(id, applicationId, session.id);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Accept gig application error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to accept mentor application." },
      { status: 500 }
    );
  }
}
