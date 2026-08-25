import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { deleteTeachingSession } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const deleted = await deleteTeachingSession(id, session.id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Session not found or unauthorized." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Session deleted." });
  } catch (error: any) {
    console.error("Delete teaching session error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete session." },
      { status: 500 }
    );
  }
}
