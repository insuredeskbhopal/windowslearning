import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { applyToGig } from "@/lib/db";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in as a mentor." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await req.json();
    const { proposedPrice, message } = body;

    if (!proposedPrice || !message) {
      return NextResponse.json(
        { success: false, message: "Please provide a proposed price and a pitch message." },
        { status: 400 }
      );
    }

    const application = await applyToGig(id, session.id, {
      proposedPrice: Number(proposedPrice),
      message,
    });

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error("Apply to gig error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to submit proposal." },
      { status: 500 }
    );
  }
}
