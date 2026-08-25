import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { findUserById } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const freshUser = await findUserById(session.id);
    if (!freshUser) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: freshUser.id,
        name: freshUser.name,
        email: freshUser.email,
        avatarUrl: freshUser.avatarUrl,
        roles: freshUser.roles,
        activeRole: freshUser.activeRole,
        learnerOnboardingComplete: freshUser.learnerOnboardingComplete,
        mentorOnboardingComplete: freshUser.mentorOnboardingComplete,
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
