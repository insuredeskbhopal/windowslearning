import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/lib/db";
import { createSessionToken, COOKIE_OPTIONS } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { credential, accessToken, email, name, avatarUrl, intent } = body;

    let userEmail = email ? email.toLowerCase().trim() : "";
    let userName = name ? name.trim() : "";
    let userAvatar = avatarUrl || "";

    // 1. If OAuth2 access_token was supplied, fetch userinfo from Google
    if (accessToken) {
      try {
        const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (userInfoRes.ok) {
          const info = await userInfoRes.json();
          userEmail = info.email?.toLowerCase().trim() || userEmail;
          userName = info.name || info.given_name || userName;
          userAvatar = info.picture || userAvatar;
        }
      } catch (err) {
        console.warn("Failed to fetch Google userinfo with access token:", err);
      }
    }

    // 2. If Google ID Token credential was supplied, verify with Google's tokeninfo API
    if (!userEmail && credential) {
      try {
        const verifyRes = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
        );
        if (verifyRes.ok) {
          const googleData = await verifyRes.json();
          userEmail = googleData.email?.toLowerCase().trim() || userEmail;
          userName = googleData.name || googleData.given_name || userName;
          userAvatar = googleData.picture || userAvatar;
        }
      } catch (err) {
        console.warn("Failed to reach Google tokeninfo API:", err);
      }
    }

    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: "Google email address is required." },
        { status: 400 }
      );
    }

    if (!userName) {
      userName = userEmail.split("@")[0];
    }

    let user = await findUserByEmail(userEmail);
    let isNewAccount = false;

    if (!user) {
      // Create new user for Google OAuth in PostgreSQL
      isNewAccount = true;
      const initialRole = intent === "mentor" ? "MENTOR" : "LEARNER";
      user = await createUser({
        name: userName,
        email: userEmail,
        avatarUrl: userAvatar || undefined,
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
