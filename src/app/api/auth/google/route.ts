import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/lib/db";
import { createSessionToken, COOKIE_OPTIONS } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, avatarUrl, intent } = body;

    const userEmail = email ? email.toLowerCase().trim() : "demo.user@gmail.com";
    const userName = name ? name.trim() : "Google Learner";
    const userAvatar = avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200";

    let user = await findUserByEmail(userEmail);
    let isNewAccount = false;

    if (!user) {
      // Create new user for Google OAuth
      isNewAccount = true;
      const initialRole = intent === "mentor" ? "MENTOR" : "LEARNER";
      user = await createUser({
        name: userName,
        email: userEmail,
        avatarUrl: userAvatar,
        roles: [initialRole],
        activeRole: initialRole,
        emailVerified: true,
        learnerOnboardingComplete: false,
        mentorOnboardingComplete: false,
      });
    }

    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl || undefined,
      roles: user.roles,
      activeRole: user.activeRole,
      learnerOnboardingComplete: user.learnerOnboardingComplete,
      mentorOnboardingComplete: user.mentorOnboardingComplete,
    });

    const res = NextResponse.json({
      success: true,
      isNewAccount,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        roles: user.roles,
        activeRole: user.activeRole,
        learnerOnboardingComplete: user.learnerOnboardingComplete,
        mentorOnboardingComplete: user.mentorOnboardingComplete,
      },
    });

    res.cookies.set(COOKIE_OPTIONS.name, token, COOKIE_OPTIONS.options);
    return res;
  } catch (error) {
    console.error("Google auth error:", error);
    return NextResponse.json(
      { success: false, message: "Google authentication failed." },
      { status: 500 }
    );
  }
}
