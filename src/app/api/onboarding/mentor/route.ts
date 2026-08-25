import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies, createSessionToken, COOKIE_OPTIONS } from "@/lib/auth";
import { saveMentorProfile, findUserById, getMentorProfileByUserId } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const profile = await getMentorProfileByUserId(session.id);
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Fetch mentor profile error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch mentor profile." },
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
    const {
      title,
      bio,
      location,
      teachingSkills,
      experienceYears,
      hourlyRate,
      isFreeCommunity,
      availability,
      preferredLanguage,
    } = body;

    if (!title || !bio || !teachingSkills || teachingSkills.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please fill in title, bio, and at least one teaching skill." },
        { status: 400 }
      );
    }

    await saveMentorProfile(session.id, {
      title,
      bio,
      location: location || "India",
      teachingSkills,
      experienceYears: Number(experienceYears) || 1,
      hourlyRate: Number(hourlyRate) || 0,
      isFreeCommunity: Boolean(isFreeCommunity),
      availability: availability || "Available Today",
      preferredLanguage: preferredLanguage || "Hindi / English",
    });

    const updatedUser = await findUserById(session.id);
    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    // Refresh token with updated dual roles and onboarding state
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
    console.error("Mentor onboarding error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save mentor profile." },
      { status: 500 }
    );
  }
}
