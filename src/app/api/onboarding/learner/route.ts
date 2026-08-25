import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies, createSessionToken, COOKIE_OPTIONS } from "@/lib/auth";
import { saveLearnerProfile, findUserById } from "@/lib/db";

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
    const { interestedSkills, primaryGoal, experienceLevel, lookingFor, timeCommitment } = body;

    await saveLearnerProfile(session.id, {
      interestedSkills: interestedSkills || [],
      primaryGoal: primaryGoal || "personal",
      experienceLevel: experienceLevel || "Beginner",
      lookingFor: lookingFor || "mentor",
      timeCommitment: timeCommitment || "3-5 hours/week",
    });

    const updatedUser = await findUserById(session.id);
    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    // Refresh token with updated onboarding state
    const token = await createSessionToken({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      avatarUrl: updatedUser.avatarUrl || undefined,
      roles: updatedUser.roles,
      activeRole: updatedUser.activeRole,
      learnerOnboardingComplete: updatedUser.learnerOnboardingComplete,
      mentorOnboardingComplete: updatedUser.mentorOnboardingComplete,
    });

    const res = NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        roles: updatedUser.roles,
        activeRole: updatedUser.activeRole,
        learnerOnboardingComplete: updatedUser.learnerOnboardingComplete,
        mentorOnboardingComplete: updatedUser.mentorOnboardingComplete,
      },
    });

    res.cookies.set(COOKIE_OPTIONS.name, token, COOKIE_OPTIONS.options);
    return res;
  } catch (error) {
    console.error("Learner onboarding error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save learner profile." },
      { status: 500 }
    );
  }
}
