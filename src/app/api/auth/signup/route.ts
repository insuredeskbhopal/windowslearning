import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "@/lib/db";
import { createSessionToken, COOKIE_OPTIONS } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, intent } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Please enter your full name." },
        { status: 400 }
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists. Please login instead.",
        },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Initial role based on intent
    const initialRole = intent === "mentor" ? "MENTOR" : "LEARNER";
    const initialRoles = [initialRole];

    const newUser = await createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      roles: initialRoles,
      activeRole: initialRole,
      emailVerified: false,
      learnerOnboardingComplete: false,
      mentorOnboardingComplete: false,
    });

    const token = await createSessionToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      avatarUrl: newUser.avatarUrl || undefined,
      roles: newUser.roles,
      activeRole: newUser.activeRole,
      learnerOnboardingComplete: newUser.learnerOnboardingComplete,
      mentorOnboardingComplete: newUser.mentorOnboardingComplete,
    });

    const res = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        roles: newUser.roles,
        activeRole: newUser.activeRole,
        learnerOnboardingComplete: newUser.learnerOnboardingComplete,
        mentorOnboardingComplete: newUser.mentorOnboardingComplete,
      },
    });

    res.cookies.set(COOKIE_OPTIONS.name, token, COOKIE_OPTIONS.options);
    return res;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
